<script lang="ts">
	// Reading passage shown beside the questions that use it.
	import type { Passage } from '#lib/types.js';
	import { cn } from '#lib/utils.js';
	import RichText from './RichText.svelte';
	import { passageParts } from './exam.js';

	interface Props {
		passage: Passage;
		/** Which questions use it, e.g. "Questions 1–4" */
		note?: string;
		class?: string;
	}

	let { passage, note, class: className }: Props = $props();

	const parts = $derived(passageParts(passage));
	const headingId = $props.id();
</script>

<article aria-labelledby={headingId} class={cn('flex flex-col gap-3', className)}>
	<header class="flex flex-col gap-0.5">
		<h2 id={headingId} class="text-[15px] font-semibold tracking-[-0.01em] text-balance">
			{parts.title ?? 'Reading passage'}
		</h2>
		{#if note}<p class="text-xs text-muted-foreground">{note}</p>{/if}
	</header>
	<RichText text={parts.body} class="max-w-[68ch] text-[15px] leading-relaxed text-foreground/90" />
</article>
