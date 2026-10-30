<script lang="ts">
	// A5 Runs: each run generates one full mock exam's worth of questions; rows open A6.
	import { resolve } from '$app/paths';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import * as Table from '#lib/components/ui/table/index.js';
	import { runs, RUNS_DONE, RUNS_PLANNED } from '#lib/data/mock.js';
	import type { Run } from '#lib/types.js';
	import { cn } from '#lib/utils.js';
	import { formatDate, runLabel } from '#lib/components/admin/format.js';

	const runsDone = RUNS_DONE;
	const rate = (r: Run) => Math.round((r.disagreements / r.generated) * 1000) / 10;
	const oldestFirst = [...runs].reverse();
	const maxRate = Math.max(...runs.map(rate));
	const generated = runs.reduce((n, r) => n + r.generated, 0);
	const disagreements = runs.reduce((n, r) => n + r.disagreements, 0);
	const fallbacks = runs.reduce((n, r) => n + r.fallbacks, 0);
	const averageRate = Math.round((disagreements / generated) * 1000) / 10;

	const href = (r: Run) => resolve(`admin/runs/${r.id}`);
	const head = 'px-3 text-xs font-medium text-muted-foreground';
</script>

<svelte:head><title>Runs · Oplan Aral admin</title></svelte:head>

<PageHeader
	title="Runs"
	description="Each run generates one full mock exam's worth of questions. LLM 2 answers each one blind; when it disagrees, a bank question on the same topic is used instead."
/>

<div class="grid grid-cols-1 gap-3.5 lg:grid-cols-12">
	<section
		class="card-surface reveal p-[18px] lg:col-span-8"
		style="--i: 1"
		aria-labelledby="rate-title"
	>
		<div class="mb-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
			<h2 id="rate-title" class="text-sm font-semibold">Disagreement rate per run</h2>
		</div>
		<p class="mb-4 text-xs text-muted-foreground">
			Share of generated questions LLM 2 answered differently. Pick a bar to open the run.
		</p>

		<div class="flex h-40 items-end gap-1.5 sm:gap-3">
			{#each oldestFirst as r, i (r.id)}
				<a
					href={href(r)}
					class="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5 rounded-xl focus-visible:outline-offset-4"
					aria-label="{runLabel(
						r.id
					)}, {r.exam}: {r.disagreements} of {r.generated} disagreed ({rate(r)}%)"
				>
					<span
						class="text-xs font-medium text-muted-foreground tabular transition-colors group-hover:text-foreground"
						aria-hidden="true">{rate(r)}%</span
					>
					<span class="flex w-full flex-1 items-end justify-center" aria-hidden="true">
						<span
							class={cn(
								'block w-full max-w-12 origin-bottom animate-grow-y rounded-lg transition-[filter] duration-150 group-hover:brightness-110',
								r.exam === 'UPCAT' ? 'bg-brand' : 'bg-brand-glow'
							)}
							style:height="{(rate(r) / maxRate) * 100}%"
							style:animation-delay="{120 + i * 50}ms"
						></span>
					</span>
				</a>
			{/each}
		</div>
		<div class="mt-2 flex gap-1.5 sm:gap-3" aria-hidden="true">
			{#each oldestFirst as r (r.id)}
				<span class="min-w-0 flex-1 text-center text-xs text-muted-foreground tabular">
					{r.id.replace('run-', '')}
				</span>
			{/each}
		</div>
	</section>

	<section
		class="card-surface reveal flex flex-col p-[18px] lg:col-span-4"
		style="--i: 2"
		aria-labelledby="summary-title"
	>
		<h2 id="summary-title" class="mb-4 text-sm font-semibold">Last {runs.length} runs</h2>
		<dl class="grid flex-1 grid-cols-[1fr_auto] content-start gap-x-4 gap-y-3 text-[13px] tabular">
			<dt class="text-muted-foreground">Runs done</dt>
			<dd class="text-right font-medium">{runsDone} of {RUNS_PLANNED}</dd>
			<dt class="text-muted-foreground">Questions generated</dt>
			<dd class="text-right font-medium">{generated.toLocaleString('en-US')}</dd>
			<dt class="text-muted-foreground">Disagreements</dt>
			<dd class="text-right font-medium">{disagreements}</dd>
			<dt class="text-muted-foreground">Average rate</dt>
			<dd class="text-right font-medium">{averageRate}%</dd>
			<dt class="text-muted-foreground">Bank fallbacks</dt>
			<dd class="text-right font-medium">{fallbacks}</dd>
		</dl>
	</section>

	<section
		class="card-surface reveal overflow-hidden lg:col-span-12"
		style="--i: 3"
		aria-labelledby="list-title"
	>
		<div class="flex items-baseline justify-between gap-3 px-4 pt-4 pb-1">
			<h2 id="list-title" class="text-sm font-semibold">Latest runs</h2>
			<span class="text-xs text-muted-foreground">Newest first</span>
		</div>

		<div class="hidden px-2 pb-2 md:block">
			<Table.Root>
				<Table.Header>
					<Table.Row class="hover:bg-transparent">
						<Table.Head class={head}>Run</Table.Head>
						<Table.Head class={head}>Exam</Table.Head>
						<Table.Head class={head}>Date</Table.Head>
						<Table.Head class="{head} text-right">Generated</Table.Head>
						<Table.Head class="{head} text-right">Disagreements</Table.Head>
						<Table.Head class="{head} text-right">Bank fallbacks</Table.Head>
						<Table.Head class="w-10 px-3"><span class="sr-only">Open</span></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each runs as r (r.id)}
						<Table.Row class="relative border-border/70">
							<Table.Cell class="px-3 py-3.5 text-[13px] font-medium tabular">
								<a
									href={href(r)}
									class="after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none"
								>
									{runLabel(r.id)}
								</a>
							</Table.Cell>
							<Table.Cell class="px-3 py-3.5 text-[13px]">{r.exam}</Table.Cell>
							<Table.Cell class="px-3 py-3.5 text-[13px] text-muted-foreground tabular">
								{formatDate(r.date)}
							</Table.Cell>
							<Table.Cell class="px-3 py-3.5 text-right text-[13px] tabular"
								>{r.generated}</Table.Cell
							>
							<Table.Cell class="px-3 py-3.5 text-right text-[13px] tabular">
								{r.disagreements}
								<span class="ml-1 text-muted-foreground">({rate(r)}%)</span>
							</Table.Cell>
							<Table.Cell class="px-3 py-3.5 text-right text-[13px] tabular"
								>{r.fallbacks}</Table.Cell
							>
							<Table.Cell class="px-3 py-3.5 text-muted-foreground">
								<ChevronRight class="size-4" aria-hidden="true" />
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<ul class="flex flex-col p-1.5 md:hidden">
			{#each runs as r (r.id)}
				<li>
					<a
						href={href(r)}
						class="flex items-center gap-3 rounded-2xl p-2.5 transition-colors duration-150 hover:bg-muted active:bg-muted"
					>
						<span class="flex min-w-0 flex-1 flex-col gap-0.5">
							<span class="flex items-baseline justify-between gap-2">
								<span class="text-[13px] font-medium tabular">{runLabel(r.id)}</span>
								<span class="text-xs text-muted-foreground tabular">{formatDate(r.date)}</span>
							</span>
							<span class="text-xs text-muted-foreground">{r.exam}</span>
							<span class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs tabular">
								<span><span class="font-medium">{r.generated}</span> generated</span>
								<span><span class="font-medium">{r.disagreements}</span> disagreed</span>
								<span><span class="font-medium">{r.fallbacks}</span> from bank</span>
							</span>
						</span>
						<ChevronRight class="size-4 flex-none text-muted-foreground" aria-hidden="true" />
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>
