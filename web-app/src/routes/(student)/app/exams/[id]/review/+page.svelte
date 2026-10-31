<script lang="ts">
	// S6 Answer review: each question with your answer, the correct one and the explanation.
	// Prototype: the score comes from the exam record; the questions are the real sample
	// questions with answers the prototype pretends the student gave (same every visit).
	import { tick } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import Minus from '@lucide/svelte/icons/minus';
	import ListChecks from '@lucide/svelte/icons/list-checks';
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import Segmented from '#lib/components/common/Segmented.svelte';
	import ScoreRing from '#lib/components/data-viz/ScoreRing.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import Modal from '#lib/components/common/Modal.svelte';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import AnswerSheet from '#lib/components/exam/AnswerSheet.svelte';
	import OptionBubble from '#lib/components/exam/OptionBubble.svelte';
	import PassagePanel from '#lib/components/exam/PassagePanel.svelte';
	import QuestionStem from '#lib/components/exam/QuestionStem.svelte';
	import RichText from '#lib/components/exam/RichText.svelte';
	import { longDate } from '#lib/components/student/format.js';
	import {
		buildExam,
		passageParts,
		pretendAnswers,
		type BubbleStatus,
		type ExamItem
	} from '#lib/components/exam/exam.js';
	import { examScore, examTitle, finishedExam, NEW_EXAM_ID } from '#lib/data/mock.js';
	import type { SubjectSlug } from '#lib/types.js';
	import { cn } from '#lib/utils.js';

	type Filter = 'all' | 'wrong' | 'blank';
	type Result = 'correct' | 'wrong' | 'blank';

	const examId = $derived(page.params.id ?? NEW_EXAM_ID);
	const record = $derived(finishedExam(examId));
	const score = $derived(examScore(record));
	const sections = $derived(buildExam(record));
	const items = $derived(sections.flatMap((s) => s.items));
	const answers = $derived(pretendAnswers(items));

	let filter = $state<Filter>('all');
	let subject = $state<SubjectSlug | 'all'>('all');
	let current = $state(-1);
	let sheetOpen = $state(false);

	function result(item: ExamItem): Result {
		const given = answers[item.question.id];
		return !given ? 'blank' : given === item.question.key ? 'correct' : 'wrong';
	}

	const count = $derived({
		wrong: items.filter((i) => result(i) === 'wrong').length,
		blank: items.filter((i) => result(i) === 'blank').length
	});
	const shown = $derived(
		items.filter(
			(i) =>
				(subject === 'all' || i.subject === subject) && (filter === 'all' || result(i) === filter)
		)
	);
	// Mock dates are plain ISO days; longDate formats in UTC so they never shift a day.
	const date = $derived(longDate(record.date));

	const filterOptions = $derived([
		{ value: 'all' as Filter, label: 'All' },
		{ value: 'wrong' as Filter, label: `Wrong (${count.wrong})` },
		{ value: 'blank' as Filter, label: `Unanswered (${count.blank})` }
	]);
	const subjectOptions = $derived([
		{ value: 'all' as const, label: 'All subjects' },
		...sections.map((s) => ({ value: s.slug, label: s.short }))
	]);

	const status = (i: ExamItem): BubbleStatus => result(i);
	const sectionOf = (i: ExamItem) => sections.find((s) => s.slug === i.subject)!;
	/** The passage shows above the first visible question that uses it. */
	const firstWithPassage = (i: ExamItem, k: number) =>
		!!i.passage && shown[k - 1]?.passage?.id !== i.passage.id;

	async function jump(index: number) {
		const target = items[index];
		if (!shown.includes(target)) {
			filter = 'all';
			subject = 'all';
		}
		current = index;
		sheetOpen = false;
		await tick();
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		document
			.getElementById(`q-${target.question.id}`)
			?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
	}

	const LABELS: Record<Result, string> = {
		correct: 'Correct',
		wrong: 'Wrong',
		blank: 'Not answered'
	};
</script>

<svelte:head>
	<title>Answer review · Oplan Aral</title>
</svelte:head>

<PageHeader title="Answer review" description="{examTitle(record)}, {date}">
	{#snippet actions()}
		<Button
			variant="secondary"
			class="h-11 rounded-full px-4"
			href={resolve(`app/exams/${examId}/results`)}
		>
			<ArrowLeft data-icon="inline-start" /> Back to results
		</Button>
	{/snippet}
</PageHeader>

<div class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_18.5rem] lg:items-start">
	<div class="flex min-w-0 flex-col gap-4">
		<!-- Score and filters -->
		<section
			class="reveal card-surface flex flex-col gap-4 p-4 sm:p-5"
			style:--i={1}
			aria-label="Score and filters"
		>
			<div class="flex items-center gap-4">
				<ScoreRing
					value={score.correct}
					max={score.total}
					size={64}
					stroke={7}
					label="{score.percent}% correct"
				>
					<span class="text-sm font-semibold tabular">{score.percent}%</span>
				</ScoreRing>
				<div class="min-w-0 flex-1">
					<p class="font-semibold tracking-[-0.01em] tabular">
						{score.correct} of {score.total} correct
					</p>
					<p class="text-sm text-muted-foreground">
						Showing {items.length} sample questions from this exam.
					</p>
				</div>
				<Button
					variant="secondary"
					class="h-11 rounded-full px-4 lg:hidden"
					onclick={() => (sheetOpen = true)}
				>
					<ListChecks data-icon="inline-start" />
					<span class="max-sm:sr-only">Answer sheet</span>
				</Button>
			</div>
			<div class="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
				<Segmented label="Show" options={filterOptions} bind:value={filter} />
				{#if sections.length > 1}
					<div class="-mx-1 overflow-x-auto px-1 pb-0.5">
						<Segmented label="Subject" options={subjectOptions} bind:value={subject} />
					</div>
				{/if}
			</div>
		</section>

		<!-- Questions -->
		{#each shown as item, k (item.question.id)}
			{@const r = result(item)}
			{@const given = answers[item.question.id]}
			{@const sec = sectionOf(item)}
			{#if firstWithPassage(item, k) && item.passage}
				<details class="card-surface group p-4 sm:p-5">
					<summary
						class="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl text-sm font-medium [&::-webkit-details-marker]:hidden"
					>
						<span class="min-w-0">
							Passage: {passageParts(item.passage).title ?? 'Reading passage'}
						</span>
						<span class="flex-none text-muted-foreground group-open:hidden">Show</span>
						<span class="hidden flex-none text-muted-foreground group-open:inline">Hide</span>
					</summary>
					<PassagePanel passage={item.passage} class="mt-3 border-t border-border pt-4" />
				</details>
			{/if}
			<article
				id="q-{item.question.id}"
				class={cn(
					'card-surface flex scroll-mt-24 flex-col gap-4 p-4 transition-shadow duration-200 sm:p-6',
					item.index === current && 'ring-2 ring-brand'
				)}
				aria-labelledby="stem-{item.question.id}"
			>
				<p class="flex items-center gap-2 text-sm text-muted-foreground">
					<span class="size-2 rounded-full" style:background={sec.color}></span>
					{sec.name} · Question {item.n}
				</p>
				<QuestionStem question={item.question} id="stem-{item.question.id}" />

				<!-- Result right under the question (Coursera) -->
				<p
					class={cn(
						'flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl px-3 py-2 text-sm',
						r === 'correct'
							? 'bg-success-soft text-success'
							: r === 'wrong'
								? 'bg-danger-soft text-danger'
								: 'bg-muted text-muted-foreground'
					)}
				>
					<span class="flex items-center gap-1.5 font-semibold">
						{#if r === 'correct'}<Check
								class="size-4"
								aria-hidden="true"
							/>{:else if r === 'wrong'}<X class="size-4" aria-hidden="true" />{:else}<Minus
								class="size-4"
								aria-hidden="true"
							/>{/if}
						{LABELS[r]}
					</span>
					<span class="text-foreground/80">
						{#if r === 'correct'}
							You chose {given}.
						{:else if r === 'wrong'}
							You chose {given}. The answer is {item.question.key}.
						{:else}
							The answer is {item.question.key}.
						{/if}
					</span>
				</p>

				<!-- Your answer vs the correct answer (Codecademy) -->
				<ul class="flex flex-col gap-2" aria-label="Options">
					{#each item.question.options as option (option.label)}
						<li>
							<OptionBubble
								letter={option.label}
								text={option.text}
								review={option.label === given
									? r === 'correct'
										? 'correct'
										: 'wrong'
									: option.label === item.question.key
										? 'key'
										: 'idle'}
							/>
						</li>
					{/each}
				</ul>

				<section class="rounded-2xl bg-muted p-4" aria-label="Explanation">
					<h3 class="mb-1.5 text-sm font-semibold">Explanation</h3>
					{#if item.question.explanation}
						<RichText
							text={item.question.explanation}
							class="max-w-[68ch] text-sm leading-relaxed text-foreground/85"
						/>
					{:else}
						<p class="text-sm text-muted-foreground">No explanation for this question yet.</p>
					{/if}
				</section>
			</article>
		{:else}
			<Empty.Root class="card-surface border-0 py-12">
				<Empty.Header>
					<Empty.Title>Nothing to review here</Empty.Title>
					<Empty.Description>
						No {filter === 'wrong' ? 'wrong' : 'unanswered'} questions in this subject.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button
						variant="secondary"
						class="h-11 rounded-full px-4"
						onclick={() => {
							filter = 'all';
							subject = 'all';
						}}
					>
						Show all questions
					</Button>
				</Empty.Content>
			</Empty.Root>
		{/each}
	</div>

	<!-- Laptop and up: the answer sheet to jump around -->
	<aside
		class="reveal card-surface sticky top-0 hidden max-h-[calc(100dvh-3rem)] flex-col gap-3 p-4 lg:flex"
		style:--i={2}
		aria-label="Answer sheet"
	>
		<div class="px-0.5">
			<h2 class="text-sm font-semibold">Answer sheet</h2>
			<p class="text-xs text-muted-foreground">Tap a number to go to that question.</p>
		</div>
		<div class="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pt-1">
			<AnswerSheet {sections} {current} {status} onjump={jump} mode="review" />
		</div>
	</aside>
</div>

<!-- Phones and tablets: the answer sheet as a bottom sheet -->
<Modal
	bind:open={sheetOpen}
	variant="sheet"
	title="Answer sheet"
	description="{items.length -
		count.wrong -
		count.blank} correct, {count.wrong} wrong, {count.blank} not answered."
	class="gap-3 px-4 pt-5 lg:hidden"
>
	<div class="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pt-1">
		<AnswerSheet {sections} {current} {status} onjump={jump} mode="review" />
	</div>
</Modal>
