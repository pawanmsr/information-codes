package com.vayu.radio;

import com.vayu.radio.MorseMessage;
import com.vayu.radio.BroadcastMessage;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.MessageMapping;

@Controller
public class MessageController {
    private final SimpMessagingTemplate template;

    public MessageController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/morse")
    @SendTo("/topic/message")
    public BroadcastMessage handleMessage(MorseMessage message) {
        return new BroadcastMessage(
            message.getSender(),
            message.getContent()
        );
    }

    @MessageMapping("/private")
    public void handlePrivateMessage(@Payload MorseMessage message,
        @Header("simpSessionId") String sessionId) {
        template.convertAndSendToUser(
            sessionId,
            "/queue/reply",
            new BroadcastMessage(
                message.getSender(),
                message.getContent()
            )
        );
    }
}
