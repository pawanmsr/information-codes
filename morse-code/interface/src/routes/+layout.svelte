<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="h-screen w-screen bg-amber-100">
    <header class="grid min-h-10 grid bg-amber-200">
        <div class="col-span-1">
        </div>

        <div class="col-span-3">
            <h1 class="text-center text-red-800 uppercase text-xl">
                Morse Radio
            </h1>
        </div>

        <div class="col-span-1">
        </div>
    </header>

    {@render children()}
</div>
