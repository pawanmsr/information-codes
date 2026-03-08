<script>
	import './page.css';

	let props = $props();
</script>

<button
	class="w-4 -translate-y-1 transform-gpu cursor-grab rounded-sm
	bg-amber-700 text-center text-lg text-amber-50
    uppercase shadow-[0_4px_0_hsl(25,100%,30%)]
	active:-translate-y-0 active:shadow-[0_1px_0_hsl(25,100%,30%)]"
	{...props}
>
	{props.value}
</button>

<style>
</style>
