<script lang="ts">
    import { onMount } from 'svelte';

    import './page.css';
    import Tap from './Tap.svelte';
    import Push from './Push.svelte';
    import Adjust from './Adjust.svelte';
    import Connect from './Connect.svelte';
    import Indicator from './Indicator.svelte';

    import { play } from './utility.svelte';
    import { TICK } from './utility.svelte';

    import { PUBLIC_SENDER } from '$env/static/public';
    
    import { display, post, get, transmit } from './translation.svelte';
    import { type MorseMessage, MessageType } from './translation.svelte';

    import { SYMBOL } from './translation.svelte';

    let morse: string = $state("");
    const code: number = $state(2);
    const tick: number = $state(TICK.DEFAULT);

    let pushTime: number;
    let releaseTime: number = 0;

    function send() {
        const message: MorseMessage = {
            sender: PUBLIC_SENDER,
            content: morse,
            type: MessageType.COMMUNICATION
        };

        transmit(message);
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
        let spaces: number = Math.max(1, time / (3 * tick));
        
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
        if (time >= tick && time < 3 * tick) {
            record("beep");  // TODO: remove hardcoding
        } else if (time >= 3 * tick && time < 9 * tick) {
            record("boop")// TODO: remove hardcoding
        }

        if (morse.length > 32) {
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
        rounded-sm bg-slate-950 p-8 mx-4 border-4 border-gray-800
        text-stone-50 uppercase font-mono cursor-crosshair whitespace-pre-wrap"
        id="translation">
    </div>

    <div class="w-sm h-20 row-span-1 p-8 grid grid-cols-3">
        <div class="col-span-1 grid grid-cols-5">
            <div class="col-span-1 flex align-center justify-end">
                <Adjust value="+" />
            </div>
            <div class="col-span-3 flex align-center justify-center">
                <Indicator id="tick" />
            </div>
            <div class="col-span-1 flex align-center justify-start">
                <Adjust value="-" />
            </div>
        </div>

        <div class="col-span-1 flex align-center justify-center">
            <Connect onclick={connect} />
        </div>

        <div class="col-span-1 grid grid-cols-5">
            <div class="col-span-1 flex align-center justify-end">
                <Adjust value="<" />
            </div>
            <div class="col-span-3 flex align-center justify-center">
                <Indicator id="code" />
            </div>
            <div class="col-span-1 flex align-center justify-start">
                <Adjust value=">" />
            </div>
        </div>
    </div>

    <div class="w-sm h-40 row-span-2 p-8
        grid grid-cols-7">
        <div class="col-span-2 flex align-start justify-end">
            <Tap value="•" />
        </div>

        <div class="col-span-3 flex align-center justify-center">
            <Push onmousedown={pushed} onmouseup={released} onmouseleave={released} />
        </div>
        
        <div class="col-span-2 flex align-start justify-start">
            <Tap value="-" />
        </div>
    </div>
</div>
