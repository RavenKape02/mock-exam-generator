<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Bloom from '#lib/components/brand/Bloom.svelte';
	import Logo from '#lib/components/brand/Logo.svelte';
	import TryQuestion from '#lib/components/marketing/TryQuestion.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { EXAM_SUBJECTS, SUBJECTS } from '#lib/data/mock.js';

	const steps = [
		{
			title: 'Pick your exam and question count',
			text: 'A full UPCAT mock exam or just one subject, with 10 to 60 questions per subject. Every question is one you have not seen yet.'
		},
		{
			title: 'Take it like the real test',
			text: 'Shade your answers on an answer sheet, with a timer you can turn off. Save and finish later if you need to.'
		},
		{
			title: 'See your weak topics',
			text: 'Get your score per subject and per topic. Your next exam leans on the topics you missed.'
		}
	];

	// The steps form one answer-sheet strip: row n has n bubbles shaded, filled in reading order.
	// Where the browser supports scroll timelines, each bubble shades in as it scrolls into view;
	// elsewhere they shade in one after another on load.
	const bubbleOrder = (row: number, bubble: number) => (row * (row + 1)) / 2 + bubble;

	const upcat = EXAM_SUBJECTS.UPCAT.map((slug) => SUBJECTS[slug]);
	const pshs = EXAM_SUBJECTS['PSHS NCE'].map((slug) => SUBJECTS[slug]);
</script>

<svelte:head>
	<title>Oplan Aral · Free UPCAT mock exams</title>
	<meta
		name="description"
		content="Free UPCAT mock exams for Filipino students. Each exam uses questions you haven't seen, and the next one gives you more of your weak topics. PSHS NCE coming soon."
	/>
</svelte:head>

<div class="min-h-dvh bg-background">
	<header
		class="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:px-6 lg:px-8"
	>
		<a href={resolve('')} class="-m-1 rounded-xl p-1" aria-label="Oplan Aral home">
			<Logo wordmark size={32} />
		</a>
		<nav aria-label="Account" class="flex items-center gap-1.5">
			<Button
				href={resolve('login')}
				variant="ghost"
				class="h-11 rounded-full px-4 text-[0.9375rem]"
			>
				Log in
			</Button>
			<Button
				href={resolve('signup')}
				class="hidden h-11 rounded-full px-5 text-[0.9375rem] min-[360px]:inline-flex"
			>
				Sign up
			</Button>
		</nav>
	</header>

	<main
		class="mx-auto max-w-[1440px] px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8"
	>
		<!-- First viewport: the promise and its action, then a real question to answer -->
		<section
			aria-labelledby="hero-title"
			class="relative overflow-hidden rounded-[28px] bg-(image:--hero-gradient) px-5 pt-9 pb-5 sm:px-8 sm:pt-12 sm:pb-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10 lg:px-12 lg:py-12 xl:px-16"
		>
			<div class="relative z-10 flex max-w-xl flex-col items-start gap-5">
				<h1
					id="hero-title"
					class="reveal text-[clamp(2.1rem,6.4vw,3.75rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance"
					style="--i: 0"
				>
					Free UPCAT mock exams that find your weak spots.
				</h1>
				<p
					class="reveal max-w-[34rem] text-base leading-relaxed text-pretty text-foreground/75 sm:text-lg"
					style="--i: 1"
				>
					Every exam is built fresh from a hand-checked question bank, using questions you haven't
					seen yet. Then the next one leans on the topics you missed. PSHS NCE is coming soon.
				</p>
				<div class="reveal flex flex-wrap items-center gap-2.5" style="--i: 2">
					<Button
						href={resolve('signup')}
						class="h-12 rounded-full px-6 text-base shadow-lift transition-[background-color,translate,box-shadow] duration-150 ease-spring hover:-translate-y-px"
					>
						Sign up free
						<ArrowRight data-icon="inline-end" />
					</Button>
					<Button
						href={resolve('login')}
						variant="ghost"
						class="h-12 rounded-full bg-card/70 px-6 text-base hover:bg-card"
					>
						Log in
					</Button>
				</div>
			</div>

			<div class="relative mt-6 lg:mt-0">
				<div
					class="reveal pointer-events-none relative -mb-14 ml-auto w-[82%] max-w-[26rem] sm:-mb-24 lg:absolute lg:-top-16 lg:-right-16 lg:mb-0 lg:w-[80%] lg:max-w-none"
					style="--i: 3"
					aria-hidden="true"
				>
					<enhanced:img
						src="#lib/assets/art/hero.png"
						sizes="(min-width: 1024px) 560px, 82vw"
						alt=""
						fetchpriority="high"
						class="h-auto w-full"
					/>
				</div>
				<div class="reveal relative lg:mt-28 lg:mr-[14%]" style="--i: 4">
					<TryQuestion />
				</div>
			</div>
		</section>

		<!-- How it works -->
		<section
			aria-labelledby="how-title"
			class="mx-auto mt-16 grid max-w-[1200px] gap-6 px-2 sm:mt-24 sm:px-0 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-12"
		>
			<div class="flex flex-col gap-3 lg:pt-6">
				<h2
					id="how-title"
					class="text-[clamp(1.6rem,3.6vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em] text-balance"
				>
					How it works
				</h2>
				<p class="max-w-md leading-relaxed text-pretty text-muted-foreground">
					It feels like the real test. Then it tells you what to practise next.
				</p>
			</div>
			<!-- One answer-sheet strip: numbered rows, each shading one more bubble than the last -->
			<ol class="card-surface flex flex-col divide-y">
				{#each steps as step, i (step.title)}
					<li
						class="grid grid-cols-[2rem_auto] items-center gap-x-3 gap-y-3 px-5 py-5 sm:grid-cols-[2.25rem_auto_minmax(0,1fr)] sm:items-start sm:gap-x-7 sm:px-7 sm:py-6"
					>
						<span
							class="text-lg leading-none font-semibold text-muted-foreground tabular sm:pt-1.5"
							aria-hidden="true"
						>
							{i + 1}.
						</span>
						<span class="flex gap-2 sm:pt-0.5" aria-hidden="true">
							{#each [0, 1, 2] as b (b)}
								<span class="relative h-7 w-10 rounded-[50%] border-[1.5px] border-foreground/30">
									{#if b <= i}
										<span
											class="absolute -inset-px animate-fill rounded-[50%] bg-brand motion-reduce:animate-none"
											style:animation-delay="{200 + bubbleOrder(i, b) * 110}ms"
											style:animation-fill-mode="backwards"
											style:animation-timeline="view()"
											style:animation-range="cover {20 + b * 5}% cover {26 + b * 5}%"
										></span>
									{/if}
								</span>
							{/each}
						</span>
						<div class="col-span-2 flex max-w-[36rem] flex-col gap-1.5 sm:col-span-1">
							<h3 class="text-lg leading-snug font-semibold tracking-[-0.02em] text-balance">
								<span class="sr-only">Step {i + 1}:</span>
								{step.title}
							</h3>
							<p class="text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
								{step.text}
							</p>
						</div>
					</li>
				{/each}
			</ol>
		</section>

		<!-- What's inside -->
		<section
			aria-labelledby="inside-title"
			class="mx-auto mt-16 flex max-w-[1200px] flex-col gap-6 px-2 sm:mt-24 sm:px-0"
		>
			<div class="flex flex-col gap-3">
				<h2
					id="inside-title"
					class="text-[clamp(1.6rem,3.6vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em] text-balance"
				>
					What's inside
				</h2>
				<p class="max-w-xl leading-relaxed text-pretty text-muted-foreground">
					Two entrance exams with four subjects each. A full mock exam has 60 questions per subject,
					and you can do up to 1,200 questions a day.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				<article class="card-surface flex flex-col gap-4 p-5 sm:p-6">
					<div class="flex items-center justify-between gap-3">
						<h3 class="text-xl font-semibold tracking-[-0.02em]">UPCAT</h3>
						<Badge>Open now</Badge>
					</div>
					<p class="text-sm leading-relaxed text-muted-foreground">
						For Grade 12 students. Questions come from a hand-checked bank and are tagged by topic.
					</p>
					<ul class="flex flex-col divide-y">
						{#each upcat as subject (subject.slug)}
							<li class="flex min-h-11 items-center gap-3 py-2 text-[0.9375rem]">
								<span
									class="size-2.5 shrink-0 rounded-full"
									style:background-color={subject.color}
									aria-hidden="true"
								></span>
								{subject.name}
							</li>
						{/each}
					</ul>
				</article>

				<article
					class="flex flex-col gap-4 rounded-[var(--radius-card)] border border-dashed border-input p-5 sm:p-6"
				>
					<div class="flex items-center justify-between gap-3">
						<h3 class="text-xl font-semibold tracking-[-0.02em]">PSHS NCE</h3>
						<Badge variant="secondary">Coming soon</Badge>
					</div>
					<p class="text-sm leading-relaxed text-muted-foreground">
						For Grade 6 pupils. Its question bank is still being prepared, so these exams are not
						open yet.
					</p>
					<ul class="flex flex-col divide-y text-muted-foreground">
						{#each pshs as subject (subject.slug)}
							<li class="flex min-h-11 items-center gap-3 py-2 text-[0.9375rem]">
								<span
									class="size-2.5 shrink-0 rounded-full opacity-60"
									style:background-color={subject.color}
									aria-hidden="true"
								></span>
								{subject.name}
							</li>
						{/each}
					</ul>
				</article>
			</div>
		</section>

		<!-- Closing call to action -->
		<section
			aria-labelledby="cta-title"
			class="relative mx-auto mt-16 max-w-[1200px] overflow-hidden rounded-[28px] bg-(image:--hero-gradient) px-6 pt-10 pb-36 sm:mt-24 sm:px-10 sm:py-14"
		>
			<div class="relative z-10 flex max-w-lg flex-col items-start gap-4">
				<h2
					id="cta-title"
					class="text-[clamp(1.6rem,3.6vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em] text-balance"
				>
					Your first mock exam is free. So is every one after it.
				</h2>
				<p class="leading-relaxed text-pretty text-foreground/75">
					Sign up with just your email and a password.
				</p>
				<div class="flex flex-wrap items-center gap-2.5">
					<Button href={resolve('signup')} class="h-12 rounded-full px-6 text-base">
						Sign up free
						<ArrowRight data-icon="inline-end" />
					</Button>
					<Button
						href={resolve('login')}
						variant="ghost"
						class="h-12 rounded-full bg-card/70 px-6 text-base hover:bg-card"
					>
						Log in
					</Button>
				</div>
			</div>
			<Bloom
				size={150}
				spin
				class="absolute -right-6 -bottom-10 sm:top-1/2 sm:right-12 sm:bottom-auto sm:-translate-y-1/2"
			/>
			<Bloom
				size={56}
				hue="chalk"
				class="absolute right-36 bottom-6 sm:top-10 sm:right-56 sm:bottom-auto"
			/>
		</section>

		<footer
			class="mx-auto mt-16 flex max-w-[1200px] flex-col gap-5 border-t px-2 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-start sm:justify-between sm:px-0"
		>
			<div class="flex flex-col gap-3">
				<Logo wordmark size={28} />
				<p class="max-w-sm leading-relaxed">
					Free UPCAT and PSHS NCE mock exams for Filipino students. Not affiliated with UP, PSHS or
					DOST.
				</p>
			</div>
			<nav aria-label="Footer" class="-ml-3 flex gap-1 sm:ml-0">
				<a
					href={resolve('login')}
					class="inline-flex min-h-11 items-center rounded-md px-3 hover:text-foreground"
				>
					Log in
				</a>
				<a
					href={resolve('signup')}
					class="inline-flex min-h-11 items-center rounded-md px-3 hover:text-foreground"
				>
					Sign up
				</a>
			</nav>
		</footer>
	</main>
</div>
