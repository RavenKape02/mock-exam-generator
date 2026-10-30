<script lang="ts">
	// Question, option and explanation text from the bank: paragraphs, underlined words, subscripts.
	import { cn } from '#lib/utils.js';
	import { parseText } from './exam.js';

	interface Props {
		text: string;
		class?: string;
		/** Render inline (no paragraphs), for option text */
		inline?: boolean;
	}

	let { text, class: className, inline = false }: Props = $props();

	const paragraphs = $derived(parseText(text));
	// Inline text joins its paragraphs with a space.
	const joined = $derived(paragraphs.flatMap((p, i) => (i ? [{ text: ' ' }, ...p] : p)));
</script>

{#snippet segments(list: ReturnType<typeof parseText>[number])}
	{#each list as seg, i (i)}
		{#if seg.sub}<sub>{seg.text}</sub>{:else if seg.underline}<u
				class="decoration-brand decoration-2 underline-offset-[0.22em]">{seg.text}</u
			>{:else}{seg.text}{/if}
	{/each}
{/snippet}

{#if inline}
	<span class={cn('whitespace-pre-line', className)}>{@render segments(joined)}</span>
{:else}
	<div class={cn('flex flex-col gap-3 whitespace-pre-line', className)}>
		{#each paragraphs as para, i (i)}
			<p>{@render segments(para)}</p>
		{/each}
	</div>
{/if}
