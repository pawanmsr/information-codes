package com.vayu.radio;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class BroadcastMessage {
    private String time;
    private String sender;
    private String content;

    public BroadcastMessage(String sender, String content) {
        this.sender = sender;
        this.content = content;
        this.time = LocalDateTime.now().format(
            DateTimeFormatter.ofPattern("HH:mm:ss")
        );
    }

    public String getSender() {
        return sender;
    }
    
    public String getContent() {
        return content;
    }
    
    public String getTime() {
        return time;
    }
}
