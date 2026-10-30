<script lang="ts">
	// Filterable question list for A2 (bank) and A3 (ready pool).
	// A table from 768px; stacked rows on phones. Filtering is client-side on the mock list.
	import { resolve } from '$app/paths';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SearchX from '@lucide/svelte/icons/search-x';
	import ImageIcon from '@lucide/svelte/icons/image';
	import FileText from '@lucide/svelte/icons/file-text';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Library from '@lucide/svelte/icons/library';
	import NativeSelect from '#lib/components/common/NativeSelect.svelte';
	import * as Table from '#lib/components/ui/table/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { EXAM_SUBJECTS, SUBJECTS } from '#lib/data/mock.js';
	import { adminQuestions } from '#lib/data/questions.js';
	import { topicName, topicsFor } from '#lib/data/topics.js';
	import type {
		AdminQuestion,
		ExamName,
		QuestionKind,
		QuestionSource,
		SubjectSlug
	} from '#lib/types.js';
	import SubjectTile from './SubjectTile.svelte';
	import { plainText, runLabel } from './format.js';

	interface Props {
		source: QuestionSource;
	}

	let { source }: Props = $props();

	const ALL = 'all';

	let exam = $state<ExamName>('UPCAT');
	let subject = $state<SubjectSlug | typeof ALL>(ALL);
	let topic = $state<string>(ALL);
	let kind = $state<QuestionKind | typeof ALL>(ALL);
	let query = $state('');

	const isPool = $derived(source === 'pool');
	const examSubjects = $derived(EXAM_SUBJECTS[exam]);
	const topics = $derived(subject === ALL ? [] : topicsFor(subject));

	const sourceQuestions = $derived(adminQuestions.filter((q) => q.source === source));
	const examQuestions = $derived(sourceQuestions.filter((q) => q.exam === exam));

	const shown = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		return examQuestions.filter(
			(q) =>
				(subject === ALL || q.subject === subject) &&
				(topic === ALL || q.topic === topic) &&
				(kind === ALL || q.kind === kind) &&
				(!needle ||
					q.id.toLowerCase().includes(needle) ||
					plainText(q.stem).toLowerCase().includes(needle) ||
					topicName(q.subject, q.topic).toLowerCase().includes(needle))
		);
	});

	const filtered = $derived(
		subject !== ALL || topic !== ALL || kind !== ALL || query.trim() !== ''
	);

	function setExam(value: string) {
		exam = value as ExamName;
		subject = ALL;
		topic = ALL;
	}

	function setSubject(value: string) {
		subject = value as SubjectSlug | typeof ALL;
		topic = ALL;
	}

	function clearFilters() {
		subject = ALL;
		topic = ALL;
		kind = ALL;
		query = '';
	}

	const href = (q: AdminQuestion) => resolve(`admin/questions/${q.id}`);
	const examOptions: { value: ExamName; label: string }[] = [
		{ value: 'UPCAT', label: 'UPCAT' },
		{ value: 'PSHS NCE', label: 'PSHS NCE' }
	];
	const subjectOptions = $derived([
		{ value: ALL, label: 'All' },
		...examSubjects.map((slug) => ({ value: slug, label: SUBJECTS[slug].name }))
	] as { value: SubjectSlug | typeof ALL; label: string }[]);
	const topicOptions = $derived([
		{ value: ALL, label: 'All' },
		...topics.map((t) => ({ value: t.slug, label: t.name }))
	]);
	const kindOptions: { value: QuestionKind | typeof ALL; label: string }[] = [
		{ value: ALL, label: 'All' },
		{ value: 'new', label: 'New' },
		{ value: 'variant', label: 'Variant' }
	];
	const filter = 'w-full md:w-auto md:min-w-40';
</script>

{#snippet kindBadge(q: AdminQuestion)}
	{#if q.kind}
		<Badge variant="outline">{q.kind === 'new' ? 'New' : 'Variant'}</Badge>
	{/if}
{/snippet}

<section class="card-surface reveal overflow-hidden" style="--i: 1" aria-label="Questions">
	<div class="flex flex-col gap-2.5 border-b p-3 md:flex-row md:flex-wrap md:items-center md:p-4">
		<div class="relative md:min-w-56 md:flex-1">
			<SearchIcon
				class="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
				aria-hidden="true"
			/>
			<Input
				type="search"
				bind:value={query}
				placeholder="Search by ID, topic or question text"
				aria-label="Search questions"
				class="h-11 rounded-full pl-10 md:text-base"
			/>
		</div>

		<div class="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
			<NativeSelect
				label="Exam"
				options={examOptions}
				value={exam}
				onchange={setExam}
				class={filter}
			/>
			<NativeSelect
				label="Subject"
				options={subjectOptions}
				value={subject}
				onchange={setSubject}
				class={filter}
			/>
			<NativeSelect
				label="Topic"
				options={topicOptions}
				bind:value={topic}
				disabled={topics.length === 0}
				title={subject === ALL ? 'Pick a subject first' : undefined}
				class={filter}
			/>
			{#if isPool}
				<NativeSelect label="Kind" options={kindOptions} bind:value={kind} class={filter} />
			{/if}
		</div>
	</div>

	{#if examQuestions.length === 0}
		<Empty.Root class="py-14">
			<Empty.Header>
				<Empty.Media variant="icon"><Library /></Empty.Media>
				<Empty.Title>{exam} bank on hold</Empty.Title>
				<Empty.Description>
					{isPool
						? `No ${exam} questions have been generated yet, because its bank is on hold.`
						: `The ${exam} bank is on hold, so it has no questions yet.`}
				</Empty.Description>
			</Empty.Header>
			<Empty.Content>
				<Button variant="outline" class="h-11 rounded-full px-4" onclick={() => setExam('UPCAT')}>
					Show UPCAT questions
				</Button>
			</Empty.Content>
		</Empty.Root>
	{:else if shown.length === 0}
		<Empty.Root class="py-14">
			<Empty.Header>
				<Empty.Media variant="icon"><SearchX /></Empty.Media>
				<Empty.Title>No questions match</Empty.Title>
				<Empty.Description
					>Try another topic or search word, or clear the filters.</Empty.Description
				>
			</Empty.Header>
			<Empty.Content>
				<Button variant="outline" class="h-11 rounded-full px-4" onclick={clearFilters}>
					Clear filters
				</Button>
			</Empty.Content>
		</Empty.Root>
	{:else}
		<div
			class="flex items-center justify-between gap-3 px-4 pt-3 pb-1 text-xs text-muted-foreground"
		>
			<p aria-live="polite">
				<span class="font-medium text-foreground tabular">{shown.length}</span>
				{shown.length === 1 ? 'question' : 'questions'}
				<span class="hidden sm:inline">· sample from the {isPool ? 'pool' : 'bank'}</span>
			</p>
			{#if filtered}
				<Button variant="ghost" class="-mr-2 h-11 rounded-full px-3" onclick={clearFilters}>
					Clear filters
				</Button>
			{/if}
		</div>

		<!-- Tablet and desktop: table -->
		<div class="hidden px-2 pb-2 md:block">
			<Table.Root class="table-fixed">
				<Table.Header>
					<Table.Row class="hover:bg-transparent">
						<Table.Head class="w-32 px-3 text-xs font-medium text-muted-foreground lg:w-36"
							>ID</Table.Head
						>
						<Table.Head class="w-40 px-3 text-xs font-medium text-muted-foreground lg:w-52"
							>Topic</Table.Head
						>
						<Table.Head class="px-3 text-xs font-medium text-muted-foreground">Question</Table.Head>
						{#if isPool}
							<Table.Head class="w-24 px-3 text-xs font-medium text-muted-foreground"
								>Kind</Table.Head
							>
							<Table.Head
								class="hidden w-24 px-3 text-xs font-medium text-muted-foreground xl:table-cell"
								>Run</Table.Head
							>
						{/if}
						<Table.Head class="w-16 px-3 text-xs font-medium text-muted-foreground">
							<span class="sr-only">Figure or passage</span>
						</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each shown as q (q.id)}
						<Table.Row class="relative border-border/70">
							<Table.Cell class="px-3 py-3 text-[13px] text-muted-foreground tabular">
								<a
									href={href(q)}
									class="font-medium text-foreground after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none"
								>
									{q.id}
								</a>
							</Table.Cell>
							<Table.Cell class="px-3 py-3">
								<span class="flex min-w-0 items-center gap-2">
									<span
										class="size-2 flex-none rounded-full"
										style:background={SUBJECTS[q.subject].color}
										aria-hidden="true"
									></span>
									<span class="flex min-w-0 flex-col">
										<span class="truncate text-[13px]">{topicName(q.subject, q.topic)}</span>
										<span class="truncate text-xs text-muted-foreground">
											{SUBJECTS[q.subject].name}
										</span>
									</span>
								</span>
							</Table.Cell>
							<Table.Cell class="px-3 py-3">
								<span class="block truncate text-[13px]">{plainText(q.stem)}</span>
							</Table.Cell>
							{#if isPool}
								<Table.Cell class="px-3 py-3">{@render kindBadge(q)}</Table.Cell>
								<Table.Cell
									class="hidden px-3 py-3 text-[13px] text-muted-foreground tabular xl:table-cell"
								>
									{q.runId ? runLabel(q.runId) : ''}
								</Table.Cell>
							{/if}
							<Table.Cell class="px-3 py-3 text-muted-foreground">
								<span class="flex items-center gap-1.5">
									{#if q.figure}
										<ImageIcon class="size-4" aria-label="Has a figure" />
									{/if}
									{#if q.passageId}
										<FileText class="size-4" aria-label="Uses a passage" />
									{/if}
								</span>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<!-- Phones: stacked rows -->
		<ul class="flex flex-col p-1.5 md:hidden">
			{#each shown as q (q.id)}
				<li>
					<a
						href={href(q)}
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
							{#if isPool || q.figure || q.passageId}
								<span class="mt-0.5 flex flex-wrap items-center gap-1.5 text-muted-foreground">
									{@render kindBadge(q)}
									{#if q.figure}<ImageIcon class="size-3.5" aria-label="Has a figure" />{/if}
									{#if q.passageId}<FileText class="size-3.5" aria-label="Uses a passage" />{/if}
								</span>
							{/if}
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
