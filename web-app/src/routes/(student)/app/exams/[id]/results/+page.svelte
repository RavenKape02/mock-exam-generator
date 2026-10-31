<script lang="ts">
	// S5 Results: the app's one big moment. The ring fills and the score counts up, then the
	// subject bars and the topic bars grow one after another (delays in the <style> below).
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ListChecks from '@lucide/svelte/icons/list-checks';
	import Printer from '@lucide/svelte/icons/printer';
	import CountUp from '#lib/components/common/CountUp.svelte';
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import BarList from '#lib/components/data-viz/BarList.svelte';
	import ScoreRing from '#lib/components/data-viz/ScoreRing.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import Panel from '#lib/components/student/Panel.svelte';
	import { longDate, percent, shortDate } from '#lib/components/student/format.js';
	import { cardLink, pill } from '#lib/components/student/styles.js';
	import {
		SUBJECTS,
		examScore,
		examTitle,
		exams,
		finishedExam,
		latestDone,
		weakTopics
	} from '#lib/data/mock.js';
	import { topicName } from '#lib/data/topics.js';
	import type { ExamRecord } from '#lib/types.js';
	import { cn } from '#lib/utils.js';

	const id = $derived(page.params.id ?? latestDone.id);
	const exam = $derived(finishedExam(id));
	const score = $derived(examScore(exam));
	const wrong = $derived(score.total - score.correct);

	/** The exam of the same kind just before this one, to show the change. */
	const previous = $derived(
		exams.find(
			(e) =>
				e.status === 'done' &&
				e.date < exam.date &&
				e.type === exam.type &&
				e.subject === exam.subject
		)
	);
	const change = $derived(previous ? score.percent - examScore(previous).percent : null);

	const subjectRows = $derived(
		exam.subjects.map((s) => ({
			label: SUBJECTS[s.slug].name,
			percent: percent(s.correct, s.total),
			detail: `${s.correct}/${s.total}`,
			color: SUBJECTS[s.slug].color
		}))
	);

	const weak = $derived(weakTopics(exam, 4));
	const topicGroups = $derived(
		exam.subjects
			.map((s) => ({
				slug: s.slug,
				rows: exam.topics
					.filter((t) => t.subject === s.slug)
					.map((t) => ({
						label: topicName(t.subject, t.topic),
						percent: percent(t.correct, t.total),
						detail: `${t.correct}/${t.total}`,
						color: SUBJECTS[s.slug].color,
						weak: weak.some((w) => w.subject === t.subject && w.topic === t.topic)
					}))
			}))
			.filter((g) => g.rows.length > 0)
	);

	// The next exam builds on the most recent results, so older exams point at the latest one.
	const focusFrom = $derived<ExamRecord>(exam.topics.length ? exam : latestDone);
	const focus = $derived(weakTopics(focusFrom, 3));

	const changeText = $derived.by(() => {
		if (change === null || !previous)
			return 'Your first exam of this kind. Later ones compare here.';
		const kind = exam.type === 'full' ? 'full exam' : `${SUBJECTS[exam.subject!].name} exam`;
		if (change === 0) return `Same as your last ${kind} on ${shortDate(previous.date)}.`;
		return `${change > 0 ? 'Up' : 'Down'} ${Math.abs(change)} points from your last ${kind} on ${shortDate(previous.date)}.`;
	});
</script>

<svelte:head>
	<title>{examTitle(exam)} results · Oplan Aral</title>
</svelte:head>

<PageHeader
	title={examTitle(exam)}
	description="Finished {longDate(exam.date)} · {exam.perSubject} questions{exam.type === 'full'
		? ' per subject'
		: ''} · {exam.timed ? 'Timed' : 'Untimed'}"
>
	{#snippet actions()}
		<Button
			variant="outline"
			class={cn(pill, 'print:hidden')}
			onclick={() => window.print()}
			aria-label="Print results"
		>
			<Printer data-icon="inline-start" />
			Print
		</Button>
		<Button href={resolve(`app/exams/${id}/review`)} class={cn(pill, 'print:hidden')}>
			<ListChecks data-icon="inline-start" />
			Review answers ({wrong} wrong)
		</Button>
	{/snippet}
</PageHeader>

<div class="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-12 print:block">
	<!-- Score -->
	<section
		class="reveal @container relative isolate overflow-hidden rounded-[var(--radius-card)] p-5 shadow-card sm:p-[26px] md:col-span-2 lg:col-span-7 print:mb-4 print:shadow-none"
		style:background="var(--hero-gradient)"
		style:--i={1}
		aria-labelledby="score-title"
	>
		<div class="flex flex-col items-center gap-5 text-center @md:flex-row @md:text-left">
			<ScoreRing
				value={score.correct}
				max={score.total}
				size={168}
				stroke={14}
				label="Score: {score.percent}%"
			>
				<CountUp
					value={score.percent}
					suffix="%"
					class="text-[2.5rem] leading-none font-semibold tracking-[-0.04em]"
				/>
				<span class="mt-1 text-xs text-foreground/70 tabular">
					{score.correct} of {score.total}
				</span>
			</ScoreRing>
			<div class="flex min-w-0 flex-1 flex-col items-center gap-2 @md:items-start">
				<h2
					id="score-title"
					class="text-[clamp(1.25rem,2vw,1.5rem)] leading-tight font-semibold tracking-[-0.03em] text-balance"
				>
					You got {score.correct} of {score.total} right
				</h2>
				<p class="flex gap-4 text-sm tabular">
					<span class="inline-flex items-center gap-1.5">
						<span class="size-2 rounded-full bg-success"></span>{score.correct} correct
					</span>
					<span class="inline-flex items-center gap-1.5">
						<span class="size-2 rounded-full bg-danger"></span>{wrong} wrong
					</span>
				</p>
				<p class="max-w-[34ch] text-sm text-foreground/75">{changeText}</p>
			</div>
			<enhanced:img
				src="#lib/assets/art/results.png"
				sizes="(min-width: 1024px) 192px, 160px"
				alt=""
				class="pointer-events-none hidden h-auto w-40 flex-none @2xl:block @3xl:w-48 print:hidden"
			/>
		</div>
	</section>

	<!-- Score per subject -->
	<Panel title="Score per subject" i={2} class="md:col-span-2 lg:col-span-5 print:mb-4">
		<BarList rows={subjectRows} delay={450} step={40} />
	</Panel>

	<!-- Topic results -->
	<Panel title="Results by topic" i={3} class="md:col-span-2 lg:col-span-7 print:mb-4">
		{#snippet action()}
			{#if weak.length}
				<span class="text-xs text-muted-foreground">
					<span class="rounded-full bg-warning-soft px-2 py-0.5 font-medium text-warning">Weak</span
					>
					your {weak.length} lowest
				</span>
			{/if}
		{/snippet}
		{#if topicGroups.length}
			<div class="grid gap-x-8 gap-y-6 @3xl:grid-cols-2">
				{#each topicGroups as group, g (group.slug)}
					<section class="flex flex-col gap-3">
						<h3 class="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
							<span class="size-2 rounded-full" style:background={SUBJECTS[group.slug].color}
							></span>
							{SUBJECTS[group.slug].name}
						</h3>
						<BarList rows={group.rows} delay={750 + g * 220} step={40} />
					</section>
				{/each}
			</div>
		{:else}
			<p class="text-sm text-muted-foreground">
				This exam has no results by topic, only the score per subject.
			</p>
		{/if}
	</Panel>

	<!-- What happens next -->
	<Panel
		title="Your next exam will focus on"
		i={4}
		class="md:col-span-2 lg:col-span-5 lg:self-start"
	>
		<ol class="flex flex-col gap-2">
			{#each focus as t (t.subject + t.topic)}
				<li class="flex items-center gap-3 rounded-[14px] bg-muted px-3 py-2.5">
					<span class="size-2 flex-none rounded-full" style:background={SUBJECTS[t.subject].color}
					></span>
					<span class="flex min-w-0 flex-1 flex-col">
						<span class="truncate text-sm font-medium">{t.name}</span>
						<span class="text-xs text-muted-foreground tabular">
							{t.correct} of {t.total} right in {SUBJECTS[t.subject].name}
						</span>
					</span>
					<span class="text-sm font-semibold tabular">{t.percent}%</span>
				</li>
			{/each}
		</ol>
		<p class="mt-3 text-xs leading-relaxed text-muted-foreground">
			These topics get extra questions next time, so you practice them more.
		</p>
		<div class="mt-4 flex flex-wrap items-center gap-2 print:hidden">
			<Button href={resolve('app/exams/new')} class={pill}>
				New exam
				<ArrowRight data-icon="inline-end" />
			</Button>
			<a href={resolve('app/progress')} class={cn(cardLink, 'mr-0 px-3')}>See progress</a>
			<a href={resolve('app')} class={cn(cardLink, 'mr-0 px-3')}>Dashboard</a>
		</div>
	</Panel>
</div>

<style>
	@media print {
		:global(body) {
			background: var(--card);
		}
	}
</style>
