package dev.texteditor.WebSocket;


import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Controller;


@Controller
@EnableScheduling
public class EditorController {



    @MessageMapping("/{id}/chat.sendData")
    @SendTo("/topic/public/{id}")
    public Object sendData(@Payload Object data,@DestinationVariable String id){
        return data;
    }


    @SuppressWarnings("null")
    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public String addUser(@Payload String data,SimpMessageHeaderAccessor headerAccessor){
        headerAccessor.getSessionAttributes().put("user",data);
        return data;
    }

}
