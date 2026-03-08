<script>
	import './page.css';

	let props = $props();
</script>

<button
	class="-translate-y-2 transform-gpu cursor-grab rounded-full
	text-lg font-bold tracking-widest
	text-red-900 uppercase shadow-[0_8px_0_hsl(0,100%,30%)]
	active:-translate-y-1 active:shadow-[0_2px_0_hsl(0,100%,30%)]"
	{...props}
>
	Push
</button>

<style>
	button {
		width: 6em;
		height: 6em;
		background: radial-gradient(circle at center, hsl(0, 100%, 60%) 0%, hsl(0, 100%, 40%) 100%);
	}
</style>
