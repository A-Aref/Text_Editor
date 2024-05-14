package dev.texteditor.WebSocket;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import dev.texteditor.DataBaseControllers.DocTextVersion.DocTextVersion;
import dev.texteditor.DataBaseControllers.DocTextVersion.DocTextVersionRepository;
import dev.texteditor.DataBaseControllers.Docs.DocsController;
import dev.texteditor.LSEQ.CRDT;

@Controller
@EnableScheduling
public class EditorController {

    @Autowired
    private DocsController docsController;
    @Autowired
    private DocTextVersionRepository docTextVersionRepository;
    HashMap<String, Integer> noUsers = new HashMap<String, Integer>();
    HashMap<String, CRDT> docData = new HashMap<String, CRDT>();
    List<String> UserIds = new ArrayList<>();

    @SuppressWarnings("unchecked")
    @MessageMapping("/{id}/chat.sendData")
    @SendTo("/topic/public/{id}")
    public Object sendData(@Payload Map<String, Object> payload, @DestinationVariable String id) {
        if (payload.get("type").equals("insert")) {
            docData.get(id).addNode_Id(payload.get("loc").toString(), (Map<String, Object>) payload.get("data"));
        }
        if (payload.get("type").equals("delete")) {
            docData.get(id).deleteNode_Id(payload.get("loc").toString());
        }
        if (payload.get("type").equals("retain")) {
            docData.get(id).update_Id(payload.get("loc").toString(), (Map<String, Object>) payload.get("data"));
        }
        return payload;
    }

    @MessageMapping("/{id}/chat.updateData")
    @SendTo("/topic/public/update/{id}")
    public Object updateData(@Payload Map<String, Object> payload, @DestinationVariable String id) {
        ObjectId  x = new ObjectId((String)payload.get("version"));
        DocTextVersion data = docTextVersionRepository.findById(x).get();
        CRDT tempCrdt = new CRDT();
            if (docsController.getDocDataBack(id) != null) {
                @SuppressWarnings("unchecked")
                List<Object> tempList = (List<Object>) data.getText_Object();

                int counter = -1;
                for (Object item : tempList) {
                    Map<String, Object> Mitem = new HashMap<>();
                    Mitem.put("data", item);
                    Mitem.put("uuid", null);
                    tempCrdt.addNode(counter, Mitem);
                    counter++;
                }
            }
            docData.put(id, tempCrdt);

        return docData.get(id).traverseTree_node();
    }

    @SuppressWarnings("null")
    @SubscribeMapping("/sub/{id}/{userId}")
    public Object sendDataInit(@DestinationVariable String id, @DestinationVariable String userId,
            SimpMessageHeaderAccessor headerAccessor) {

        if (UserIds.contains(userId)) {
            // Disconnect client
            return "null";
        }
        UserIds.add(userId);
        headerAccessor.getSessionAttributes().put("id", id);
        headerAccessor.getSessionAttributes().put("userId", userId);
        if (noUsers.get(id) == null || noUsers.get(id) == 0) {
            noUsers.put(id, 1);
            CRDT tempCrdt = new CRDT();
            if (docsController.getDocDataBack(id) != null) {
                @SuppressWarnings("unchecked")
                List<Object> tempList = (List<Object>) docsController.getDocDataBack(id);

                int counter = -1;
                for (Object item : tempList) {
                    Map<String, Object> Mitem = new HashMap<>();
                    Mitem.put("data", item);
                    Mitem.put("uuid", null);
                    tempCrdt.addNode(counter, Mitem);
                    counter++;
                }
            }
            docData.put(id, tempCrdt);
        } else {
            noUsers.put(id, noUsers.get(id) + 1);
        }
        return docData.get(id).traverseTree_node();
    }

    @EventListener
    @SuppressWarnings("null")
    public void onApplicationEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        String id = (String) sha.getSessionAttributes().get("id");
        UserIds.remove(sha.getSessionAttributes().get("userId"));
        if (noUsers.get(id) != null) {

            noUsers.put(id, noUsers.get(id) - 1);
            if (noUsers.get(id) == 0) {
                docsController.setDocData(id, docData.get(id).traverseTree_data());
                docData.put(id, null);
            }
        }
    }

}
