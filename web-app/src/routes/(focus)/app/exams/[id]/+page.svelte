<script lang="ts">
	// S3 Take exam: focus layout, no app shell. Prototype only: answers live in this page.
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { SvelteSet } from 'svelte/reactivity';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Flag from '@lucide/svelte/icons/flag';
	import LogOut from '@lucide/svelte/icons/log-out';
	import Logo from '#lib/components/brand/Logo.svelte';
	import Segmented from '#lib/components/common/Segmented.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import AnswerSheet from '#lib/components/exam/AnswerSheet.svelte';
	import Modal from '#lib/components/common/Modal.svelte';
	import ExamTimer from '#lib/components/exam/ExamTimer.svelte';
	import OptionBubble from '#lib/components/exam/OptionBubble.svelte';
	import PassagePanel from '#lib/components/exam/PassagePanel.svelte';
	import QuestionStem from '#lib/components/exam/QuestionStem.svelte';
	import { buildExam, type BubbleStatus, type ExamItem } from '#lib/components/exam/exam.js';
	import { EXAM_SUBJECTS, getExam, NEW_EXAM_ID, SUBJECTS } from '#lib/data/mock.js';
	import { prototype } from '#lib/state/prototype.svelte.js';
	import type { ExamRecord, SubjectSlug } from '#lib/types.js';
	import { cn } from '#lib/utils.js';

	// ---- The exam (fixed for this visit) -------------------------------------------------
	type Setup = Pick<ExamRecord, 'exam' | 'type' | 'subject' | 'perSubject' | 'timed'>;

	const examId = page.params.id ?? NEW_EXAM_ID;
	const record = getExam(examId);
	// A new exam uses the choices from New exam's Start; after a reload those are gone,
	// so it falls back to today's defaults (a full UPCAT with the Settings count and timer).
	const setup: Setup = record ??
		(examId === NEW_EXAM_ID ? prototype.pendingExam : null) ?? {
			exam: 'UPCAT',
			type: 'full',
			perSubject: prototype.defaultCount,
			timed: prototype.timerOnByDefault
		};
	const resuming = record?.status === 'in-progress';
	const sections = buildExam(setup);
	const items = sections.flatMap((s) => s.items);
	const title =
		setup.type === 'subject' && setup.subject
			? `${setup.exam} ${SUBJECTS[setup.subject].name}`
			: `${setup.exam} full mock exam`;
	// Prototype truth: the real exam has this many questions; only the samples are on screen.
	const plannedCount =
		setup.perSubject * (setup.type === 'full' ? EXAM_SUBJECTS[setup.exam].length : 1);
	const sampleNote =
		plannedCount > items.length
			? `Prototype: ${items.length} sample questions stand in for this exam's ${plannedCount}.`
			: '';
	const examSeconds = sections.reduce((n, s) => n + s.minutes * 60, 0);
	const resumeAt = resuming ? Math.min(record.answered ?? 0, items.length - 1) : 0;
	// A saved timed exam keeps its time left. With none saved (an untimed exam), it gets the
	// time for the questions still to do, never zero.
	const startSeconds =
		resuming && record.timeLeftMin !== undefined
			? record.timeLeftMin * 60
			: Math.round((examSeconds * (items.length - resumeAt)) / items.length);
	const totalSeconds = Math.max(examSeconds, startSeconds + resumeAt * 60);
	const subjectOptions = sections.map((s) => ({ value: s.slug, label: s.short }));

	// A saved exam comes back with its first answers filled in and two flags.
	const answers: Record<string, string | undefined> = $state(
		Object.fromEntries(
			items.slice(0, resumeAt).map((i) => [i.question.id, i.question.options[i.index % 3]?.label])
		)
	);
	const flags = new SvelteSet<string>(
		resuming ? [items[4], items[13]].filter(Boolean).map((i) => i.question.id) : []
	);
	const started = new SvelteSet<SubjectSlug>(
		sections.filter((s) => s.items[s.items.length - 1].index < resumeAt).map((s) => s.slug)
	);

	// ---- Where the student is ------------------------------------------------------------
	let current = $state(resumeAt);
	let direction = $state<'next' | 'prev'>('next');
	let view = $state<'question' | 'passage'>('question');
	let sheetOpen = $state(false);
	let submitOpen = $state(false);
	let leaveOpen = $state(false);
	let timerOn = $state(setup.timed);
	let secondsLeft = $state(startSeconds);
	/** Set once the clock runs out (or the prototype skips to it); it never resets. */
	let timeUp = $state(false);
	const item = $derived(items[current]);
	const section = $derived(sections.find((s) => s.slug === item.subject)!);
	const onIntro = $derived(!started.has(item.subject));
	const isLast = $derived(current === items.length - 1);
	const answeredCount = $derived(items.filter((i) => answers[i.question.id]).length);
	const unanswered = $derived(items.length - answeredCount);
	const flagged = $derived(flags.has(item.question.id));
	const passageNote = $derived.by(() => {
		if (!item.passage) return '';
		const group = section.items.filter((i) => i.passage?.id === item.passage?.id);
		return group.length > 1
			? `Questions ${group[0].n}–${group[group.length - 1].n} use this passage`
			: `Question ${item.n} uses this passage`;
	});

	// The clock runs only while questions are on screen and the timer is on. It counts down to
	// a deadline from Date.now(), so a throttled background tab cannot make it drift; pausing
	// (a subject intro, the timer turned off) keeps the exact time that was left.
	const clockRunning = $derived(timerOn && !onIntro && !timeUp);
	let msLeft = startSeconds * 1000;
	let deadline = 0; // 0 while paused

	function syncClock() {
		if (!deadline) return;
		msLeft = Math.max(0, deadline - Date.now());
		secondsLeft = Math.ceil(msLeft / 1000);
		if (msLeft === 0) timeUp = true;
	}

	$effect(() => {
		if (!clockRunning) return;
		deadline = Date.now() + msLeft;
		const tick = setInterval(syncClock, 250);
		return () => {
			clearInterval(tick);
			syncClock();
			deadline = 0;
		};
	});

	// ---- Actions -------------------------------------------------------------------------
	function go(index: number) {
		if (index < 0 || index >= items.length || index === current) return;
		direction = index > current ? 'next' : 'prev';
		current = index;
		view = 'question';
		sheetOpen = false;
		if (window.scrollY > 0) window.scrollTo({ top: 0 });
	}

	function next() {
		if (onIntro) started.add(item.subject);
		else go(current + 1);
	}

	function choose(letter: string) {
		if (timeUp) return; // answers are final once time is up
		answers[item.question.id] = letter;
	}

	function toggleFlag() {
		if (flags.has(item.question.id)) flags.delete(item.question.id);
		else flags.add(item.question.id);
	}

	function openSubject(slug: SubjectSlug) {
		const s = sections.find((x) => x.slug === slug)!;
		go((s.items.find((i) => !answers[i.question.id]) ?? s.items[0]).index);
	}

	function skipToTimeUp() {
		deadline = 0;
		msLeft = 0;
		secondsLeft = 0;
		timeUp = true;
	}

	const status = (i: ExamItem): BubbleStatus => (answers[i.question.id] ? 'answered' : 'blank');
	const isFlagged = (i: ExamItem) => flags.has(i.question.id);

	// Keys: 1–4 or A–D choose, N / → next, P / ← back, F flag.
	function onkeydown(event: KeyboardEvent) {
		if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
		if (submitOpen || leaveOpen || timeUp || sheetOpen || onIntro) return;
		const target = event.target as HTMLElement;
		if (target.closest('textarea, select, [contenteditable], [role="menu"]')) return;
		const inRadios =
			(target instanceof HTMLInputElement && target.type === 'radio') ||
			!!target.closest('[role="radiogroup"]');
		const key = event.key.toLowerCase();
		const letters = item.question.options.map((o) => o.label);
		const pick = /^[1-9]$/.test(key)
			? letters[Number(key) - 1]
			: letters.find((l) => l.toLowerCase() === key);

		if (pick) choose(pick);
		else if (key === 'n' || (key === 'arrowright' && !inRadios)) go(current + 1);
		else if (key === 'p' || (key === 'arrowleft' && !inRadios)) go(current - 1);
		else if (key === 'f') toggleFlag();
		else return;
		event.preventDefault();
	}
</script>

<svelte:window {onkeydown} />
<!-- Catch up at once when the tab comes back to the front -->
<svelte:document onvisibilitychange={syncClock} />

<svelte:head>
	<title>{title} · Oplan Aral</title>
</svelte:head>

{#snippet submitButton(className: string)}
	<Button
		variant="secondary"
		class={cn('rounded-full', className)}
		onclick={() => (submitOpen = true)}
	>
		Submit exam
	</Button>
{/snippet}

<div class="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
	<h1 class="sr-only">{title}</h1>

	<!-- Top bar: exam name, subjects, clock -->
	<header
		class="sticky top-0 z-30 flex-none bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md"
	>
		<div class="mx-auto flex h-16 max-w-[1440px] items-center gap-2.5 px-4 lg:px-6">
			<Logo size={34} />
			<div class="min-w-0 flex-1 md:flex-none">
				<p class="truncate text-sm font-semibold tracking-[-0.01em]">{title}</p>
				<p class="truncate text-xs text-muted-foreground">{section.name}</p>
			</div>
			{#if sections.length > 1}
				<Segmented
					class="mx-auto hidden md:inline-flex"
					label="Subjects"
					options={subjectOptions}
					value={item.subject}
					onchange={openSubject}
				/>
			{/if}
			<ExamTimer bind:on={timerOn} {secondsLeft} {totalSeconds} onskip={skipToTimeUp} />
			<Button
				variant="ghost"
				class="h-11 rounded-full px-3 max-sm:w-11"
				onclick={() => (leaveOpen = true)}
				aria-label="Save and leave"
			>
				<LogOut data-icon="inline-start" />
				<span class="hidden sm:inline">Save and leave</span>
			</Button>
		</div>
		{#if sections.length > 1}
			<div class="overflow-x-auto px-4 pb-2.5 md:hidden">
				<Segmented
					stretch
					label="Subjects"
					options={subjectOptions}
					value={item.subject}
					onchange={openSubject}
				/>
			</div>
		{/if}
	</header>

	<div
		class="mx-auto grid w-full max-w-[1440px] flex-1 gap-4 px-4 pt-2 pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_19rem] lg:grid-rows-[minmax(0,1fr)] lg:px-6 lg:pb-5"
	>
		<main class="min-w-0 lg:min-h-0">
			{#if onIntro}
				{@const done = section.items.filter((i) => answers[i.question.id]).length}
				<!-- Subject intro: the clock waits until Start. Below laptop width on a short screen
				     (a phone held sideways) it turns into two columns and drops its Start button (the
				     footer has one) so it fits above the fixed footer; see <style>. On laptops it
				     scrolls inside its card when the window is short. -->
				<section
					class="intro reveal card-surface flex flex-col items-start gap-6 p-6 sm:p-8 lg:h-full lg:justify-center lg:overflow-y-auto lg:px-12"
					aria-labelledby="intro-title"
				>
					<h2
						id="intro-title"
						class="flex items-center gap-3 text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight font-semibold tracking-[-0.035em] text-balance"
					>
						<span class="size-3 flex-none rounded-full" style:background={section.color}></span>
						{done ? `Continue ${section.name}` : section.name}
					</h2>
					<dl class="intro-facts flex flex-wrap gap-x-10 gap-y-4">
						<div>
							<dt class="text-xs text-muted-foreground">Subject</dt>
							<dd class="text-2xl font-semibold tracking-[-0.03em] tabular">
								{sections.indexOf(section) + 1} of {sections.length}
							</dd>
						</div>
						<div>
							<dt class="text-xs text-muted-foreground">Questions</dt>
							<dd class="text-2xl font-semibold tracking-[-0.03em] tabular">
								{done ? `${section.items.length - done} left` : section.items.length}
							</dd>
						</div>
						<div>
							<dt class="text-xs text-muted-foreground">
								{!timerOn ? 'Timer' : resuming ? 'Time left' : 'Time for this subject'}
							</dt>
							<dd class="text-2xl font-semibold tracking-[-0.03em] tabular">
								{#if !timerOn}Off{:else if resuming}{Math.ceil(secondsLeft / 60)} min{:else}About
									{section.minutes} min{/if}
							</dd>
						</div>
					</dl>
					<div class="intro-notes flex max-w-[52ch] flex-col gap-3">
						<ul class="flex flex-col gap-1.5 text-sm text-muted-foreground">
							<li>Shade one bubble per question. You can change it until you submit.</li>
							<li>Flag a question to find it again on the answer sheet.</li>
							<li>
								{timerOn
									? 'The clock runs only after you press Start.'
									: 'No time limit. Take the time you need.'}
							</li>
							<li class="hidden pointer-fine:list-item">
								Keys: 1–4 or A–D choose, N next, P back, F flag.
							</li>
						</ul>
						{#if sampleNote}
							<p class="text-xs text-muted-foreground">{sampleNote}</p>
						{/if}
					</div>
					<Button class="intro-start h-12 rounded-full px-6 text-[15px]" onclick={next}>
						{done ? 'Continue' : 'Start'}
						{section.short}
						<ArrowRight data-icon="inline-end" />
					</Button>
				</section>
			{:else}
				<div
					class={cn(
						'flex flex-col gap-3 lg:h-full',
						item.passage &&
							'md:grid md:grid-cols-2 md:items-start md:gap-4 lg:grid-rows-[minmax(0,1fr)] lg:items-stretch'
					)}
				>
					{#if item.passage}
						<div class="md:hidden">
							<Segmented
								stretch
								label="Show"
								options={[
									{ value: 'passage', label: 'Passage' },
									{ value: 'question', label: 'Question' }
								]}
								bind:value={view}
							/>
						</div>
						<section
							class={cn(
								'card-surface p-5 sm:p-6 md:sticky md:top-20 md:max-h-[calc(100dvh-10.5rem)] md:overflow-y-auto lg:static lg:h-full lg:max-h-none',
								view !== 'passage' && 'max-md:hidden'
							)}
							aria-label="Reading passage"
						>
							<PassagePanel passage={item.passage} note={passageNote} />
						</section>
					{/if}

					<section
						class={cn(
							'card-surface flex flex-col lg:h-full lg:min-h-0',
							item.passage && view !== 'question' && 'max-md:hidden'
						)}
						aria-labelledby="q-stem"
					>
						<div class="flex items-center gap-2 px-5 pt-3 sm:px-6">
							<span class="size-2 rounded-full" style:background={section.color}></span>
							<p class="text-sm text-muted-foreground" aria-live="polite">
								<span class="sr-only">{section.name},</span>
								Question <span class="font-semibold text-foreground tabular">{item.n}</span> of
								{section.items.length}
							</p>
							<button
								type="button"
								class={cn(
									'-mr-2 ml-auto flex h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors duration-150',
									flagged
										? 'bg-warning-soft text-warning'
										: 'text-muted-foreground hover:bg-muted hover:text-foreground'
								)}
								aria-pressed={flagged}
								onclick={toggleFlag}
							>
								<Flag class={cn('size-4', flagged && 'fill-current')} aria-hidden="true" />
								{flagged ? 'Flagged' : 'Flag'}
							</button>
						</div>

						{#key item.index}
							<div
								class={cn(
									'flex flex-col gap-5 px-5 pt-2 pb-5 sm:px-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto',
									direction === 'next' ? 'animate-slide-next' : 'animate-slide-prev'
								)}
							>
								<QuestionStem question={item.question} id="q-stem" />
								<fieldset class="flex flex-col gap-2">
									<legend class="sr-only">Choose an answer</legend>
									{#each item.question.options as option, i (option.label)}
										<OptionBubble
											name="answer-{item.question.id}"
											letter={option.label}
											text={option.text}
											checked={answers[item.question.id] === option.label}
											disabled={timeUp}
											onselect={() => choose(option.label)}
											shortcut={String(i + 1)}
										/>
									{/each}
								</fieldset>
								{#if isLast}
									<p class="text-sm text-muted-foreground">
										That was the last question. Check your answer sheet, then submit.
									</p>
								{/if}
							</div>
						{/key}

						<!-- Laptop and up: Back and Next at the bottom of the card -->
						<footer
							class="hidden flex-none items-center gap-3 border-t border-border px-6 py-3 lg:flex"
						>
							<Button
								variant="secondary"
								class="h-11 rounded-full px-4"
								onclick={() => go(current - 1)}
								disabled={current === 0}
							>
								<ArrowLeft data-icon="inline-start" /> Back
							</Button>
							<p class="mx-auto hidden text-xs text-muted-foreground xl:block">
								Keys: 1–4 choose · N next · P back · F flag
							</p>
							<Button
								class="ml-auto h-11 rounded-full px-5"
								onclick={() => go(current + 1)}
								disabled={isLast}
							>
								Next <ArrowRight data-icon="inline-end" />
							</Button>
						</footer>
					</section>
				</div>
			{/if}
		</main>

		<!-- Laptop and up: answer sheet in a side column; Submit at its top, away from Next -->
		<aside
			class="card-surface hidden min-h-0 flex-col gap-3 p-4 lg:flex"
			aria-label="Answer sheet and submit"
		>
			<div class="flex items-center justify-between gap-2 px-0.5">
				<div>
					<h2 class="text-sm font-semibold">Answer sheet</h2>
					<p class="text-xs text-muted-foreground tabular">
						{answeredCount} of {items.length} answered{flags.size ? ` · ${flags.size} flagged` : ''}
					</p>
				</div>
				{@render submitButton('h-10 px-4')}
			</div>
			{#if sampleNote}
				<p class="px-0.5 text-xs text-muted-foreground">{sampleNote}</p>
			{/if}
			<div class="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pt-1">
				<AnswerSheet {sections} {current} {status} flagged={isFlagged} onjump={go} />
			</div>
		</aside>
	</div>

	<!-- Phones and tablets: Back, answer sheet, Next fixed within thumb reach -->
	<nav
		class="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
		aria-label="Questions"
	>
		<div class="mx-auto flex max-w-2xl items-center gap-2 px-3 py-2.5">
			<Button
				variant="secondary"
				class="h-12 rounded-full px-4 max-[379px]:w-12 max-[379px]:px-0"
				onclick={() => go(current - 1)}
				disabled={current === 0}
				aria-label="Back"
			>
				<ArrowLeft data-icon="inline-start" />
				<span class="max-[379px]:hidden">Back</span>
			</Button>
			<Button
				variant="ghost"
				class="h-12 min-w-0 flex-1 rounded-full text-sm font-semibold tabular"
				onclick={() => (sheetOpen = true)}
				aria-label="Answer sheet: {answeredCount} of {items.length} answered"
			>
				<span class="h-3.5 w-5 rounded-[50%] bg-foreground" aria-hidden="true"></span>
				{answeredCount} / {items.length}
			</Button>
			<Button class="h-12 rounded-full px-5" onclick={next} disabled={isLast && !onIntro}>
				{onIntro ? 'Start' : 'Next'}
				<ArrowRight data-icon="inline-end" />
			</Button>
		</div>
	</nav>
</div>

<!-- Phones and tablets: the answer sheet as a bottom sheet -->
<Modal
	bind:open={sheetOpen}
	variant="sheet"
	title="Answer sheet"
	description="{answeredCount} of {items.length} answered{flags.size
		? ` · ${flags.size} flagged`
		: ''}. Tap a number to go there.{sampleNote ? ` ${sampleNote}` : ''}"
	class="gap-3 px-4 pt-5 lg:hidden"
>
	<div class="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pt-1">
		<AnswerSheet {sections} {current} {status} flagged={isFlagged} onjump={go} />
	</div>
	{@render submitButton('h-12 w-full')}
</Modal>

<!-- D1 Submit -->
<Modal
	bind:open={submitOpen}
	title="Submit your exam?"
	description={unanswered
		? `You have ${unanswered} unanswered question${unanswered === 1 ? '' : 's'}. Once you submit, you can't change your answers.`
		: "You answered every question. Once you submit, you can't change your answers."}
>
	{#snippet actions()}
		<Button variant="outline" class="h-11 rounded-full px-5" onclick={() => (submitOpen = false)}>
			Keep going
		</Button>
		<Button class="h-11 rounded-full px-5" href={resolve(`app/exams/${examId}/results`)}>
			Submit
		</Button>
	{/snippet}
</Modal>

<!-- D2 Save and leave -->
<Modal
	bind:open={leaveOpen}
	title="Save and leave?"
	description="Your answers and time left are saved. Continue this exam from your dashboard."
>
	{#snippet actions()}
		<Button variant="outline" class="h-11 rounded-full px-5" onclick={() => (leaveOpen = false)}>
			Stay
		</Button>
		<Button class="h-11 rounded-full px-5" href={resolve('app')}>Leave</Button>
	{/snippet}
</Modal>

<!-- D3 Time's up -->
<Modal
	open={timeUp}
	dismissable={false}
	title="Time's up"
	description="Your answers were submitted. You answered {answeredCount} of {items.length} questions."
>
	{#snippet actions()}
		<Button class="h-11 rounded-full px-5" href={resolve(`app/exams/${examId}/results`)}>
			See results <ArrowRight data-icon="inline-end" />
		</Button>
	{/snippet}
</Modal>

<style>
	/* A phone held sideways (short, below laptop width): the intro goes two columns and hides
	   its own Start button (the footer has one), so all of it fits above the fixed footer.
	   Scoped selectors outrank the Tailwind utilities they override. */
	@media (max-height: 30rem) and (max-width: 63.999rem) {
		.intro {
			display: grid;
			grid-template-columns: minmax(0, 19rem) minmax(0, 1fr);
			align-items: start;
			gap: 0.75rem 2rem;
			padding: 1rem 1.25rem;
		}
		.intro h2 {
			font-size: 1.5rem;
		}
		.intro-facts {
			column-gap: 1.5rem;
		}
		.intro-facts dd {
			font-size: 1.25rem;
			line-height: 1.75rem;
		}
		.intro-notes {
			grid-column: 2;
			grid-row: 1 / span 2;
		}
		.intro :global(.intro-start) {
			display: none;
		}
	}
</style>
