<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		/** Buttons or controls on the right */
		actions?: Snippet;
	}

	let { title, description, actions }: Props = $props();
</script>

<header class="reveal mx-1 mt-2 mb-5 flex flex-wrap items-end justify-between gap-4 md:mb-6">
	<div class="min-w-0">
		<h1
			class="text-[clamp(1.5rem,3vw,2rem)] leading-tight font-semibold tracking-[-0.03em] text-balance"
		>
			{title}
		</h1>
		{#if description}
			<p class="mt-1.5 max-w-[60ch] text-sm text-muted-foreground">{description}</p>
		{/if}
	</div>
	{#if actions}
		<div class="flex flex-wrap items-center gap-2">{@render actions()}</div>
	{/if}
</header>
