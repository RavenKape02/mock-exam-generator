<script lang="ts">
	// A white dashboard card from design/reference: small heading row, optional action on the right.
	// The card is a size container, so children can lay out with @sm:, @md:, … by the card's width.
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';

	interface Props {
		title?: string;
		/** Heading id, so a list or chart inside can be labelled by it */
		titleId?: string;
		/** Entrance order (0–6); leave out for no entrance */
		i?: number;
		/** Link or control in the heading row */
		action?: Snippet;
		children: Snippet;
		class?: string;
	}

	let { title, titleId, i, action, children, class: className }: Props = $props();
</script>

<section
	class={cn(
		'card-surface @container flex min-w-0 flex-col p-4 sm:p-[18px] print:break-inside-avoid print:shadow-none',
		i !== undefined && 'reveal',
		className
	)}
	style:--i={i}
>
	{#if title || action}
		<div class="mb-3.5 flex min-h-8 items-center justify-between gap-2.5">
			{#if title}
				<h2 id={titleId} class="text-sm font-semibold tracking-[-0.01em]">{title}</h2>
			{/if}
			{#if action}
				<div class="flex items-center gap-1.5">{@render action()}</div>
			{/if}
		</div>
	{/if}
	{@render children()}
</section>
