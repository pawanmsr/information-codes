package com.vayu.radio;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

enum MessageType {
    CONNECTION,
    COMMUNICATION,
    DISASSOCIATION
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MorseMessage {
    private String sender;
    private String content;
    private MessageType type;
}
