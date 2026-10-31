<script lang="ts">
	// S4 History: every finished exam. A table from 768px up, stacked rows on phones.
	// Rows go to Results (S5); New exam goes to S2.
	import { resolve } from '$app/paths';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Plus from '@lucide/svelte/icons/plus';
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import Segmented from '#lib/components/common/Segmented.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import ExamListItem from '#lib/components/student/ExamListItem.svelte';
	import Panel from '#lib/components/student/Panel.svelte';
	import {
		SHORT_SUBJECT,
		examQuestionCount,
		examTypeLabel,
		percent,
		shortDate
	} from '#lib/components/student/format.js';
	import { previewEmpty } from '#lib/components/student/preview.js';
	import { pill } from '#lib/components/student/styles.js';
	import { SUBJECTS, examScore, examTitle, exams, inProgress } from '#lib/data/mock.js';
	import type { ExamType } from '#lib/types.js';
	import { cn } from '#lib/utils.js';

	type Filter = 'all' | ExamType;

	let filter = $state<Filter>('all');

	// ?preview=empty shows the page before the first exam.
	const fresh = $derived(previewEmpty());
	const done = $derived(fresh ? [] : exams.filter((e) => e.status === 'done'));
	const shown = $derived(filter === 'all' ? done : done.filter((e) => e.type === filter));
	const saved = $derived(fresh ? undefined : inProgress);

	const emptyTitle = $derived(
		done.length === 0
			? 'No exams yet'
			: filter === 'full'
				? 'No full exams yet'
				: 'No one-subject exams yet'
	);
</script>

<svelte:head>
	<title>History · Oplan Aral</title>
</svelte:head>

<PageHeader
	title="Exam history"
	description="Every exam you finished. Open one to see your scores and review your answers."
>
	{#snippet actions()}
		<Button href={resolve('app/exams/new')} class={pill}>
			<Plus data-icon="inline-start" />
			New exam
		</Button>
	{/snippet}
</PageHeader>

<div class="flex flex-col gap-3.5">
	{#if saved}
		<div
			class="reveal card-surface flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-[18px]"
			style:--i={1}
		>
			<p class="min-w-0 flex-1 text-sm">
				<span class="font-medium">{examTitle(saved)}</span>
				<span class="text-muted-foreground">
					is not finished: {saved.answered} of {examQuestionCount(saved)} answered.
				</span>
			</p>
			<Button href={resolve(`app/exams/${saved.id}`)} variant="secondary" class={cn(pill, 'h-10')}>
				Continue exam
				<ArrowRight data-icon="inline-end" />
			</Button>
		</div>
	{/if}

	<Panel i={2}>
		<div class="mb-3 flex flex-wrap items-center justify-between gap-3">
			<h2 class="text-sm font-semibold tracking-[-0.01em]">
				{shown.length}
				{shown.length === 1 ? 'exam' : 'exams'}
			</h2>
			<Segmented
				label="Show"
				bind:value={filter}
				options={[
					{ value: 'all', label: 'All' },
					{ value: 'full', label: 'Full' },
					{ value: 'subject', label: 'One subject' }
				]}
			/>
		</div>

		{#if shown.length === 0}
			<Empty.Root class="py-10">
				<Empty.Header>
					<Empty.Media>
						<enhanced:img
							src="#lib/assets/art/empty-history.png"
							sizes="176px"
							alt=""
							class="h-auto w-44"
						/>
					</Empty.Media>
					<Empty.Title class="text-base font-semibold">{emptyTitle}</Empty.Title>
					<Empty.Description>
						{done.length === 0
							? 'Finished exams show up here with your score for each subject.'
							: 'Try another filter, or start one now.'}
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button href={resolve('app/exams/new')} class={pill}>Start an exam</Button>
				</Empty.Content>
			</Empty.Root>
		{:else}
			<!-- Phones: stacked rows -->
			<ul class="-mx-2 flex flex-col md:hidden">
				{#each shown as e (e.id)}
					<li>
						<ExamListItem exam={e} href={resolve(`app/exams/${e.id}/results`)} showSubjects />
					</li>
				{/each}
			</ul>

			<!-- Tablet and up: table; the whole row is the link -->
			<div class="hidden md:block">
				<Table.Root>
					<Table.Header>
						<Table.Row class="hover:bg-transparent">
							<Table.Head>Exam</Table.Head>
							<Table.Head>Date</Table.Head>
							<Table.Head>Type</Table.Head>
							<Table.Head class="text-right">Questions</Table.Head>
							<Table.Head class="text-right">Score</Table.Head>
							<Table.Head class="hidden lg:table-cell">By subject</Table.Head>
							<Table.Head class="w-8"><span class="sr-only">Open</span></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each shown as e (e.id)}
							{@const score = examScore(e)}
							<Table.Row class="group relative">
								<Table.Cell class="py-3.5 font-medium">
									<a
										href={resolve(`app/exams/${e.id}/results`)}
										class="rounded-sm after:absolute after:inset-0 after:content-['']"
									>
										{e.exam}
										<span class="sr-only"
											>, {examTypeLabel(e)}, {shortDate(e.date)}. See results</span
										>
									</a>
								</Table.Cell>
								<Table.Cell class="text-muted-foreground tabular">{shortDate(e.date)}</Table.Cell>
								<Table.Cell>{examTypeLabel(e)}</Table.Cell>
								<Table.Cell class="text-right tabular">{examQuestionCount(e)}</Table.Cell>
								<Table.Cell class="text-right tabular">
									<span class="font-semibold">{score.percent}%</span>
									<span class="ml-1 text-xs text-muted-foreground">
										{score.correct}/{score.total}
									</span>
								</Table.Cell>
								<Table.Cell class="hidden lg:table-cell">
									<span class="flex gap-3.5 text-xs text-muted-foreground">
										{#each e.subjects as s (s.slug)}
											<span class="inline-flex items-center gap-1.5 tabular">
												<span
													class="size-1.5 rounded-full"
													style:background={SUBJECTS[s.slug].color}
												></span>
												{SHORT_SUBJECT[s.slug]}
												<span class="font-medium text-foreground">
													{percent(s.correct, s.total)}%
												</span>
											</span>
										{/each}
									</span>
								</Table.Cell>
								<Table.Cell class="text-right">
									<ChevronRight
										class="ml-auto size-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5"
										aria-hidden="true"
									/>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		{/if}
	</Panel>
</div>
