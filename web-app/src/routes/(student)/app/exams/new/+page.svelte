<script lang="ts">
	// S2 New exam: pick the exam, type, question count and timer; see what it costs from
	// today's question limit; Start goes to Take exam (S3). Nothing is saved: it is a prototype.
	import { resolve } from '$app/paths';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Info from '@lucide/svelte/icons/info';
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import Segmented from '#lib/components/common/Segmented.svelte';
	import * as Alert from '#lib/components/ui/alert/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as RadioGroup from '#lib/components/ui/radio-group/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import DailyMeter from '#lib/components/student/DailyMeter.svelte';
	import Panel from '#lib/components/student/Panel.svelte';
	import { num, topicSplit } from '#lib/components/student/format.js';
	import { previewParam } from '#lib/components/student/preview.js';
	import { pill } from '#lib/components/student/styles.js';
	import {
		DAILY_LIMIT,
		EXAM_SUBJECTS,
		MINUTES_PER_60,
		NEW_EXAM_ID,
		QUESTION_COUNTS,
		SUBJECTS,
		USED_TODAY,
		weakTopics
	} from '#lib/data/mock.js';
	import { prototype, type QuestionCount } from '#lib/state/prototype.svelte.js';
	import type { ExamName, ExamType, SubjectSlug } from '#lib/types.js';
	import { cn } from '#lib/utils.js';

	const EXAMS: { name: ExamName; ready: boolean }[] = [
		{ name: 'UPCAT', ready: true },
		{ name: 'PSHS NCE', ready: false }
	];

	let exam = $state<ExamName>('UPCAT');
	let type = $state<ExamType>('full');
	let subject = $state<SubjectSlug>('math');
	let count = $state<QuestionCount>(prototype.defaultCount);
	let timed = $state(prototype.timerOnByDefault);

	function pickExam(next: ExamName) {
		exam = next;
		// Keep the subject picker valid: PSHS NCE has English and Abstract Reasoning instead.
		if (!EXAM_SUBJECTS[next].includes(subject)) subject = EXAM_SUBJECTS[next][0];
	}

	const ready = $derived(EXAMS.find((e) => e.name === exam)?.ready ?? false);
	const examSubjects = $derived(EXAM_SUBJECTS[exam]);
	const subjects = $derived(type === 'full' ? examSubjects : [subject]);
	const total = $derived(count * subjects.length);
	const minutes = $derived(Math.round((count / 60) * MINUTES_PER_60) * subjects.length);

	// Prototype only: /app/exams/new?used=1150 shows the over-the-limit state.
	const usedToday = $derived(Number(previewParam('used') ?? USED_TODAY) || 0);
	const left = $derived(Math.max(DAILY_LIMIT - usedToday, 0));
	const over = $derived(total > left);
	const canStart = $derived(ready && !over);

	// Topics that get extra questions, from the weak-topic split.
	const extra = $derived.by(() => {
		if (!ready) return [];
		if (type === 'subject') {
			return topicSplit(subject, count)
				.toSorted((a, b) => b.count - a.count)
				.map((t) => ({ ...t, subject }));
		}
		return weakTopics(undefined, 3).map((w) => ({
			name: w.name,
			subject: w.subject,
			count: topicSplit(w.subject, count).find((t) => t.slug === w.topic)?.count ?? 0
		}));
	});

	// Hand the choices to Take exam right before the link navigates (client-side, lost on reload).
	function start() {
		prototype.pendingExam = {
			exam,
			type,
			subject: type === 'subject' ? subject : undefined,
			perSubject: count,
			timed
		};
	}

	const blocker = $derived(
		!ready
			? 'PSHS NCE questions are coming soon. Pick UPCAT for now.'
			: over
				? `This exam needs ${num(total)} questions, but you have ${num(left)} left today. Pick fewer questions, or come back tomorrow.`
				: ''
	);
</script>

<svelte:head>
	<title>New exam · Oplan Aral</title>
</svelte:head>

<PageHeader
	title="New mock exam"
	description="Choose the exam and how long it is. You can save and leave in the middle and continue later."
/>

<div class="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-12">
	<!-- Choices -->
	<Panel i={1} class="md:col-span-2 lg:col-span-8">
		<Field.Group class="gap-7">
			<!-- Exam -->
			<Field.Set>
				<Field.Legend>Exam</Field.Legend>
				<RadioGroup.Root
					bind:value={() => exam, (v) => pickExam(v as ExamName)}
					class="grid gap-2.5 @md:grid-cols-2"
				>
					{#each EXAMS as e (e.name)}
						<Field.Label for="exam-{e.name}" class="has-[>[data-slot=field]]:rounded-2xl">
							<Field.Field orientation="horizontal" class="min-h-16 p-3.5!">
								<Field.Content>
									<Field.Title>
										{e.name}
										{#if !e.ready}<Badge variant="secondary">Coming soon</Badge>{/if}
									</Field.Title>
									<Field.Description class="text-xs">
										{EXAM_SUBJECTS[e.name].map((s) => SUBJECTS[s].name).join(', ')}
									</Field.Description>
								</Field.Content>
								<RadioGroup.Item value={e.name} id="exam-{e.name}" />
							</Field.Field>
						</Field.Label>
					{/each}
				</RadioGroup.Root>
				{#if !ready}
					<Alert.Root>
						<Info />
						<Alert.Title>PSHS NCE questions are coming soon</Alert.Title>
						<Alert.Description>
							We are still building the PSHS NCE question bank. You can look around, but only UPCAT
							exams can start for now.
						</Alert.Description>
					</Alert.Root>
				{/if}
			</Field.Set>

			<!-- Type -->
			<Field.Set>
				<Field.Legend>Type</Field.Legend>
				<Field.Description>
					A full exam has every subject. One subject is shorter, and still counts toward your weak
					topics.
				</Field.Description>
				<Segmented
					label="Exam type"
					bind:value={type}
					stretch
					class="max-w-sm"
					options={[
						{ value: 'full', label: 'Full exam' },
						{ value: 'subject', label: 'One subject' }
					]}
				/>
				{#if type === 'subject'}
					<RadioGroup.Root bind:value={subject} class="grid grid-cols-1 gap-2 @md:grid-cols-2">
						{#each examSubjects as slug (slug)}
							<Field.Label for="subject-{slug}" class="has-[>[data-slot=field]]:rounded-2xl">
								<Field.Field orientation="horizontal" class="min-h-12 px-3.5! py-3!">
									<Field.Content>
										<Field.Title>
											<span class="size-2 rounded-full" style:background={SUBJECTS[slug].color}
											></span>
											{SUBJECTS[slug].name}
										</Field.Title>
									</Field.Content>
									<RadioGroup.Item value={slug} id="subject-{slug}" />
								</Field.Field>
							</Field.Label>
						{/each}
					</RadioGroup.Root>
				{/if}
			</Field.Set>

			<!-- Count -->
			<Field.Set>
				<Field.Legend>{type === 'full' ? 'Questions per subject' : 'Questions'}</Field.Legend>
				<Field.Description>
					Your default is {prototype.defaultCount}. You can change it in
					<a href={resolve('app/settings')}>Settings</a>.
				</Field.Description>
				<Segmented
					label={type === 'full' ? 'Questions per subject' : 'Questions'}
					bind:value={count}
					stretch
					class="max-w-md"
					options={QUESTION_COUNTS.map((n) => ({ value: n, label: String(n) }))}
				/>
				{#if extra.length}
					<div class="rounded-2xl bg-muted p-3.5 text-sm">
						<p class="text-muted-foreground">
							Half of each subject's questions are spread evenly across its topics. The other half
							go to topics you missed more in your last exam.
							{type === 'full' ? 'These get the most:' : 'This time:'}
						</p>
						<ul class="mt-2.5 flex flex-col gap-1.5">
							{#each extra as t (t.name)}
								<li class="flex items-center gap-2">
									<span
										class="size-2 flex-none rounded-full"
										style:background={SUBJECTS[t.subject].color}
									></span>
									<span class="min-w-0 flex-1 truncate">{t.name}</span>
									<span class="text-muted-foreground tabular">
										<span class="font-medium text-foreground">{t.count}</span> of {count}
									</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</Field.Set>

			<!-- Timer -->
			<Field.Field orientation="horizontal" class="rounded-2xl bg-muted p-3.5">
				<Field.Content>
					<Field.Label for="timer">Timer</Field.Label>
					<Field.Description class="text-xs">
						{#if timed}
							{Math.round((count / 60) * MINUTES_PER_60)} minutes for each subject. You can turn it off
							during the exam.
						{:else}
							No time limit. Practice at your own pace.
						{/if}
					</Field.Description>
				</Field.Content>
				<Switch id="timer" bind:checked={timed} />
			</Field.Field>
		</Field.Group>
	</Panel>

	<!-- Summary and start -->
	<Panel
		title="Your exam"
		i={2}
		class="md:col-span-2 lg:sticky lg:top-0 lg:col-span-4 lg:self-start"
	>
		<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
			<dt class="text-muted-foreground">Exam</dt>
			<dd class="text-right font-medium">
				{exam}, {type === 'full' ? 'full' : SUBJECTS[subject].name}
			</dd>
			<dt class="text-muted-foreground">Questions</dt>
			<dd class="text-right font-medium tabular">
				{#if type === 'full'}{subjects.length} × {count} = {num(total)}{:else}{total}{/if}
			</dd>
			<dt class="text-muted-foreground">Time</dt>
			<dd class="text-right font-medium tabular">{timed ? `${minutes} minutes` : 'No limit'}</dd>
		</dl>

		<div class="mt-5 flex flex-col gap-2.5 border-t pt-4">
			<p class="text-sm" aria-live="polite">
				This uses <span class={cn('font-semibold tabular', over && 'text-danger')}
					>{num(total)}</span
				>
				of your <span class="font-semibold tabular">{num(left)}</span> questions left today.
			</p>
			<DailyMeter {left} limit={DAILY_LIMIT} using={total} />
		</div>

		<!-- Turnstile goes here later; a static box for now. -->
		<div
			class="mt-5 flex items-center gap-3 rounded-xl border border-dashed border-input bg-muted px-3.5 py-3"
			aria-label="Bot check placeholder"
			role="group"
		>
			<span
				class="grid size-7 flex-none place-items-center rounded-md bg-success-soft text-success"
			>
				<ShieldCheck class="size-4" aria-hidden="true" />
			</span>
			<span class="flex min-w-0 flex-col">
				<span class="text-sm font-medium">Verifying you're human</span>
				<span class="text-xs text-muted-foreground">
					Placeholder for the Cloudflare Turnstile check. It does nothing yet.
				</span>
			</span>
		</div>

		<div class="mt-5 flex flex-col gap-2">
			{#if canStart}
				<Button
					href={resolve(`app/exams/${NEW_EXAM_ID}`)}
					onclick={start}
					class={cn(pill, 'w-full')}
				>
					Start exam
					<ArrowRight data-icon="inline-end" />
				</Button>
			{:else}
				<Button disabled aria-describedby="start-blocker" class={cn(pill, 'w-full')}>
					Start exam
					<ArrowRight data-icon="inline-end" />
				</Button>
				<p
					id="start-blocker"
					class={cn('text-xs leading-relaxed', ready ? 'text-danger' : 'text-muted-foreground')}
					aria-live="polite"
				>
					{blocker}
				</p>
			{/if}
			<Button href={resolve('app')} variant="ghost" class={cn(pill, 'w-full')}>Cancel</Button>
		</div>
	</Panel>
</div>
