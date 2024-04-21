package dev.texteditor.WebSocket;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
//import java.util.Map;

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

import dev.texteditor.DataBaseControllers.Docs.DocsController;


@Controller
@EnableScheduling
public class EditorController {

    @Autowired
    private DocsController docsController;
    HashMap<String, List<Object>> myMap = new HashMap<String,List<Object>>();

    // HashMap<String, List<List<Character>>> myMapChar = new HashMap<String,List<List<Character>>>();

    // @MessageMapping("/{id}/chat.sendData")
    // @SendTo("/topic/public/{id}")
    // public Object sendDatas(@Payload Map<String,Object> map,@DestinationVariable String id){
    //     for (Object data : map.values()) {
    //         data.getClass();
    //     }
    //     return myMap.get(id).get(1);
    // }

    @MessageMapping("/{id}/chat.sendData")
    @SendTo("/topic/public/{id}")
    public Object sendData(@Payload Object data,@DestinationVariable String id){
        myMap.get(id).set(1,data);
        return myMap.get(id).get(1);
    }

    @SuppressWarnings("null")
    @SubscribeMapping("/sub/{id}")
    public Object sendDataInit(@DestinationVariable String id,SimpMessageHeaderAccessor headerAccessor){
        System.out.println(id);
        headerAccessor.getSessionAttributes().put("id",id);
        if(myMap.get(id) == null || (Integer)myMap.get(id).get(0)  == 0)
        {
            List<Object> l = new ArrayList<Object>();
            l.add(1);
            l.add(docsController.getDocDataBack(id));
            myMap.put(id,l);
        }
        else
        {
            myMap.get(id).set(0,(Integer)myMap.get(id).get(0)+1);  
        }
        System.out.println((Integer)myMap.get(id).get(0));
        return myMap.get(id).get(1);
    }



    @EventListener
    public void onApplicationEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        @SuppressWarnings("null")
        String id = (String)sha.getSessionAttributes().get("id");
        myMap.get(id).set(0,(Integer)myMap.get(id).get(0)-1);
    }

    @SuppressWarnings("null")
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public String addUser(@Payload String data,SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("user",data);
        return data;
    }

}
