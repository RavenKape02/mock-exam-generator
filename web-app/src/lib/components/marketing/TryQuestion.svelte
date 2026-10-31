<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import { Button } from '#lib/components/ui/button/index.js';
	import { subjectQuestions } from '#lib/data/questions.js';
	import { topicName } from '#lib/data/topics.js';
	import { cn } from '#lib/utils.js';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

	// A real bank question: short, no figure, with a clear worked explanation.
	const QUESTION_ID = 'upcat-math-0048';
	const question = subjectQuestions('math')?.questions.find((q) => q.id === QUESTION_ID);
	const topic = question ? topicName('math', question.topic) : '';

	// The bank writes a few symbols in LaTeX; show them as plain characters.
	const explanation = (question?.explanation ?? '')
		.replaceAll('\\times', '×')
		.replaceAll('\\rightarrow', '→')
		.split(/\n{2,}/)
		.filter(Boolean);

	let picked = $state<string | null>(null);
	const answered = $derived(picked !== null);
	const correct = $derived(picked === question?.key);
	const result = $derived(
		correct ? 'Correct. Nice work.' : `Not quite. The answer is ${question?.key}.`
	);

	function pick(label: string) {
		if (picked === null) picked = label;
	}
</script>

{#if question}
	<div
		class={cn('card-surface flex flex-col gap-5 p-4 shadow-lift sm:p-6', className)}
		role="group"
		aria-labelledby="try-title"
	>
		<div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
			<h2 id="try-title" class="flex items-center gap-2 text-sm font-medium">
				<span class="size-2 rounded-full bg-subject-math" aria-hidden="true"></span>
				Try a real UPCAT question
			</h2>
			<span class="text-xs text-muted-foreground">Math · {topic}</span>
		</div>

		<p id="try-stem" class="text-[1.0625rem] leading-relaxed font-medium text-pretty">
			{question.stem}
		</p>

		<ul class="flex flex-col gap-2" aria-labelledby="try-stem">
			{#each question.options as option (option.label)}
				{@const isPicked = picked === option.label}
				{@const isKey = option.label === question.key}
				<li>
					<button
						type="button"
						aria-pressed={isPicked}
						aria-disabled={answered}
						onclick={() => pick(option.label)}
						class={cn(
							'flex min-h-12 w-full items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 text-left text-[0.9375rem] transition-[border-color,background-color,opacity,scale] duration-150 ease-standard',
							!answered && 'hover:border-brand/50 hover:bg-brand-soft/50 active:scale-[0.99]',
							answered && 'cursor-default',
							answered && isKey && 'border-success/40 bg-success-soft',
							answered && isPicked && !isKey && 'border-danger/40 bg-danger-soft',
							answered && !isKey && !isPicked && 'opacity-70'
						)}
					>
						<!-- Answer-sheet bubble: shades in when picked -->
						<span
							class={cn(
								'relative grid size-8 shrink-0 place-items-center rounded-full border-2 border-input text-sm font-semibold text-muted-foreground',
								isPicked && 'border-brand text-card',
								answered && isKey && !isPicked && 'border-success text-success'
							)}
							aria-hidden="true"
						>
							{#if isPicked}
								<span class="absolute inset-0.5 animate-fill rounded-full bg-brand"></span>
							{/if}
							<span class="relative">{option.label}</span>
						</span>
						<span class="min-w-0 flex-1 tabular-nums">
							<span class="sr-only">{option.label}.</span>
							{option.text}
						</span>
						{#if answered && isKey}
							<Check class="size-5 shrink-0 text-success" aria-hidden="true" />
							<span class="sr-only">Correct answer</span>
						{:else if answered && isPicked}
							<X class="size-5 shrink-0 text-danger" aria-hidden="true" />
							<span class="sr-only">Your answer</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>

		<!-- Persistent live region, so screen readers hear the result but not the whole solution -->
		<p class="sr-only" role="status">{answered ? result : ''}</p>

		<div>
			{#if answered}
				<div class="reveal flex flex-col gap-4">
					<div class="flex flex-col gap-2 rounded-2xl bg-muted p-4">
						<p class={cn('font-semibold', correct ? 'text-success' : 'text-foreground')}>
							{result}
						</p>
						{#each explanation as paragraph (paragraph)}
							<p class="text-sm leading-relaxed text-pretty text-muted-foreground">{paragraph}</p>
						{/each}
					</div>
					<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
						<Button href={resolve('signup')} class="h-11 rounded-full px-5 text-[0.9375rem]">
							Try a full mock exam
							<ArrowRight data-icon="inline-end" />
						</Button>
						<span class="text-sm text-muted-foreground"
							>Free. Four subjects, like the real test.</span
						>
					</div>
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">Pick an answer to see the solution.</p>
			{/if}
		</div>
	</div>
{/if}
