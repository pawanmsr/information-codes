<script>
	import './page.css';
	
    let props = $props();
</script>

<button class="text-lg transform-gpu rounded-sm bg-amber-700 w-4
	text-amber-50 uppercase text-center -translate-y-1
    active:-translate-y-0 shadow-[0_4px_0_hsl(25,100%,30%)]
	active:shadow-[0_1px_0_hsl(25,100%,30%)] cursor-grab" {...props}>
    {props.value}
</button>

<style>
</style>
