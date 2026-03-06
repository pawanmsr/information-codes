package com.vayu.radio;

import org.junit.jupiter.api.Test;

import org.springframework.boot.test.web.server.LocalServerPort;

import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.messaging.WebSocketStompClient;

@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)
public class MessageTests {
    @LocalServerPort
    private int port;

    private WebSocketStompClient client;
	private final WebSocketHttpHeaders headers = new WebSocketHttpHeaders();
}
