<script lang="ts">
	import { resolve } from '$app/paths';
	import Bloom from '#lib/components/brand/Bloom.svelte';
	import Logo from '#lib/components/brand/Logo.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<!--
	Split screen for P2–P5. From 768px: art panel left (40% on tablets, 50% on laptops),
	form right. On phones: a short CSS-only band (gradient + Bloom, no image download)
	above the form. The art image is lazy and display:none on phones, so phones never fetch it.
-->
<div class="min-h-dvh bg-card md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:grid-cols-2">
	<!-- Phone band -->
	<div
		class="relative flex h-24 items-start overflow-hidden rounded-b-[var(--radius-card)] bg-(image:--hero-gradient) px-5 pt-[max(1.25rem,env(safe-area-inset-top))] md:hidden"
	>
		<a href={resolve('')} class="relative z-10 -m-1 rounded-xl p-1" aria-label="Oplan Aral home">
			<Logo wordmark size={32} />
		</a>
		<Bloom size={88} class="absolute -right-3 -bottom-8" />
		<Bloom size={40} hue="chalk" class="absolute right-24 bottom-2" />
	</div>

	<!-- Art panel (tablet and up) -->
	<aside class="hidden p-3 md:block" aria-label="About Oplan Aral">
		<div
			class="sticky top-3 h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[var(--radius-card)] bg-(image:--hero-gradient)"
		>
			<enhanced:img
				src="#lib/assets/art/auth-panel.png"
				sizes="(min-width: 1024px) 50vw, 40vw"
				alt=""
				loading="lazy"
				class="absolute inset-0 size-full object-cover object-[50%_65%]"
			/>
			<div
				class="card-surface absolute inset-x-5 top-5 flex max-w-sm flex-col gap-1.5 p-5 lg:inset-x-8 lg:top-8 lg:p-6 [@media(max-height:31rem)]:hidden"
			>
				<p class="text-lg leading-snug font-semibold tracking-[-0.02em] text-balance lg:text-xl">
					Practise like it's exam day.
				</p>
				<p class="text-sm leading-relaxed text-pretty text-muted-foreground">
					Free UPCAT mock exams from a hand-checked question bank. Each one is new to you, and the
					next one leans on the topics you missed.
				</p>
			</div>
		</div>
	</aside>

	<!-- Form column -->
	<div
		class="flex min-h-[calc(100dvh-6rem)] flex-col px-5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-10 md:min-h-dvh md:py-8 lg:px-16"
	>
		<a
			href={resolve('')}
			class="-m-1 hidden w-fit rounded-xl p-1 md:inline-flex"
			aria-label="Oplan Aral home"
		>
			<Logo wordmark size={32} />
		</a>
		<main class="flex flex-1 flex-col justify-center py-4 md:py-10">
			<div class="mx-auto flex w-full max-w-sm flex-col">
				{@render children()}
			</div>
		</main>
		<p class="text-center text-xs leading-relaxed text-muted-foreground md:text-left">
			Oplan Aral is a free study tool. It is not affiliated with UP, PSHS or DOST.
		</p>
	</div>
</div>
