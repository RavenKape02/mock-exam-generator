<script lang="ts">
	// Question text plus its figure, if it has one.
	import { asset } from '$app/paths';
	import type { Question } from '#lib/types.js';
	import RichText from './RichText.svelte';
	import { figureSize } from '#lib/data/figures.js';

	interface Props {
		question: Question;
		id?: string;
	}

	// Figure paths come from the question data, so the type checker can't see they exist.
	type AssetPath = Parameters<typeof asset>[0];

	let { question, id }: Props = $props();

	const size = $derived(question.figure ? figureSize(question.figure) : null);
	// The stem's first sentence names what the figure shows ("The chart below shows …").
	const alt = $derived(`Figure: ${question.stem.split(/(?<=[.?])\s/)[0]}`);
</script>

<div class="flex flex-col gap-3">
	<div {id}>
		<RichText
			text={question.stem}
			class="max-w-[68ch] text-[clamp(1rem,0.95rem+0.3vw,1.125rem)] leading-normal font-medium tracking-[-0.01em]"
		/>
	</div>
	{#if question.figure && size}
		<figure class="w-fit max-w-full overflow-hidden rounded-xl border border-border bg-white p-2">
			<img
				src={asset(question.figure as AssetPath)}
				width={size.width}
				height={size.height}
				loading="lazy"
				{alt}
				class="h-auto max-h-[300px] w-auto max-w-full object-contain lg:max-h-[min(26dvh,300px)]"
			/>
		</figure>
	{/if}
</div>
