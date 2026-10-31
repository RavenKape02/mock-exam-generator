<script lang="ts">
	import Bloom from '#lib/components/brand/Bloom.svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import Logo from '#lib/components/brand/Logo.svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	const notFound = $derived(page.status === 404);
	const title = $derived(notFound ? "This page doesn't exist" : 'Something went wrong');
</script>

<svelte:head>
	<title>{notFound ? 'Page not found' : 'Error'} · Oplan Aral</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-dvh flex-col bg-background px-3 py-3 sm:px-6">
	<header class="px-1 pt-[env(safe-area-inset-top)] pb-3">
		<a href={resolve('')} class="-m-1 inline-flex rounded-xl p-1" aria-label="Oplan Aral home">
			<Logo wordmark size={32} />
		</a>
	</header>

	<main
		class="relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-[28px] bg-(image:--hero-gradient) px-6 py-16 text-center"
	>
		<Bloom size={120} spin class="reveal mb-8" />
		<div class="relative flex max-w-md flex-col items-center gap-3">
			<h1
				class="reveal text-[clamp(1.75rem,5vw,2.5rem)] leading-tight font-semibold tracking-[-0.03em] text-balance"
				style="--i: 1"
			>
				{title}
			</h1>
			<p class="reveal leading-relaxed text-pretty text-foreground/75" style="--i: 2">
				{#if notFound}
					The link may be old or mistyped. Let's get you back to studying.
				{:else}
					Please try again in a moment. If it keeps happening, go back to the home page.
				{/if}
			</p>
			<div class="reveal mt-3 flex flex-wrap justify-center gap-2.5" style="--i: 3">
				<Button href={resolve('')} class="h-11 rounded-full px-5 text-[0.9375rem]">
					Go to home page
				</Button>
				<Button
					href={resolve('app')}
					variant="ghost"
					class="h-11 rounded-full bg-card/70 px-5 text-[0.9375rem] hover:bg-card"
				>
					Open dashboard
				</Button>
			</div>
			<p class="mt-2 text-xs text-foreground/70 tabular-nums">Error code {page.status}</p>
		</div>
	</main>
</div>
