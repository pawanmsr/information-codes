<script lang="ts">
	import './page.css';

	let props = $props();
</script>

<button
	class="m-x-2 w-sm -translate-y-2 transform-gpu animate-pulse cursor-grab rounded-sm bg-green-600
    p-2 text-green-50
    uppercase shadow-[0_4px_0_hsl(125,100%,30%)] active:-translate-y-1 active:shadow-[0_1px_0_hsl(125,100%,30%)]"
	{...props}
>
	Connect
</button>

<style>
</style>
