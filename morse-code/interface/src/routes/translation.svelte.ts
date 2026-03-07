import { PUBLIC_API, PUBLIC_MORSE, PUBLIC_PLAINTEXT } from '$env/static/public';
import { PUBLIC_APP, PUBLIC_BROKER, PUBLIC_TOPIC } from '$env/static/public';

import { Client } from '@stomp/stompjs';
import { WebSocket } from 'ws';


// Constants
const client = new Client({
    brokerURL: PUBLIC_BROKER,
    onConnect: () => {
        client.subscribe(PUBLIC_TOPIC, message => {
            const response = new Promise((resolve) => {
                resolve(JSON.parse(message.body));
            });
            display(JSON.parse(message.body));
        });
    },
});

client.activate();

export const SEPARATORS = {
    SPACE: " ",
    CHARACTER: 3,
    WORD: 7
}

export const SYMBOL = [
    {
        NAME: "short",
        ONE: '.',
        THREE: '-',
        SEPARATOR: ''
    },
    {
        NAME: "long",
        ONE: "dit",
        THREE: "dah",
        SEPARATOR: ' '
    },
    {
        NAME: "happy",
        ONE: "beep",
        THREE: "boop",
        SEPARATOR: ' '
    }
]


// Types
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

    return fetch(request)
        .then(res => {
            return res.json();
        });
}
