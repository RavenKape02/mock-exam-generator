<script lang="ts">
	// A4 Question detail, with D5 Remove question.
	import { resolve, asset } from '$app/paths';
	import { goto } from '$app/navigation';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Trash from '@lucide/svelte/icons/trash';
	import SearchX from '@lucide/svelte/icons/search-x';
	import Workflow from '@lucide/svelte/icons/workflow';
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import BackLink from '#lib/components/admin/BackLink.svelte';
	import RichText from '#lib/components/exam/RichText.svelte';
	import SubjectTile from '#lib/components/admin/SubjectTile.svelte';
	import OutcomeBadge from '#lib/components/admin/OutcomeBadge.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import Modal from '#lib/components/common/Modal.svelte';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { SUBJECTS } from '#lib/data/mock.js';
	import { getAdminQuestion, subjectQuestions } from '#lib/data/questions.js';
	import { topicName } from '#lib/data/topics.js';
	import { cn } from '#lib/utils.js';
	import { runLabel } from '#lib/components/admin/format.js';
	import { figureSize } from '#lib/data/figures.js';
	import type { PageProps } from './$types';

	let { params }: PageProps = $props();

	const q = $derived(getAdminQuestion(params.id));
	const isPool = $derived(q?.source === 'pool');
	const passage = $derived(
		q?.passageId
			? subjectQuestions(q.subject)?.passages.find((p) => p.id === q.passageId)
			: undefined
	);
	const passageTitle = $derived(passage?.text.split('\n')[0].replace(/[“”"]/g, '').trim());
	const listHref = $derived(isPool ? resolve('admin/pool') : resolve('admin/bank'));
	const listName = $derived(isPool ? 'Ready pool' : 'Question bank');
	const llm2Differs = $derived(isPool && q?.llm2Answer !== undefined && q.llm2Answer !== q.key);

	let removeOpen = $state(false);

	function remove() {
		removeOpen = false;
		goto(listHref);
	}
</script>

<svelte:head>
	<title>{q ? `Question ${q.id}` : 'Question not found'} · Oplan Aral admin</title>
</svelte:head>

{#if !q}
	<BackLink href={resolve('admin/bank')} label="Question bank" />
	<Empty.Root class="card-surface mt-3 py-16">
		<Empty.Header>
			<Empty.Media variant="icon"><SearchX /></Empty.Media>
			<Empty.Title>Question not found</Empty.Title>
			<Empty.Description
				>No question has the ID “{params.id}”. It may have been removed.</Empty.Description
			>
		</Empty.Header>
		<Empty.Content>
			<Button href={resolve('admin/bank')} class="h-11 rounded-full px-5">Go to the bank</Button>
		</Empty.Content>
	</Empty.Root>
{:else}
	<BackLink href={listHref} label={listName} />

	<PageHeader
		title="Question {q.id}"
		description="{SUBJECTS[q.subject].name} · {topicName(q.subject, q.topic)} · {q.exam} {isPool
			? 'ready pool'
			: 'bank'}"
	>
		{#snippet actions()}
			<Button
				href={resolve(`admin/questions/${q.id}/edit`)}
				class="h-11 rounded-full px-5 has-data-[icon=inline-start]:pl-4"
			>
				<Pencil data-icon="inline-start" />
				Edit
			</Button>
			<Button
				variant="destructive"
				class="h-11 rounded-full px-5 has-data-[icon=inline-start]:pl-4"
				onclick={() => (removeOpen = true)}
			>
				<Trash data-icon="inline-start" />
				Remove
			</Button>
		{/snippet}
	</PageHeader>

	<div class="grid items-start gap-3.5 lg:grid-cols-12">
		<article
			class="card-surface reveal flex flex-col gap-5 p-[18px] md:p-6 lg:col-span-8"
			style="--i: 1"
		>
			<header class="flex items-center gap-3">
				<SubjectTile subject={q.subject} />
				<div class="min-w-0">
					<p class="truncate text-sm font-medium">{topicName(q.subject, q.topic)}</p>
					<p class="truncate text-xs text-muted-foreground">{SUBJECTS[q.subject].name}</p>
				</div>
			</header>

			{#if passage}
				<details class="group rounded-2xl bg-muted">
					<summary
						class="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium [&::-webkit-details-marker]:hidden"
					>
						<span class="min-w-0 truncate">Passage: {passageTitle}</span>
						<span class="flex-none text-xs font-normal text-muted-foreground">
							<span class="group-open:hidden">Show</span><span class="hidden group-open:inline"
								>Hide</span
							>
						</span>
					</summary>
					<RichText
						text={passage.text}
						class="max-h-[28rem] max-w-[68ch] overflow-y-auto px-4 pb-4 text-sm leading-relaxed text-muted-foreground"
					/>
				</details>
			{/if}

			<section aria-label="Question">
				<RichText text={q.stem} class="max-w-[68ch] text-[15px] leading-relaxed" />
			</section>

			{#if q.figure}
				{@const size = figureSize(q.figure)}
				<figure class="overflow-hidden rounded-2xl border bg-card">
					<img
						src={asset(q.figure as Parameters<typeof asset>[0])}
						alt="Figure for question {q.id}"
						width={size.width}
						height={size.height}
						loading="lazy"
						class="mx-auto h-auto max-h-[26rem] w-auto max-w-full"
					/>
				</figure>
			{/if}

			<section aria-labelledby="options-title" class="flex flex-col gap-2">
				<h2 id="options-title" class="sr-only">Options</h2>
				<ol class="flex flex-col gap-2">
					{#each q.options as option (option.label)}
						{@const isKey = option.label === q.key}
						{@const isLlm2 = isPool && option.label === q.llm2Answer}
						<li
							class={cn(
								'flex min-h-12 items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm',
								isKey ? 'border-transparent bg-success-soft' : 'border-border',
								isLlm2 && !isKey && 'border-transparent bg-warning-soft'
							)}
						>
							<span
								class={cn(
									'grid size-8 flex-none place-items-center rounded-full border-[1.5px] text-[13px] font-semibold',
									isKey
										? 'border-foreground bg-foreground text-background'
										: 'border-input text-muted-foreground'
								)}
								aria-hidden="true">{option.label}</span
							>
							<span class="min-w-0 flex-1">
								<span class="sr-only">Option {option.label}: </span>
								<RichText text={option.text} />
							</span>
							<span class="flex flex-none flex-wrap justify-end gap-1.5">
								{#if isKey}
									<Badge variant="secondary" class="bg-card text-success">Key</Badge>
								{/if}
								{#if isLlm2}
									<Badge
										variant="secondary"
										class={isKey ? 'bg-card text-foreground' : 'bg-card text-warning'}
									>
										LLM 2
									</Badge>
								{/if}
							</span>
						</li>
					{/each}
				</ol>
			</section>

			<section aria-labelledby="explanation-title" class="border-t pt-5">
				<h2 id="explanation-title" class="mb-2 text-sm font-semibold">Explanation</h2>
				{#if q.explanation}
					<RichText
						text={q.explanation}
						class="max-w-[68ch] text-sm leading-relaxed text-muted-foreground"
					/>
				{:else}
					<p class="text-sm text-muted-foreground">
						No explanation yet. Students see only the correct answer.
					</p>
				{/if}
			</section>
		</article>

		<aside class="flex flex-col gap-3.5 lg:col-span-4">
			{#if isPool && q.outcome}
				<section class="card-surface reveal p-[18px]" style="--i: 2" aria-labelledby="check-title">
					<div class="mb-4 flex items-center justify-between gap-3">
						<h2 id="check-title" class="text-sm font-semibold">Check</h2>
						<OutcomeBadge outcome={q.outcome} />
					</div>
					<dl class="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2.5 text-[13px]">
						<dt class="text-muted-foreground">Kind</dt>
						<dd class="text-right font-medium">{q.kind === 'variant' ? 'Variant' : 'New'}</dd>
						<dt class="text-muted-foreground">LLM 1's key</dt>
						<dd class="text-right font-medium">{q.key}</dd>
						<dt class="text-muted-foreground">LLM 2's answer</dt>
						<dd class={cn('text-right font-medium', llm2Differs && 'text-warning')}>
							{q.llm2Answer}
						</dd>
					</dl>
					<p class="mt-4 text-xs leading-relaxed text-muted-foreground">
						{#if q.outcome === 'agreed'}
							LLM 2 answered blind and picked the same option, so the question went to the pool.
						{:else}
							LLM 2 picked a different option, so a bank question on {topicName(q.subject, q.topic)}
							took this one's place in the exam.
						{/if}
					</p>
					{#if q.runId}
						<Button
							variant="outline"
							href={resolve(`admin/runs/${q.runId}`)}
							class="mt-4 h-11 w-full rounded-full"
						>
							<Workflow data-icon="inline-start" />
							Open {runLabel(q.runId)}
						</Button>
					{/if}
				</section>
			{/if}

			<section class="card-surface reveal p-[18px]" style="--i: 3" aria-labelledby="details-title">
				<h2 id="details-title" class="mb-4 text-sm font-semibold">Details</h2>
				<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-[13px]">
					<dt class="text-muted-foreground">ID</dt>
					<dd class="truncate text-right font-medium tabular">{q.id}</dd>
					<dt class="text-muted-foreground">Exam</dt>
					<dd class="text-right font-medium">{q.exam}</dd>
					<dt class="text-muted-foreground">Subject</dt>
					<dd class="text-right font-medium">{SUBJECTS[q.subject].name}</dd>
					<dt class="text-muted-foreground">Topic</dt>
					<dd class="text-right font-medium">{topicName(q.subject, q.topic)}</dd>
					<dt class="text-muted-foreground">Source</dt>
					<dd class="text-right font-medium">{listName}</dd>
					<dt class="text-muted-foreground">Figure</dt>
					<dd class="text-right font-medium">{q.figure ? 'Yes' : 'None'}</dd>
					<dt class="text-muted-foreground">Passage</dt>
					<dd class="truncate text-right font-medium">{passageTitle ?? 'None'}</dd>
				</dl>
			</section>
		</aside>
	</div>

	<Modal
		bind:open={removeOpen}
		title="Remove this question?"
		description="Students will no longer get this question. {q.id} leaves the {isPool
			? 'ready pool'
			: 'question bank'}."
	>
		{#snippet actions()}
			<Button variant="outline" class="h-11 rounded-full px-5" onclick={() => (removeOpen = false)}>
				Cancel
			</Button>
			<Button variant="destructive" class="h-11 rounded-full px-5" onclick={remove}>Remove</Button>
		{/snippet}
	</Modal>
{/if}
