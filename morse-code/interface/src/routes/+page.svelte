<script lang="ts">
    import './page.css';
    import { onMount } from 'svelte';

    import Tap from './Tap.svelte';
    import Push from './Push.svelte';
    import Adjust from './Adjust.svelte';
    import Connect from './Connect.svelte';
    import Indicator from './Indicator.svelte';

    import {TICK, INSTRUCTIONS } from './utility.svelte';
    import { displayCode, displayTick } from './utility.svelte';

    import { PUBLIC_SENDER } from '$env/static/public';
    
    import { displayMessage, MessageType } from './translation.svelte';
    import { post, get, transmit, SEPARATORS } from './translation.svelte';
    import { SYMBOL, client, checkConnection } from './translation.svelte';


    // Communication
    let morse: string = $state("");

    function message() {
        return {
            sender: PUBLIC_SENDER,
            content: morse,
            type: MessageType.COMMUNICATION
        };
    }

    function send() {
        if (client.connected) transmit(message());
        else post(message());
        
        morse = "";
    }

    function connect() {
        displayMessage(get());

        if (!client.active) {
            client.activate();
        }

        checkConnection();
        send();
    }

    // Message Configuration
    let code: number = $state(2);
    let tick: number = $state(TICK.DEFAULT);

    function faster() {
        tick -= TICK.QUANTA;
        tick = Math.max(tick, TICK.MINIMUM);

        displayTick(tick);
    }

    function slower() {
        tick += TICK.QUANTA;
        tick = Math.min(tick, TICK.MAXIMUM);

        displayTick(tick);
    }

    function previous() {
        code -= 1;
        if (code < 0)
            code += SYMBOL.length;
        
        displayCode(SYMBOL[code].NAME);
    }

    function next() {
        code += 1;
        if (code >= SYMBOL.length)
            code -= SYMBOL.length;

        displayCode(SYMBOL[code].NAME);
    }

    // Message construction
    let pushTime: number;
    let releaseTime: number = 0;

    function spaces() {
        let time = pushTime - releaseTime;
        let spaces: number = Math.max(1, time / tick);
        
        spaces = Math.min(spaces, SEPARATORS.WORD);
        if (spaces >= SEPARATORS.CHARACTER) {
            spaces = (Math.abs(spaces - SEPARATORS.WORD) < 
                Math.abs(spaces - SEPARATORS.CHARACTER) ?
                    SEPARATORS.WORD : SEPARATORS.CHARACTER);
        }

        if (spaces >= SYMBOL[code].SEPARATOR) {
            spaces = (Math.abs(spaces - SEPARATORS.CHARACTER) < 
                Math.abs(spaces - SYMBOL[code].SEPARATOR) ?
                    SEPARATORS.CHARACTER : SYMBOL[code].SEPARATOR);
        }

        morse = morse.trim();
        if (morse.length) {
            morse += SEPARATORS.SPACE.repeat(spaces);
            if (spaces == SEPARATORS.WORD) {
                send();
            }
        }
    }

    function symbol(symbol: string) {
        if (morse.length && !morse.endsWith(' ')) {
            morse += ' ';
        }

        morse += symbol;
        if (morse.length > SEPARATORS.MESSAGE) {
            send();
        }
    }

    function record() {
        let time = releaseTime - pushTime;

        time = Math.max(0, time);
        time = Math.min(time, TICK.DASH * tick);
        if (time > TICK.DOT * tick) {
            (Math.abs(time - TICK.DOT * tick) < Math.abs(time - TICK.DASH * tick) ?
                symbol(SYMBOL[code].ONE) : symbol(SYMBOL[code].THREE));
        }
    }

    // Big Button
    function pushed() {
        pushTime = Date.now();
        spaces();
    }

    function released() {
        releaseTime = Date.now();
        record();
    }

    // Accessibility Button
    function dot() {
        pushTime = Date.now();
        spaces();

        releaseTime = pushTime + TICK.DOT * tick;
        symbol(SYMBOL[code].ONE);
    }

    function dash() {
        pushTime = Date.now();
        spaces();

        releaseTime = pushTime + TICK.DASH * tick;
        symbol(SYMBOL[code].THREE);
    }

    // Initialize
    onMount(() => {
        checkConnection();

        displayTick(tick);
        displayCode(SYMBOL[code].NAME);
	});
</script>

<div class="grid grid-rows-6 min-h-120
    place-items-center column-1 p-4 gap-4">
    <div class="w-sm h-60 row-span-3
        wrap-break-word overflow-y-scroll scroll-smooth
        rounded-sm bg-slate-950 p-8 mx-4 border-4 border-gray-800
        text-stone-50 uppercase font-mono cursor-crosshair whitespace-pre-wrap"
        id="translation">
        { INSTRUCTIONS }
    </div>

    <div class="w-sm h-20 row-span-1 p-8 grid grid-cols-3">
        <div class="col-span-1 grid grid-cols-5">
            <div class="col-span-1 flex align-center justify-end">
                <Adjust value="+" onclick={slower}/>
            </div>
            <div class="col-span-3 flex align-center justify-center">
                <Indicator id="tick" />
            </div>
            <div class="col-span-1 flex align-center justify-start">
                <Adjust value="-" onclick={faster}/>
            </div>
        </div>

        <div class="col-span-1 flex align-center justify-center">
            <Connect onclick={connect} id="connection" />
        </div>

        <div class="col-span-1 grid grid-cols-5">
            <div class="col-span-1 flex align-center justify-end">
                <Adjust value="<" onclick={previous}/>
            </div>
            <div class="col-span-3 flex align-center justify-center">
                <Indicator id="code" />
            </div>
            <div class="col-span-1 flex align-center justify-start">
                <Adjust value=">" onclick={next}/>
            </div>
        </div>
    </div>

    <div class="w-sm h-40 row-span-2 p-8
        grid grid-cols-7">
        <div class="col-span-2 flex align-start justify-end">
            <Tap value="•" onclick={dot}/>
        </div>

        <div class="col-span-3 flex align-center justify-center">
            <Push onmousedown={pushed} onmouseup={released} onmouseleave={released} />
        </div>
        
        <div class="col-span-2 flex align-start justify-start">
            <Tap value="-" onclick={dash}/>
        </div>
    </div>
</div>
