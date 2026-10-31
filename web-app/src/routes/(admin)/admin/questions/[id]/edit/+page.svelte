<script lang="ts">
	// A7 Edit question. Prototype: Save and Cancel both return to A4; nothing is stored.
	import { resolve, asset } from '$app/paths';
	import { goto } from '$app/navigation';
	import SearchX from '@lucide/svelte/icons/search-x';
	import Upload from '@lucide/svelte/icons/upload';
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import BackLink from '#lib/components/admin/BackLink.svelte';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Textarea } from '#lib/components/ui/textarea/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import NativeSelect from '#lib/components/common/NativeSelect.svelte';
	import * as RadioGroup from '#lib/components/ui/radio-group/index.js';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import { SUBJECTS } from '#lib/data/mock.js';
	import { getAdminQuestion } from '#lib/data/questions.js';
	import { topicsFor } from '#lib/data/topics.js';
	import { cn } from '#lib/utils.js';
	import { OPTION_LABELS } from '#lib/components/admin/format.js';
	import { figureSize } from '#lib/data/figures.js';
	import type { PageProps } from './$types';

	let { params }: PageProps = $props();

	const q = $derived(getAdminQuestion(params.id));
	const topics = $derived(q ? topicsFor(q.subject) : []);

	// A fresh draft whenever the question changes.
	const form = $derived.by(() => {
		const draft = $state({
			topic: q?.topic ?? '',
			stem: q?.stem ?? '',
			options: OPTION_LABELS.map((label) => q?.options.find((o) => o.label === label)?.text ?? ''),
			key: q?.key ?? 'A',
			explanation: q?.explanation ?? '',
			newFigure: ''
		});
		return draft;
	});

	const detailHref = $derived(q ? resolve(`admin/questions/${q.id}`) : resolve('admin/bank'));

	function onFigure(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		form.newFigure = file?.name ?? '';
	}

	function save(event: SubmitEvent) {
		event.preventDefault();
		goto(detailHref);
	}

	const control = 'h-11 rounded-xl px-3.5 md:text-base';
	const area = 'rounded-xl px-3.5 py-2.5 md:text-base';
</script>

<svelte:head>
	<title>{q ? `Edit ${q.id}` : 'Question not found'} · Oplan Aral admin</title>
</svelte:head>

{#if !q}
	<BackLink href={resolve('admin/bank')} label="Question bank" />
	<Empty.Root class="card-surface mt-3 py-16">
		<Empty.Header>
			<Empty.Media variant="icon"><SearchX /></Empty.Media>
			<Empty.Title>Question not found</Empty.Title>
			<Empty.Description
				>No question has the ID “{params.id}”, so there is nothing to edit.</Empty.Description
			>
		</Empty.Header>
		<Empty.Content>
			<Button href={resolve('admin/bank')} class="h-11 rounded-full px-5">Go to the bank</Button>
		</Empty.Content>
	</Empty.Root>
{:else}
	<BackLink href={detailHref} label="Question {q.id}" />

	<PageHeader
		title="Edit question"
		description="{q.id} · {SUBJECTS[q.subject].name} · {q.exam} {q.source === 'pool'
			? 'ready pool'
			: 'bank'}"
	/>

	<form
		onsubmit={save}
		class="card-surface reveal max-w-3xl p-[18px] md:p-6"
		style="--i: 1"
		aria-label="Edit question {q.id}"
	>
		<Field.Group>
			<Field.Field>
				<Field.Label for="topic">Topic</Field.Label>
				<NativeSelect
					id="topic"
					label="Topic"
					variant="field"
					options={topics.map((t) => ({ value: t.slug, label: t.name }))}
					bind:value={form.topic}
					class="w-full sm:w-72"
				/>
			</Field.Field>

			<Field.Field>
				<Field.Label for="stem">Question</Field.Label>
				<Textarea id="stem" bind:value={form.stem} class={cn(area, 'min-h-32')} />
				<Field.Description
					>Wrap words in **double stars** to underline them for students.</Field.Description
				>
			</Field.Field>

			<Field.Field>
				<Field.Label for="figure-file">Figure</Field.Label>
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
					{#if q.figure}
						{@const size = figureSize(q.figure)}
						<img
							src={asset(q.figure as Parameters<typeof asset>[0])}
							alt="Current figure for question {q.id}"
							width={size.width}
							height={size.height}
							loading="lazy"
							class="h-28 w-auto max-w-full self-start rounded-xl border bg-card object-contain"
						/>
					{:else}
						<p class="text-sm text-muted-foreground">This question has no figure.</p>
					{/if}
					<div class="flex flex-col gap-1.5">
						<label
							for="figure-file"
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'h-11 w-fit cursor-pointer rounded-full px-4 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50'
							)}
						>
							<Upload data-icon="inline-start" />
							{q.figure ? 'Replace image' : 'Add image'}
							<input
								id="figure-file"
								type="file"
								accept="image/webp,image/png,image/jpeg"
								class="sr-only"
								onchange={onFigure}
							/>
						</label>
						<p class="text-xs text-muted-foreground" aria-live="polite">
							{form.newFigure
								? `New image: ${form.newFigure}. It is used once you save.`
								: 'WebP, PNG or JPEG.'}
						</p>
					</div>
				</div>
			</Field.Field>

			<Field.Set>
				<Field.Legend variant="label">Options</Field.Legend>
				<div class="flex flex-col gap-2.5">
					{#each OPTION_LABELS as label, i (label)}
						<div class="flex items-center gap-3">
							<Field.Label
								for="option-{label}"
								class={cn(
									'grid size-9 flex-none place-items-center rounded-full border-[1.5px] text-[13px] font-semibold',
									form.key === label
										? 'border-foreground bg-foreground text-background'
										: 'border-input text-muted-foreground'
								)}
							>
								<span class="sr-only">Option</span>{label}
							</Field.Label>
							<Input id="option-{label}" bind:value={form.options[i]} class={control} />
						</div>
					{/each}
				</div>
			</Field.Set>

			<Field.Set>
				<Field.Legend variant="label">Correct answer</Field.Legend>
				<Field.Description
					>The shaded option above is the key students are marked against.</Field.Description
				>
				<RadioGroup.Root bind:value={form.key} class="grid grid-cols-4 gap-2 sm:w-fit">
					{#each OPTION_LABELS as label (label)}
						<Field.Label for="key-{label}">
							<Field.Field
								orientation="horizontal"
								class="min-h-11 items-center justify-center gap-2.5 sm:px-4"
							>
								<RadioGroup.Item value={label} id="key-{label}" />
								<span class="font-medium">{label}</span>
							</Field.Field>
						</Field.Label>
					{/each}
				</RadioGroup.Root>
			</Field.Set>

			<Field.Field>
				<Field.Label for="explanation">Explanation</Field.Label>
				<Textarea
					id="explanation"
					bind:value={form.explanation}
					placeholder="Why the key is correct. Students see this after the exam."
					class={cn(area, 'min-h-28')}
				/>
			</Field.Field>
		</Field.Group>

		<div class="mt-7 flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:justify-end">
			<Button variant="outline" href={detailHref} class="h-11 rounded-full px-5">Cancel</Button>
			<Button type="submit" class="h-11 rounded-full px-6">Save changes</Button>
		</div>
	</form>
{/if}
