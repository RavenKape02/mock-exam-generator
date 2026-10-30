<script lang="ts">
	// A6 Run detail: results per subject and topic, and the questions LLM 2 disagreed on.
	import { resolve } from '$app/paths';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import SearchX from '@lucide/svelte/icons/search-x';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import BackLink from '#lib/components/admin/BackLink.svelte';
	import SubjectTile from '#lib/components/admin/SubjectTile.svelte';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { getRun, SUBJECTS } from '#lib/data/mock.js';
	import { getAdminQuestion } from '#lib/data/questions.js';
	import { topicName } from '#lib/data/topics.js';
	import type { AdminQuestion, RunTopicRow, SubjectSlug } from '#lib/types.js';
	import { cn } from '#lib/utils.js';
	import { formatDate, plainText, runLabel } from '#lib/components/admin/format.js';
	import type { PageProps } from './$types';

	let { params }: PageProps = $props();

	const run = $derived(getRun(params.id));

	const groups = $derived.by(() => {
		const bySubject: { subject: SubjectSlug; rows: RunTopicRow[] }[] = [];
		for (const row of run?.rows ?? []) {
			const group = bySubject.find((g) => g.subject === row.subject);
			if (group) group.rows.push(row);
			else bySubject.push({ subject: row.subject, rows: [row] });
		}
		return bySubject;
	});

	const disagreed = $derived(
		(run?.disagreementIds ?? [])
			.map((id) => getAdminQuestion(id))
			.filter((q): q is AdminQuestion => q !== undefined)
	);

	const agreed = $derived(run ? run.generated - run.disagreements : 0);
	const agreedShare = $derived(run ? (agreed / run.generated) * 100 : 0);

	const head = 'px-3 text-xs font-medium text-muted-foreground';
</script>

<svelte:head>
	<title>{run ? runLabel(run.id) : 'Run not found'} · Oplan Aral admin</title>
</svelte:head>

<BackLink href={resolve('admin/runs')} label="Runs" />

{#if !run}
	<Empty.Root class="card-surface mt-3 py-16">
		<Empty.Header>
			<Empty.Media variant="icon"><SearchX /></Empty.Media>
			<Empty.Title>Run not found</Empty.Title>
			<Empty.Description>No run has the ID “{params.id}”.</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<Button href={resolve('admin/runs')} class="h-11 rounded-full px-5">See all runs</Button>
		</Empty.Content>
	</Empty.Root>
{:else}
	<PageHeader title={runLabel(run.id)} description="{run.exam} · {formatDate(run.date)}" />

	<div class="grid items-start gap-3.5 lg:grid-cols-12">
		<section
			class="card-surface reveal p-[18px] lg:col-span-4 lg:col-start-9 lg:row-start-1"
			style="--i: 1"
			aria-labelledby="summary-title"
		>
			<h2 id="summary-title" class="mb-4 text-sm font-semibold">Summary</h2>
			<dl class="grid grid-cols-3 gap-3">
				<div class="flex flex-col gap-1">
					<dt class="order-2 text-xs text-muted-foreground">Generated</dt>
					<dd class="order-1 text-2xl leading-none font-semibold tracking-[-0.03em] tabular">
						{run.generated}
					</dd>
				</div>
				<div class="flex flex-col gap-1">
					<dt class="order-2 text-xs text-muted-foreground">Agreed</dt>
					<dd class="order-1 text-2xl leading-none font-semibold tracking-[-0.03em] tabular">
						{agreed}
					</dd>
				</div>
				<div class="flex flex-col gap-1">
					<dt class="order-2 text-xs text-muted-foreground">Replaced by bank</dt>
					<dd
						class="order-1 text-2xl leading-none font-semibold tracking-[-0.03em] text-warning tabular"
					>
						{run.fallbacks}
					</dd>
				</div>
			</dl>
			<div
				class="mt-5 flex h-2 overflow-hidden rounded-full bg-warning-soft"
				role="img"
				aria-label="{agreed} of {run.generated} agreed, {run.disagreements} replaced"
			>
				<span
					class="block h-full origin-left animate-grow-x rounded-full bg-success"
					style:width="{agreedShare}%"
				></span>
			</div>
			<p class="mt-2 text-xs text-muted-foreground tabular">
				{Math.round(agreedShare * 10) / 10}% agreed on the first try
			</p>
		</section>

		<section
			class="card-surface reveal overflow-hidden lg:col-span-8 lg:col-start-1 lg:row-span-2 lg:row-start-1"
			style="--i: 2"
			aria-labelledby="topics-title"
		>
			<h2 id="topics-title" class="px-4 pt-4 pb-1 text-sm font-semibold">By subject and topic</h2>

			<div class="hidden px-2 pb-2 md:block">
				<Table.Root>
					<Table.Header>
						<Table.Row class="hover:bg-transparent">
							<Table.Head class={head}>Topic</Table.Head>
							<Table.Head class="{head} text-right">Generated</Table.Head>
							<Table.Head class="{head} text-right">Agreed</Table.Head>
							<Table.Head class="{head} text-right">Replaced by bank</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each groups as group (group.subject)}
							<Table.Row class="border-border/70 bg-muted/60 hover:bg-muted/60">
								<Table.Cell colspan={4} class="px-3 py-2 text-xs font-medium">
									<span class="flex items-center gap-2">
										<span
											class="size-2 rounded-full"
											style:background={SUBJECTS[group.subject].color}
											aria-hidden="true"
										></span>
										{SUBJECTS[group.subject].name}
									</span>
								</Table.Cell>
							</Table.Row>
							{#each group.rows as row (row.topic)}
								<Table.Row class="border-border/70">
									<Table.Cell class="px-3 py-3 text-[13px]">{row.topic}</Table.Cell>
									<Table.Cell class="px-3 py-3 text-right text-[13px] tabular"
										>{row.generated}</Table.Cell
									>
									<Table.Cell class="px-3 py-3 text-right text-[13px] tabular"
										>{row.agreed}</Table.Cell
									>
									<Table.Cell
										class={cn(
											'px-3 py-3 text-right text-[13px] tabular',
											row.replaced > 0 ? 'font-medium text-warning' : 'text-muted-foreground'
										)}
									>
										{row.replaced}
									</Table.Cell>
								</Table.Row>
							{/each}
						{/each}
					</Table.Body>
				</Table.Root>
			</div>

			<div class="flex flex-col gap-4 p-3 pt-2 md:hidden">
				{#each groups as group (group.subject)}
					<div>
						<h3 class="flex items-center gap-2 px-1 pb-1.5 text-xs font-medium">
							<span
								class="size-2 rounded-full"
								style:background={SUBJECTS[group.subject].color}
								aria-hidden="true"
							></span>
							{SUBJECTS[group.subject].name}
						</h3>
						<ul class="flex flex-col divide-y rounded-2xl bg-muted/60">
							{#each group.rows as row (row.topic)}
								<li class="flex flex-col gap-0.5 px-3 py-2.5">
									<span class="text-[13px] font-medium">{row.topic}</span>
									<span class="flex flex-wrap gap-x-3 text-xs text-muted-foreground tabular">
										<span>{row.generated} generated</span>
										<span>{row.agreed} agreed</span>
										<span class={cn(row.replaced > 0 && 'font-medium text-warning')}>
											{row.replaced} replaced
										</span>
									</span>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</section>

		<section
			class="card-surface reveal overflow-hidden lg:col-span-4 lg:col-start-9"
			style="--i: 3"
			aria-labelledby="disagreements-title"
		>
			<div class="flex items-baseline justify-between gap-3 px-4 pt-4 pb-1">
				<h2 id="disagreements-title" class="text-sm font-semibold">Disagreements</h2>
				{#if disagreed.length > 0}
					<span class="text-xs text-muted-foreground tabular">
						{disagreed.length} of {run.disagreements} on record
					</span>
				{/if}
			</div>

			{#if disagreed.length === 0}
				<Empty.Root class="py-10">
					<Empty.Header>
						<Empty.Media variant="icon"><CircleCheck /></Empty.Media>
						<Empty.Title>No question records</Empty.Title>
						<Empty.Description>
							This prototype keeps the disagreed questions for runs 036 and 037 only.
						</Empty.Description>
					</Empty.Header>
					<Empty.Content>
						<Button
							variant="outline"
							href={resolve('admin/runs/run-037')}
							class="h-11 rounded-full px-4"
						>
							Open Run 037
						</Button>
					</Empty.Content>
				</Empty.Root>
			{:else}
				<ul class="flex flex-col p-1.5">
					{#each disagreed as q (q.id)}
						<li>
							<a
								href={resolve(`admin/questions/${q.id}`)}
								class="flex items-start gap-3 rounded-2xl p-2.5 transition-colors duration-150 hover:bg-muted active:bg-muted"
							>
								<SubjectTile subject={q.subject} class="mt-0.5" />
								<span class="flex min-w-0 flex-1 flex-col gap-1">
									<span class="line-clamp-2 text-[13px] leading-snug font-medium">
										{plainText(q.stem)}
									</span>
									<span class="truncate text-xs text-muted-foreground">
										<span class="tabular">{q.id}</span> · {topicName(q.subject, q.topic)}
									</span>
									<span class="text-xs tabular">
										Key <span class="font-semibold">{q.key}</span>
										<span class="text-muted-foreground">·</span>
										LLM 2 <span class="font-semibold text-warning">{q.llm2Answer}</span>
									</span>
								</span>
								<ChevronRight
									class="mt-2.5 size-4 flex-none text-muted-foreground"
									aria-hidden="true"
								/>
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
{/if}
