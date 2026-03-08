# Morse Code

Temporal encoding with two-letter alphabet.

## Design

Modern sophisticated rebuild of an older game.

Unlike myself, experienced individuals can generate morse code for transmission lines at over 20 words per minute.

[![Morse Radio](https://i.ibb.co/GvgpwKK0/localhost-5173-03-08-2026-06-13-PM.png)](https://drive.google.com/file/d/1_bR-6_qfZOJNtEWShUGkSBxIa9Tvf_NJ/view)

### Scanner

Lexical analyser and parser programs, like those in compilers, are made use of instead of trying to match the source string to one of the target stings (in decreasing order of precedence) to obtain the translation, as was done previously. A grammar is defined, and an external tool is used to generate the scanner programs. The programs are then transferred to the receiver which actively uses them in the game.

Scanner is passive.

### Receiver

Most of the computation happens here.

Websockets perform bilateral communication using STOMP. Alternatively, spot requests from client are fulfilled using HTTP APIs, especially when two way communication becomes dysfunctional. Although, in-memory store works perfectly well, RabbitMQ can be hosted for post scaling durability. Kafka seems an overkill, but an attempt was made by linking a hosted instance with two partitions and single replication factor.

Interface -> Broker -> Receiver -> Broker -> Interface.

Translation is performed by a (parser) listener before the data is posted to its topic.

### Interface

- [Tailwind](https://tailwindcss.com/docs/compatibility)
- [Svelte](https://svelte.dev/)

#### Instructions

Do you feel like you had a *Big Button* of your own? The most interesting component of the interface is the *Red Button*, and it can be pressed as many times as one pleases. Just make sure to set the right time unit to transmit one of the three message modes. The green connect button stops blinking when the application is connected. Press it a few times to establish connection. Alternatively, press the green connect button to retrieve the translations from the receiver manually.
