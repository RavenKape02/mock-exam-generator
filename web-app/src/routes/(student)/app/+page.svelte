<script lang="ts">
	// S1 Dashboard. First viewport: Continue / Start hero, questions left today, last score,
	// weak topics and the score trend (see .impeccable/surfaces/…-student-app-page-svelte.md).
	import { resolve } from '$app/paths';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Plus from '@lucide/svelte/icons/plus';
	import Bloom from '#lib/components/brand/Bloom.svelte';
	import CountUp from '#lib/components/common/CountUp.svelte';
	import BarList from '#lib/components/data-viz/BarList.svelte';
	import ScoreRing from '#lib/components/data-viz/ScoreRing.svelte';
	import TrendChart from '#lib/components/data-viz/TrendChart.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import DailyMeter from '#lib/components/student/DailyMeter.svelte';
	import ExamListItem from '#lib/components/student/ExamListItem.svelte';
	import Panel from '#lib/components/student/Panel.svelte';
	import {
		SHORT_SUBJECT,
		examQuestionCount,
		examTypeLabel,
		num,
		percent,
		shortDate
	} from '#lib/components/student/format.js';
	import { previewEmpty } from '#lib/components/student/preview.js';
	import { cardLink, pill } from '#lib/components/student/styles.js';
	import {
		DAILY_LIMIT,
		SUBJECTS,
		USED_TODAY,
		examScore,
		examTitle,
		exams,
		inProgress,
		latestDone,
		weakTopics
	} from '#lib/data/mock.js';
	import { cn } from '#lib/utils.js';

	// ?preview=empty shows the dashboard of a student who has not taken an exam yet.
	const fresh = $derived(previewEmpty());
	const saved = $derived(fresh ? undefined : inProgress);
	const left = $derived(fresh ? DAILY_LIMIT : DAILY_LIMIT - USED_TODAY);
	const savedTotal = $derived(saved ? examQuestionCount(saved) : 0);
	const fullExamsLeft = $derived(Math.floor(left / 240));

	const done = exams.filter((e) => e.status === 'done');
	const last = latestDone;
	const lastScore = examScore(last);
	const recent = done.slice(0, 4);
	/** Full exams, oldest first: one "Overall" line (one-subject exams would skew it) */
	const fullTrend = done
		.filter((e) => e.type === 'full')
		.toReversed()
		.map((e) => ({ exam: e, percent: examScore(e).percent }));
	const latestFull = fullTrend.at(-1);
	const previousFull = fullTrend.at(-2);
	const trendSeries = [
		{
			name: 'Overall',
			color: 'var(--brand)',
			points: fullTrend.map((t) => ({
				label: shortDate(t.exam.date),
				value: t.percent,
				href: resolve(`app/exams/${t.exam.id}/results`)
			}))
		}
	];
	const weak = weakTopics(last, 4).map((t) => ({
		label: t.name,
		percent: t.percent,
		detail: `${t.correct}/${t.total}`,
		color: SUBJECTS[t.subject].color
	}));

	const heading =
		'text-[clamp(1.375rem,2.3vw,1.75rem)] leading-[1.12] font-semibold tracking-[-0.03em] text-balance';
</script>

<svelte:head>
	<title>Dashboard · Oplan Aral</title>
</svelte:head>

<div class="grid grid-cols-1 gap-3.5 pt-1 md:grid-cols-2 md:pt-0 lg:grid-cols-12">
	<!-- Hero: continue the saved exam, or start one -->
	<section
		class="reveal @container relative isolate flex min-h-[184px] items-center overflow-hidden rounded-[var(--radius-card)] p-5 shadow-card sm:p-[26px] md:col-span-2 lg:col-span-8"
		style:background="var(--hero-gradient)"
		style:--i={0}
		aria-labelledby="hero-title"
	>
		<div class="relative z-10 flex max-w-[25rem] flex-col items-start gap-2.5">
			{#if saved}
				<h1 id="hero-title" class={heading}>Continue your {saved.exam} mock exam</h1>
				<p class="text-sm leading-normal text-foreground/75">
					{examTypeLabel(saved)}, {saved.perSubject} questions{saved.type === 'full'
						? ' per subject'
						: ''}. Your answers and time left are saved.
				</p>
				<div class="mt-1 flex w-full max-w-72 flex-col gap-1.5">
					<div class="flex justify-between text-xs text-foreground/75 tabular">
						<span>{saved.answered} of {savedTotal} answered</span>
						{#if saved.timed}<span>{saved.timeLeftMin} min left</span>{/if}
					</div>
					<div class="h-1.5 overflow-hidden rounded-full bg-card/70">
						<span
							class="block h-full origin-left animate-grow-x rounded-full bg-brand [animation-delay:200ms]"
							style:width="{((saved.answered ?? 0) / savedTotal) * 100}%"
						></span>
					</div>
				</div>
				<div class="mt-2 flex flex-wrap items-center gap-2">
					<Button href={resolve(`app/exams/${saved.id}`)} class={pill}>
						Continue exam
						<ArrowRight data-icon="inline-end" />
					</Button>
					<Button href={resolve('app/exams/new')} variant="ghost" class={cn(pill, 'px-4')}>
						New exam
					</Button>
				</div>
			{:else}
				<h1 id="hero-title" class={heading}>
					{fresh ? 'Start your first mock exam' : 'Start a mock exam'}
				</h1>
				<p class="text-sm leading-normal text-foreground/75">
					Take a full UPCAT, or one subject at a time. After your first exam, the next ones give
					more questions to the topics you miss.
				</p>
				<Button href={resolve('app/exams/new')} class={cn(pill, 'mt-2')}>
					<Plus data-icon="inline-start" />
					Start an exam
				</Button>
			{/if}
		</div>
		<div class="pointer-events-none absolute top-1/2 right-[3%] -translate-y-1/2 @max-lg:hidden">
			<Bloom size={170} spin />
		</div>
	</section>

	<!-- Questions left today -->
	<Panel title="Questions left today" i={1} class="lg:col-span-4">
		<p class="flex items-baseline gap-1.5">
			<!-- The screen's one chalk-yellow mark: a marker stroke under today's number -->
			<span
				class="relative isolate inline-block text-[2.5rem] leading-none font-semibold tracking-[-0.035em]"
			>
				<span
					class="absolute inset-x-[-0.12em] bottom-[0.02em] -z-10 h-[0.4em] origin-left animate-grow-x rounded-[3px] bg-sidebar-primary/40 [animation-delay:320ms]"
					aria-hidden="true"
				></span>
				<CountUp value={left} />
			</span>
			<span class="text-sm text-muted-foreground">of {num(DAILY_LIMIT)}</span>
		</p>
		<DailyMeter {left} limit={DAILY_LIMIT} class="mt-4" />
		<p class="mt-3 text-xs leading-relaxed text-muted-foreground">
			Each exam uses up its question count. That's enough for {fullExamsLeft} full exams at 60 questions
			per subject.
		</p>
	</Panel>

	{#if fresh}
		<Panel i={2} class="md:col-span-2 lg:col-span-12">
			<Empty.Root class="py-8">
				<Empty.Header>
					<Empty.Media>
						<enhanced:img
							src="#lib/assets/art/empty-history.png"
							sizes="160px"
							alt=""
							class="h-auto w-40"
						/>
					</Empty.Media>
					<Empty.Title class="text-base font-semibold">No exams yet</Empty.Title>
					<Empty.Description>
						Your scores, weak topics and score trend show up here after your first exam.
					</Empty.Description>
				</Empty.Header>
				<Empty.Content>
					<Button href={resolve('app/exams/new')} class={pill}>Start an exam</Button>
				</Empty.Content>
			</Empty.Root>
		</Panel>
	{:else}
		<!-- Last score -->
		<Panel title="Last score" i={2} class="lg:col-span-4">
			{#snippet action()}
				<a href={resolve(`app/exams/${last.id}/results`)} class={cardLink}>See results</a>
			{/snippet}
			<div class="flex items-center gap-5 @max-[18rem]:flex-col @max-[18rem]:items-start">
				<ScoreRing
					value={lastScore.correct}
					max={lastScore.total}
					size={120}
					stroke={11}
					label="Last score: {lastScore.percent}%"
				>
					<CountUp
						value={lastScore.percent}
						suffix="%"
						class="text-[1.625rem] leading-none font-semibold tracking-[-0.03em]"
					/>
					<span class="mt-1 text-xs text-muted-foreground tabular">
						{lastScore.correct} of {lastScore.total}
					</span>
				</ScoreRing>
				<div class="flex w-full min-w-0 flex-1 flex-col gap-2">
					<p class="text-xs text-muted-foreground">{examTitle(last)}, {shortDate(last.date)}</p>
					<ul class="flex flex-col gap-1.5">
						{#each last.subjects as s (s.slug)}
							<li class="flex items-center gap-2 text-sm">
								<span class="size-2 rounded-full" style:background={SUBJECTS[s.slug].color}></span>
								<span class="flex-1 truncate">{SHORT_SUBJECT[s.slug]}</span>
								<span class="font-medium tabular">{percent(s.correct, s.total)}%</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</Panel>

		<!-- Weak topics -->
		<Panel title="Topics to work on" i={3} class="lg:col-span-4">
			<BarList rows={weak} />
			<p class="mt-4 text-xs leading-relaxed text-muted-foreground">
				Your next exam gives these topics more questions.
			</p>
		</Panel>

		<!-- Score trend: overall score of each full exam on a 0–100 plot; points open Results -->
		<Panel title="Score trend" i={4} class="lg:col-span-4">
			{#snippet action()}
				<a href={resolve('app/progress')} class={cardLink}>
					Progress
					<ArrowRight class="size-3.5" aria-hidden="true" />
				</a>
			{/snippet}
			{#if latestFull}
				<p class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
					<span class="text-[2.5rem] leading-none font-semibold tracking-[-0.035em] tabular">
						{latestFull.percent}%
					</span>
					<span class="text-xs text-muted-foreground tabular">
						{#if previousFull}
							{latestFull.percent >= previousFull.percent ? '+' : '−'}{Math.abs(
								latestFull.percent - previousFull.percent
							)} points since {shortDate(previousFull.exam.date)}
						{:else}
							your first full exam
						{/if}
					</span>
				</p>
				<div class="mt-3">
					<TrendChart
						series={trendSeries}
						height={150}
						label="Overall score of your last {fullTrend.length} full exams"
					/>
				</div>
			{:else}
				<p class="text-sm leading-relaxed text-muted-foreground">
					Your score trend starts after your first full exam.
				</p>
			{/if}
		</Panel>

		<!-- Recent exams -->
		<Panel title="Recent exams" i={5} class="md:col-span-2 lg:col-span-12">
			{#snippet action()}
				<a href={resolve('app/exams')} class={cardLink}>See all</a>
			{/snippet}
			<ul class="-mx-2 grid gap-x-4 @3xl:grid-cols-2">
				{#each recent as e (e.id)}
					<li>
						<ExamListItem exam={e} href={resolve(`app/exams/${e.id}/results`)} />
					</li>
				{/each}
			</ul>
		</Panel>
	{/if}
</div>
