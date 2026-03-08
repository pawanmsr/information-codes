<script>
	import './page.css';

	let props = $props();
</script>

<button
	class="-translate-y-2 transform-gpu cursor-grab rounded-full
	bg-blue-800 text-center text-lg
    font-bold text-blue-50 uppercase shadow-[0_4px_0_hsl(240,100%,30%)]
	active:-translate-y-1 active:shadow-[0_1px_0_hsl(240,100%,30%)]"
	{...props}
>
	{props.value}
</button>

<style>
	button {
		width: 2em;
		height: 2em;
	}
</style>
