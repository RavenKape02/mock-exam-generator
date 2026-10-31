<script lang="ts">
	import '../app.css';
	import 'lenis/dist/lenis.css';
	import { onMount } from 'svelte';
	import favicon from '#lib/assets/favicon.svg';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { smoothWindow } from '#lib/motion/smooth-scroll.js';
	import type Lenis from 'lenis';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Smooth page scrolling (Lenis). SvelteKit moves the page itself on navigation, so Lenis is
	// told where the page now is instead of gliding back from the old position.
	let lenis: Lenis | undefined;
	onMount(() => {
		lenis = smoothWindow();
		return () => lenis?.destroy();
	});
	afterNavigate(() => {
		lenis?.resize();
		lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
	});

	// Cross-fade between pages with the browser's View Transitions API.
	// Browsers without it just change page.
	onNavigate((navigation) => {
		if (
			!document.startViewTransition ||
			navigation.from?.url.pathname === navigation.to?.url.pathname
		)
			return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
