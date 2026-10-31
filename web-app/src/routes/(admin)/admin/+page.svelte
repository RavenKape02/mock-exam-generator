<script lang="ts">
	// A1 Overview: bank, ready pool, runs and student numbers at a glance.
	import { resolve } from '$app/paths';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import CountUp from '#lib/components/common/CountUp.svelte';
	import ScoreRing from '#lib/components/data-viz/ScoreRing.svelte';
	import CountBars from '#lib/components/admin/CountBars.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import {
		bankCounts,
		poolCounts,
		studentStats,
		RUNS_PLANNED,
		RUNS_DONE,
		runs,
		EXAM_SUBJECTS
	} from '#lib/data/mock.js';
	import type { SubjectSlug } from '#lib/types.js';
	import { formatDate, formatNumber, runLabel } from '#lib/components/admin/format.js';

	const countRows = (counts: Partial<Record<SubjectSlug, number>>, subjects: SubjectSlug[]) =>
		subjects.map((subject) => ({ subject, value: counts[subject] ?? 0 }));

	const upcatBank = countRows(bankCounts.UPCAT, EXAM_SUBJECTS.UPCAT);
	const upcatBankTotal = upcatBank.reduce((n, r) => n + r.value, 0);
	const pshsBankTotal = Object.values(bankCounts['PSHS NCE']).reduce((n, v) => n + (v ?? 0), 0);

	const poolRows = countRows(poolCounts, EXAM_SUBJECTS.UPCAT);
	const poolTotal = poolRows.reduce((n, r) => n + r.value, 0);

	const runsDone = RUNS_DONE;
	const latest = runs[0];
	const latestRate = Math.round((latest.disagreements / latest.generated) * 100);

	const students = [
		{ label: 'Sign-ups', value: studentStats.signUps },
		{ label: 'Exams this week', value: studentStats.examsThisWeek },
		{ label: 'Active today', value: studentStats.activeToday }
	];

	// The whole card is the link target: the heading link stretches over it.
	const linkCard =
		'card-surface relative flex flex-col p-[18px] transition-[transform,box-shadow] duration-300 ease-standard hover:-translate-y-0.5 hover:shadow-lift has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ring';
	const stretchedLink =
		'after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:content-[""] focus-visible:outline-none';
</script>

<svelte:head><title>Overview · Oplan Aral admin</title></svelte:head>

<PageHeader
	title="Overview"
	description="Where the question bank, the ready pool and the generation runs stand today."
/>

<div class="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-12">
	<section class="{linkCard} reveal lg:col-span-7" style="--i: 1" aria-labelledby="bank-title">
		<div class="mb-4 flex items-center justify-between gap-3">
			<h2 id="bank-title" class="text-sm font-semibold tracking-[-0.01em]">
				<a href={resolve('admin/bank')} class={stretchedLink}>Question bank</a>
			</h2>
			<span class="flex items-center gap-1 text-xs text-muted-foreground" aria-hidden="true">
				Browse <ArrowUpRight class="size-3.5" />
			</span>
		</div>

		<div class="mb-3 flex items-baseline justify-between gap-3">
			<h3 class="text-[13px] font-medium">UPCAT</h3>
			<span class="text-xs text-muted-foreground tabular">
				<span class="font-medium text-foreground">{formatNumber(upcatBankTotal)}</span>
				hand-checked questions
			</span>
		</div>
		<CountBars rows={upcatBank} unit="questions" />

		<Separator class="my-4" />

		<div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
			<h3 class="text-[13px] font-medium">PSHS NCE</h3>
			<span class="flex items-center gap-2 text-xs text-muted-foreground tabular">
				{pshsBankTotal} questions
				<Badge variant="secondary">Bank on hold</Badge>
			</span>
		</div>
	</section>

	<section class="{linkCard} reveal lg:col-span-5" style="--i: 2" aria-labelledby="runs-title">
		<div class="mb-4 flex items-center justify-between gap-3">
			<h2 id="runs-title" class="text-sm font-semibold tracking-[-0.01em]">
				<a href={resolve('admin/runs')} class={stretchedLink}>Runs</a>
			</h2>
			<span class="flex items-center gap-1 text-xs text-muted-foreground" aria-hidden="true">
				All runs <ArrowUpRight class="size-3.5" />
			</span>
		</div>

		<div class="flex flex-1 flex-wrap items-center gap-x-6 gap-y-5">
			<ScoreRing
				value={runsDone}
				max={RUNS_PLANNED}
				size={136}
				stroke={11}
				label="{runsDone} of {RUNS_PLANNED} runs done"
			>
				<CountUp
					value={runsDone}
					class="text-[28px] leading-none font-semibold tracking-[-0.03em]"
				/>
				<small class="mt-1 text-xs text-muted-foreground">of {RUNS_PLANNED} runs</small>
			</ScoreRing>

			<div class="min-w-44 flex-1">
				<p class="text-[13px] font-medium">
					Latest: {runLabel(latest.id)}
					<span class="font-normal text-muted-foreground">· {latest.exam}</span>
				</p>
				<p class="text-xs text-muted-foreground">{formatDate(latest.date)}</p>
				<dl class="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[13px] tabular">
					<dt class="text-muted-foreground">Generated</dt>
					<dd class="text-right font-medium">{latest.generated}</dd>
					<dt class="text-muted-foreground">Disagreements</dt>
					<dd class="text-right font-medium">
						{latest.disagreements}
						<span class="font-normal text-muted-foreground">({latestRate}%)</span>
					</dd>
					<dt class="text-muted-foreground">Bank fallbacks</dt>
					<dd class="text-right font-medium">{latest.fallbacks}</dd>
				</dl>
			</div>
		</div>
	</section>

	<section class="{linkCard} reveal lg:col-span-7" style="--i: 3" aria-labelledby="pool-title">
		<div class="mb-1 flex items-center justify-between gap-3">
			<h2 id="pool-title" class="text-sm font-semibold tracking-[-0.01em]">
				<a href={resolve('admin/pool')} class={stretchedLink}>Ready pool</a>
			</h2>
			<span class="flex items-center gap-1 text-xs text-muted-foreground" aria-hidden="true">
				Browse <ArrowUpRight class="size-3.5" />
			</span>
		</div>
		<p class="mb-4 text-xs text-muted-foreground">
			UPCAT questions that passed the check, left to serve:
			<span class="font-medium text-foreground tabular">{formatNumber(poolTotal)}</span>
		</p>
		<CountBars rows={poolRows} unit="left" />
	</section>

	<section
		class="card-surface reveal flex flex-col p-[18px] lg:col-span-5"
		style="--i: 4"
		aria-labelledby="students-title"
	>
		<h2 id="students-title" class="mb-4 text-sm font-semibold tracking-[-0.01em]">Students</h2>
		<dl class="grid flex-1 grid-cols-3 content-center gap-3">
			{#each students as stat (stat.label)}
				<div class="flex min-w-0 flex-col gap-1.5">
					<dt class="order-2 text-xs leading-snug text-muted-foreground">{stat.label}</dt>
					<dd
						class="order-1 text-[clamp(1.5rem,4vw,2rem)] leading-none font-semibold tracking-[-0.035em]"
					>
						<CountUp value={stat.value} />
					</dd>
				</div>
			{/each}
		</dl>
	</section>
</div>
