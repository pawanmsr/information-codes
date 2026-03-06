import { PUBLIC_API, PUBLIC_MORSE, PUBLIC_PLAINTEXT, PUBLIC_APP, PUBLIC_BROKER } from '$env/static/public';

import { Client } from '@stomp/stompjs';
import { WebSocket } from 'ws';

const client = new Client({
    brokerURL: PUBLIC_BROKER,
    onConnect: () => {
        client.subscribe('/topic/message', message => {
            const response = new Promise((resolve) => {
                resolve(JSON.parse(message.body));
            });
            display(JSON.parse(message.body));
        });
    },
});

client.activate();

export function transmit(message: MorseMessage) {
    client.publish({
        destination: `${PUBLIC_APP}${PUBLIC_MORSE}`,
        body: JSON.stringify(message)
    });
}

const scrollToBottom = async (node: HTMLElement) => {
    node.scroll({ top: node.scrollHeight });
};

export async function display(response: Promise<PlainText>) {
    let element = null;
    if (typeof document !== 'undefined') {
        element = document.getElementById("translation");
    }

    const plaintext: PlainText = await response;
    
    if (element) {
        element.innerText += plaintext.content;
        scrollToBottom(element);
    }
};

export enum MessageType {
    COMMUNICATION,
    CONNECTION,
    DISASSOCIATION
}

export interface MorseMessage {
    sender: string,
    content: string,
    type: MessageType
}

export interface PlainText {
    content: string,
    error: string
}

function getStandardHeaders(): Headers {
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    return headers;
}

export async function post(message: MorseMessage,
    route: string = `${PUBLIC_API}${PUBLIC_MORSE}`): Promise<PlainText> {

    const request: RequestInfo = new Request(route, {
        method: "POST",
        headers: getStandardHeaders(),
        body: JSON.stringify(message)
    });

    return fetch(request)
        .then(res => {
            return res.json();
        });
};

export async function get(route: string = `${PUBLIC_API}${PUBLIC_PLAINTEXT}`):
    Promise<PlainText> {
    const request: RequestInfo = new Request(route, {
        method: "GET",
        headers: getStandardHeaders()
    });

    return await fetch(request)
        .then(res => {
            return res.json();
        });
}
