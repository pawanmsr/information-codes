<script lang="ts">
	import './page.css';
	import { onMount } from 'svelte';

	import Tap from './Tap.svelte';
	import Push from './Push.svelte';
	import Adjust from './Adjust.svelte';
	import Connect from './Connect.svelte';
	import Indicator from './Indicator.svelte';

	import { TICK, INSTRUCTIONS } from './utility.svelte';
	import { displayCode, displayTick } from './utility.svelte';

	import { PUBLIC_SENDER } from '$env/static/public';

	import { SYMBOL, SEPARATORS } from './translation.svelte';
	import { displayMessage, MessageType } from './translation.svelte';
	import { post, get, transmit, client, checkConnection } from './translation.svelte';

	// Communication
	let morse: string = $state('');

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

		morse = '';
	}

	function connect() {
		displayMessage(get());

		if (!client.active) {
			client.activate();
		}

		checkConnection();
		send();
	}

	const ping = setInterval(() => {
        if (! morse.length) return ;
        if (Math.floor(releaseTime) < Math.ceil(pushTime)) return ;

		const silence = Date.now() - Math.max(pushTime, releaseTime);
		if (silence / tick > SEPARATORS.CHARACTER) send();
	}, TICK.MINIMUM * SEPARATORS.CHARACTER);

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
		if (code < 0) code += SYMBOL.length;

		displayCode(SYMBOL[code].NAME);
	}

	function next() {
		code += 1;
		if (code >= SYMBOL.length) code -= SYMBOL.length;

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
			spaces =
				Math.abs(spaces - SEPARATORS.WORD) < Math.abs(spaces - SEPARATORS.CHARACTER)
					? SEPARATORS.WORD
					: SEPARATORS.CHARACTER;
		}

		if (SEPARATORS.WORD > spaces && spaces >= SYMBOL[code].SEPARATOR) {
			spaces =
				Math.abs(spaces - SEPARATORS.CHARACTER) < Math.abs(spaces - SYMBOL[code].SEPARATOR)
					? SEPARATORS.CHARACTER
					: SYMBOL[code].SEPARATOR;
		}

		morse = morse.trim();
		if (morse.length) {
			morse += SEPARATORS.SPACE.repeat(spaces);
		}
	}

	function symbol(symbol: string) {
		if (morse.length && !morse.endsWith(' '.repeat(SYMBOL[code].SEPARATOR))) {
			morse += ' '.repeat(SYMBOL[code].SEPARATOR);
		}

		morse += symbol;
	}

	function record() {
		let time = releaseTime - pushTime;
        if (time > tick * SEPARATORS.WORD) return ;

		time = Math.min(time, TICK.DASH * tick);
		if (time > TICK.DOT * tick) {
			Math.abs(time - TICK.DOT * tick) < Math.abs(time - TICK.DASH * tick)
				? symbol(SYMBOL[code].ONE)
				: symbol(SYMBOL[code].THREE);
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

<div
	class="column-1 grid min-h-120
    grid-rows-6 place-items-center gap-4 p-4"
>
	<div
		class="row-span-3 mx-4 h-60
        w-sm cursor-crosshair overflow-y-scroll
        scroll-smooth rounded-sm border-4 border-gray-800 bg-slate-950 p-8
        font-mono wrap-break-word whitespace-pre-wrap text-stone-50 uppercase"
		id="translation"
	>
		{INSTRUCTIONS}
	</div>

	<div class="row-span-1 grid h-20 w-sm grid-cols-3 p-8">
		<div class="col-span-1 grid grid-cols-5">
			<div class="align-center col-span-1 flex justify-end">
				<Adjust value="+" onclick={slower} />
			</div>
			<div class="align-center col-span-3 flex justify-center">
				<Indicator id="tick" />
			</div>
			<div class="align-center col-span-1 flex justify-start">
				<Adjust value="-" onclick={faster} />
			</div>
		</div>

		<div class="align-center col-span-1 flex justify-center">
			<Connect onclick={connect} id="connection" />
		</div>

		<div class="col-span-1 grid grid-cols-5">
			<div class="align-center col-span-1 flex justify-end">
				<Adjust value="<" onclick={previous} />
			</div>
			<div class="align-center col-span-3 flex justify-center">
				<Indicator id="code" />
			</div>
			<div class="align-center col-span-1 flex justify-start">
				<Adjust value=">" onclick={next} />
			</div>
		</div>
	</div>

	<div
		class="row-span-2 grid h-40 w-sm
        grid-cols-7 p-8"
	>
		<div class="align-start col-span-2 flex justify-end">
			<Tap value="•" onclick={dot} />
		</div>

		<div class="align-center col-span-3 flex justify-center">
			<Push onmousedown={pushed} onmouseup={released} onmouseleave={released} />
		</div>

		<div class="align-start col-span-2 flex justify-start">
			<Tap value="-" onclick={dash} />
		</div>
	</div>
</div>
