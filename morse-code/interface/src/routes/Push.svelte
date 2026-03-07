<script>
	import './page.css';
	
	let props = $props();
</script>

<button class="text-lg font-bold transform-gpu rounded-full
	shadow-[0_8px_0_hsl(0,100%,30%)] text-red-900 uppercase
	tracking-widest -translate-y-2 active:-translate-y-1
	active:shadow-[0_2px_0_hsl(0,100%,30%)] cursor-grab" {...props}>
	Push
</button>

<style>
	button {
		width: 6em;
		height: 6em;
		background: radial-gradient(
			circle at center,
			hsl(0, 100%, 60%) 0%,
			hsl(0, 100%, 40%) 100%
		);
	}
</style>
