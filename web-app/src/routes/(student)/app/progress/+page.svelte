<script lang="ts">
	// S7 Progress: score trend per subject (points open Results), accuracy per topic across all
	// exams, and the weakest topics. ?preview=empty shows the page before the first exam.
	import { resolve } from '$app/paths';
	import Plus from '@lucide/svelte/icons/plus';
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import Segmented from '#lib/components/common/Segmented.svelte';
	import BarList from '#lib/components/data-viz/BarList.svelte';
	import TrendChart from '#lib/components/data-viz/TrendChart.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import Panel from '#lib/components/student/Panel.svelte';
	import { SHORT_SUBJECT, percent, shortDate } from '#lib/components/student/format.js';
	import { previewEmpty } from '#lib/components/student/preview.js';
	import { pill } from '#lib/components/student/styles.js';
	import { EXAM_SUBJECTS, SUBJECTS, exams } from '#lib/data/mock.js';
	import { topicName } from '#lib/data/topics.js';
	import type { ExamRecord, SubjectSlug } from '#lib/types.js';

	type View = 'all' | SubjectSlug;

	const SUBJECT_ORDER = EXAM_SUBJECTS.UPCAT;

	let view = $state<View>('all');

	const fresh = $derived(previewEmpty());
	/** Oldest first */
	const done = exams.filter((e) => e.status === 'done').toReversed();
	const fullExams = done.filter((e) => e.type === 'full');

	const point = (e: ExamRecord, slug: SubjectSlug) => {
		const s = e.subjects.find((x) => x.slug === slug)!;
		return {
			label: shortDate(e.date),
			value: percent(s.correct, s.total),
			href: resolve(`app/exams/${e.id}/results`)
		};
	};

	// All subjects: one line each across full exams. One subject: every exam that had it.
	const series = $derived(
		view === 'all'
			? SUBJECT_ORDER.map((slug) => ({
					name: SUBJECTS[slug].name,
					color: SUBJECTS[slug].color,
					points: fullExams.map((e) => point(e, slug))
				}))
			: [
					{
						name: SUBJECTS[view].name,
						color: SUBJECTS[view].color,
						points: done
							.filter((e) => e.subjects.some((s) => s.slug === view))
							.map((e) => point(e, view as SubjectSlug))
					}
				]
	);

	// Topic accuracy across every exam that has topic results.
	const topicTotals = (() => {
		const sums: Record<
			string,
			{ subject: SubjectSlug; topic: string; correct: number; total: number }
		> = {};
		for (const e of done) {
			for (const t of e.topics) {
				const key = `${t.subject}/${t.topic}`;
				sums[key] ??= { subject: t.subject, topic: t.topic, correct: 0, total: 0 };
				sums[key].correct += t.correct;
				sums[key].total += t.total;
			}
		}
		return Object.values(sums).map((t) => ({
			...t,
			name: topicName(t.subject, t.topic),
			percent: percent(t.correct, t.total)
		}));
	})();

	const weakest = [...topicTotals].sort((a, b) => a.percent - b.percent).slice(0, 4);
	const isWeak = (subject: SubjectSlug, topic: string) =>
		weakest.some((w) => w.subject === subject && w.topic === topic);

	const groups = $derived(
		SUBJECT_ORDER.filter((slug) => view === 'all' || view === slug)
			.map((slug) => ({
				slug,
				rows: topicTotals
					.filter((t) => t.subject === slug)
					.map((t) => ({
						label: t.name,
						percent: t.percent,
						detail: `${t.correct}/${t.total}`,
						color: SUBJECTS[slug].color,
						weak: isWeak(slug, t.topic)
					}))
			}))
			.filter((g) => g.rows.length > 0)
	);
</script>

<svelte:head>
	<title>Progress · Oplan Aral</title>
</svelte:head>

<PageHeader
	title="Progress"
	description="How your scores changed from exam to exam, and which topics still need work."
>
	{#snippet actions()}
		<Button href={resolve('app/exams/new')} class={pill}>
			<Plus data-icon="inline-start" />
			Start an exam
		</Button>
	{/snippet}
</PageHeader>

{#if fresh}
	<Panel i={1}>
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
				<Empty.Title class="text-base font-semibold">Nothing to show yet</Empty.Title>
				<Empty.Description>
					Finish an exam to see your score trend and how you do in each topic.
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button href={resolve('app/exams/new')} class={pill}>Start an exam</Button>
			</Empty.Content>
		</Empty.Root>
	</Panel>
{:else}
	<div class="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-12">
		<!-- Score trend -->
		<Panel title="Score trend" i={1} class="md:col-span-2 lg:col-span-8">
			<div class="-mx-1 mb-4 overflow-x-auto px-1 pb-1">
				<Segmented
					label="Subject"
					bind:value={view}
					options={[
						{ value: 'all', label: 'All subjects' },
						...SUBJECT_ORDER.map((slug) => ({ value: slug, label: SHORT_SUBJECT[slug] }))
					]}
				/>
			</div>
			<TrendChart
				{series}
				height={220}
				label="Score per {view === 'all' ? 'subject' : SUBJECTS[view].name} across exams"
			/>
			<p class="mt-3 text-xs text-muted-foreground">
				{view === 'all'
					? 'Full exams only. Pick a subject to include your one-subject exams.'
					: `Every exam with ${SUBJECTS[view].name}.`} Tap a point to open that exam's results.
			</p>
		</Panel>

		<!-- Weakest topics -->
		<Panel title="Weakest topics" i={2} class="md:col-span-2 lg:col-span-4 lg:self-start">
			<ol class="flex flex-col gap-2">
				{#each weakest as t (t.subject + t.topic)}
					<li class="flex items-center gap-3 rounded-[14px] bg-muted px-3 py-2.5">
						<span class="size-2 flex-none rounded-full" style:background={SUBJECTS[t.subject].color}
						></span>
						<span class="flex min-w-0 flex-1 flex-col">
							<span class="truncate text-sm font-medium">{t.name}</span>
							<span class="text-xs text-muted-foreground tabular">
								{t.correct} of {t.total} right, {SHORT_SUBJECT[t.subject]}
							</span>
						</span>
						<span class="text-sm font-semibold tabular">{t.percent}%</span>
					</li>
				{/each}
			</ol>
			<p class="mt-3 text-xs leading-relaxed text-muted-foreground">
				Your next exam gives these topics more questions.
			</p>
			<Button href={resolve('app/exams/new')} variant="secondary" class="{pill} mt-4 w-full">
				Practice them in a new exam
			</Button>
		</Panel>

		<!-- Topic accuracy -->
		<Panel title="Accuracy by topic" i={3} class="md:col-span-2 lg:col-span-12">
			{#snippet action()}
				<span class="text-xs text-muted-foreground">All exams so far</span>
			{/snippet}
			<div class="grid gap-x-10 gap-y-6 @3xl:grid-cols-2">
				{#each groups as group (group.slug)}
					<section class="flex flex-col gap-3">
						<h3 class="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
							<span class="size-2 rounded-full" style:background={SUBJECTS[group.slug].color}
							></span>
							{SUBJECTS[group.slug].name}
						</h3>
						<BarList rows={group.rows} />
					</section>
				{/each}
			</div>
		</Panel>
	</div>
{/if}
