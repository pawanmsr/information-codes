import { getElement } from './utility.svelte';
import { PUBLIC_API, PUBLIC_MORSE, PUBLIC_PLAINTEXT } from '$env/static/public';
import { PUBLIC_APP, PUBLIC_BROKER, PUBLIC_TOPIC } from '$env/static/public';

import { Client } from '@stomp/stompjs';
import { WebSocket } from 'ws';

// Constants
const BLINK: string = 'animate-pulse';

export const client = new Client({
	brokerURL: PUBLIC_BROKER,
	onConnect: () => {
		client.subscribe(PUBLIC_TOPIC, (message) => {
			const response: Promise<PlainText> = new Promise((resolve) => {
				resolve(JSON.parse(message.body));
			});

			displayMessage(response);
		});
	}
});

export const SEPARATORS = {
	SPACE: ' ',
	CHARACTER: 3,
	WORD: 7,
	MESSAGE: 64
};

export const SYMBOL = [
	{
		NAME: 'short',
		ONE: '.',
		THREE: '-',
		SEPARATOR: 0
	},
	{
		NAME: 'long',
		ONE: 'dit',
		THREE: 'dah',
		SEPARATOR: 1
	},
	{
		NAME: 'happy',
		ONE: 'beep',
		THREE: 'boop',
		SEPARATOR: 1
	}
];

// Types
export enum MessageType {
	COMMUNICATION,
	CONNECTION,
	DISASSOCIATION
}

export interface MorseMessage {
	sender: string;
	content: string;
	type: MessageType;
}

export interface PlainText {
	content: string;
	error: string;
}

// Display functions
const scrollToBottom = async (node: HTMLElement) => {
	node.scroll({ top: node.scrollHeight });
};

export async function displayMessage(response: Promise<PlainText>) {
	let element = getElement('translation');
	const plaintext: PlainText = await response;

	if (element) {
		element.innerText += plaintext.content;
		scrollToBottom(element);
	}
}

export function checkConnection() {
	let element = getElement('connection');
	if (element) {
		if (client.connected) element.classList.remove(BLINK);
		else element.classList.add(BLINK);
	}
}

// API calls
function getStandardHeaders(): Headers {
	const headers: Headers = new Headers();
	headers.set('Content-Type', 'application/json');
	headers.set('Accept', 'application/json');

	return headers;
}

export async function post(
	message: MorseMessage,
	route: string = `${PUBLIC_API}${PUBLIC_MORSE}`
): Promise<PlainText> {
	const request: RequestInfo = new Request(route, {
		method: 'POST',
		headers: getStandardHeaders(),
		body: JSON.stringify(message)
	});

	return fetch(request).then((res) => {
		return res.json();
	});
}

export async function get(route: string = `${PUBLIC_API}${PUBLIC_PLAINTEXT}`): Promise<PlainText> {
	const request: RequestInfo = new Request(route, {
		method: 'GET',
		headers: getStandardHeaders()
	});

	return fetch(request).then((res) => {
		return res.json();
	});
}

// Transmission
client.onWebSocketError = () => {
	client.deactivate();
	checkConnection();
};

client.onWebSocketClose = () => {
	checkConnection();
};

client.onStompError = () => {
	client.deactivate();
	checkConnection();
};

export function transmit(message: MorseMessage) {
	client.publish({
		destination: `${PUBLIC_APP}${PUBLIC_MORSE}`,
		body: JSON.stringify(message)
	});
}
