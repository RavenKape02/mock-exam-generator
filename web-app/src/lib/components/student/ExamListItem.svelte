<script lang="ts">
	// One finished exam as a tappable row: score tile, title, date line, chevron.
	// Used for recent exams on the dashboard (S1) and as the phone layout of history (S4).
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { SUBJECTS, examScore, examTitle } from '#lib/data/mock.js';
	import type { ExamRecord } from '#lib/types.js';
	import { SHORT_SUBJECT, examMeta, percent } from './format.js';

	interface Props {
		exam: ExamRecord;
		/** Already resolved link to the exam's results */
		href: string;
		/** Show the score per subject under the date line */
		showSubjects?: boolean;
	}

	let { exam, href, showSubjects = false }: Props = $props();

	const score = $derived(examScore(exam));
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- callers pass a resolved href -->
<a
	{href}
	class="group flex min-h-16 items-center gap-3 rounded-[14px] px-2 py-2.5 transition-colors duration-150 hover:bg-muted focus-visible:bg-muted"
>
	<span
		class="grid h-9 w-[3.75rem] flex-none place-items-center rounded-[50%] border-[1.5px] border-brand bg-brand-soft text-[13px] font-semibold whitespace-nowrap text-accent-foreground tabular"
	>
		{score.percent}%
	</span>
	<span class="flex min-w-0 flex-1 flex-col gap-0.5">
		<span class="truncate text-sm font-medium">{examTitle(exam)}</span>
		<span class="truncate text-xs text-muted-foreground">{examMeta(exam)}</span>
		{#if showSubjects && exam.subjects.length > 1}
			<span class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
				{#each exam.subjects as s (s.slug)}
					<span class="inline-flex items-center gap-1.5 tabular">
						<span class="size-1.5 rounded-full" style:background={SUBJECTS[s.slug].color}></span>
						{SHORT_SUBJECT[s.slug]}
						<span class="font-medium text-foreground">{percent(s.correct, s.total)}%</span>
					</span>
				{/each}
			</span>
		{/if}
	</span>
	<span class="sr-only">, {score.correct} of {score.total} correct. See results</span>
	<ChevronRight
		class="size-4 flex-none text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5"
		aria-hidden="true"
	/>
</a>
