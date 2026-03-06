<script lang="ts">
    import './page.css';
    import Push from './Push.svelte';
    import Clear from './Connect.svelte';
    import { play } from './utility.svelte';
    import { PUBLIC_SENDER } from '$env/static/public';
    
    import { display, post, get } from './translation.svelte';
    import { type MorseMessage, MessageType } from './translation.svelte';

    const tickSize: number = 64;

    let pushTime: number;
    let releaseTime: number = 0;
    let morse: string = $state("");

    function send() {
        const message: MorseMessage = {
            sender: PUBLIC_SENDER,
            content: morse,
            type: MessageType.COMMUNICATION
        };

        post(message);
        morse = "";
    }

    function record(signal: string) {
        if (morse.length && !morse.endsWith(' ')) {
            morse += ' ';
        }

        morse += signal;
    }

    function pushed() {
        pushTime = Date.now();
        let time = pushTime - releaseTime;
        let spaces: number = Math.max(1, time / (3 * tickSize));
        
        if (spaces > 3) {
            spaces = 7;
        } else if (spaces > 1) {
            spaces = 3;
        } else {
            spaces = 1;
        }

        morse = morse.trim();
        if (morse.length) {
            morse += " ".repeat(spaces);
        }
    }

    function released() {
        releaseTime = Date.now();
        let time = releaseTime - pushTime;
        if (time >= tickSize && time < 3 * tickSize) {
            record("beep");  // TODO: remove hardcoding
        } else if (time >= 3 * tickSize && time < 9 * tickSize) {
            record("boop")// TODO: remove hardcoding
        }

        if (morse.length > 128) {
            send();
        }
    }

    function connect() {
        send();
        display(get());
    }
</script>

<div class="grid grid-rows-6 min-h-120
    place-items-center column-1 p-4 gap-4">
    <div class="w-sm h-60 row-span-3
        wrap-break-word overflow-y-scroll scroll-smooth
        rounded-sm bg-slate-950 p-8 mx-4 border-4 border-amber-400
        text-stone-50 uppercase font-mono cursor-crosshair whitespace-pre-wrap"
        id="translation">
    </div>
    <div class="w-sm h-20 row-span-1 p-8 grid grid-cols-3">
        <div class="col-span-1">
            <!-- TODO: add dit indicator -->
        </div>
        <div class="col-span-1 flex align-center justify-center">
            <Clear onclick={connect} />
        </div>
        <div class="col-span-1">
            <!-- TODO: add dah indicator -->
        </div>
    </div>
    <div class="w-sm h-40 row-span-2 p-8
        grid grid-cols-7">
        <div class="col-span-2">
            <!-- TODO: add unit time control -->
        </div>
        <div class="col-span-3 flex align-center justify-center">
            <Push onmousedown={pushed} onmouseup={released} onmouseleave={released} />
        </div>
        <div class="col-span-2">
            <!-- TODO: add signal type control -->
        </div>
    </div>
</div>
