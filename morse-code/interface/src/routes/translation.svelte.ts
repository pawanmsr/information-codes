import { PUBLIC_API, PUBLIC_MORSE, PUBLIC_PLAINTEXT } from '$env/static/public';

const scrollToBottom = async (node: HTMLElement) => {
    node.scroll({ top: node.scrollHeight });
};

export async function display(response: Promise<string>) {
    const text: string = await response;
    const element = document.getElementById("translation");
    
    if (element) {
        element.innerText = text;
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

function getStandardHeaders(): Headers {
    const headers: Headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    return headers;
}

export async function post(message: MorseMessage,
    route: string = `${PUBLIC_API}${PUBLIC_MORSE}`): Promise<string> {
    

    const request: RequestInfo = new Request(route, {
        method: "POST",
        headers: getStandardHeaders(),
        body: JSON.stringify(message)
    });

    return fetch(request)
        .then(res => {
            return res.text();
        });
};

export async function get(route: string = `${PUBLIC_API}${PUBLIC_PLAINTEXT}`):
    Promise<string> {
    const request: RequestInfo = new Request(route, {
        method: "GET",
        headers: getStandardHeaders()
    });

    return fetch(request)
        .then(res => {
            return res.text();
        });
}
