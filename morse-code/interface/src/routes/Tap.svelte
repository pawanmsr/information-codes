<script>
	import './page.css';
	
    let props = $props();
</script>

<button class="text-lg font-bold transform-gpu rounded-full
	shadow-[0_4px_0_hsl(240,100%,30%)] text-blue-50 uppercase
    text-center -translate-y-2 active:-translate-y-1 bg-blue-800
	active:shadow-[0_1px_0_hsl(240,100%,30%)] cursor-grab" {...props}>
    {props.value}
</button>

<style>
	button {
		width: 2em;
		height: 2em;
	}
</style>
