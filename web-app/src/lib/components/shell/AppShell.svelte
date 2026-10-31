<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import type Lenis from 'lenis';
	import { smoothElement } from '#lib/motion/smooth-scroll.js';
	import { resolve } from '$app/paths';
	import Settings from '@lucide/svelte/icons/settings';
	import Logo from '#lib/components/brand/Logo.svelte';
	import AccountMenu from './AccountMenu.svelte';
	import { NAV, activeIndex, type ShellVariant } from './nav.js';
	import { prototype } from '#lib/state/prototype.svelte.js';
	import { cn } from '#lib/utils.js';

	interface Props {
		variant: ShellVariant;
		children: Snippet;
	}

	let { variant, children }: Props = $props();

	const items = $derived(NAV[variant]);
	const active = $derived(activeIndex(items, page.url.pathname));
	const home = $derived(variant === 'admin' ? 'admin' : 'app');

	onMount(() => prototype.syncTheme());

	// From 768px the main area scrolls on its own: smooth it with Lenis, and start each new page at
	// the top (SvelteKit only resets the window). Back/forward keeps the browser's position.
	let mainLenis: Lenis | null = null;
	const smoothMain = smoothElement('(min-width: 768px)', (l) => (mainLenis = l));
	afterNavigate(({ type }) => {
		if (type !== 'popstate') mainLenis?.scrollTo(0, { immediate: true, force: true });
	});
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- every href here comes pre-resolved from nav.ts or resolve() -->

<!--
	Phone (< 768px): top bar + page scrolls + bottom tab bar.
	Tablet and up: the reference's dark icon rail, and the main area scrolls on its own.
-->
<div
	class="min-h-dvh md:flex md:h-dvh md:gap-4 md:overflow-hidden md:p-3.5 print:block print:h-auto print:overflow-visible print:p-0"
>
	<!-- Icon rail -->
	<aside
		class="hidden w-16 flex-none flex-col items-center gap-6 rounded-[26px] bg-sidebar py-3.5 md:flex print:hidden"
		aria-label="Main"
	>
		<a href={resolve(home)} class="rounded-[13px]" aria-label="Oplan Aral home">
			<Logo size={38} />
		</a>
		<nav class="relative flex flex-col gap-2">
			{#if active >= 0}
				<span
					class="nav-indicator pointer-events-none absolute top-0 left-0 size-11 rounded-full bg-sidebar-primary transition-transform duration-[380ms] ease-spring"
					style:transform="translateY({active * 52}px)"
					aria-hidden="true"
				></span>
			{/if}
			{#each items as item, i (item.path)}
				{@const Icon = item.icon}
				<a
					href={item.href}
					class={cn(
						'group relative grid size-11 place-items-center rounded-full transition-colors duration-150',
						i === active
							? 'text-sidebar-primary-foreground'
							: 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
					)}
					aria-label={item.label}
					aria-current={i === active ? 'page' : undefined}
				>
					<Icon class="relative z-10 size-[18px]" strokeWidth={1.8} />
					<span
						class="pointer-events-none absolute top-1/2 left-[calc(100%+20px)] z-50 -translate-x-1.5 -translate-y-1/2 rounded-lg bg-sidebar px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
					>
						{item.label}
					</span>
				</a>
			{/each}
		</nav>
		<div class="mt-auto flex flex-col items-center gap-3.5">
			{#if variant === 'student'}
				<a
					href={resolve('app/settings')}
					class={cn(
						'group relative grid size-11 place-items-center rounded-full transition-colors duration-150',
						page.url.pathname.endsWith('/app/settings')
							? 'bg-sidebar-accent text-sidebar-accent-foreground'
							: 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
					)}
					aria-label="Settings"
					aria-current={page.url.pathname.endsWith('/app/settings') ? 'page' : undefined}
				>
					<Settings class="size-[18px]" strokeWidth={1.8} />
					<span
						class="pointer-events-none absolute top-1/2 left-[calc(100%+20px)] z-50 -translate-x-1.5 -translate-y-1/2 rounded-lg bg-sidebar px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-lg transition duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
					>
						Settings
					</span>
				</a>
			{/if}
			<AccountMenu {variant} placement="rail" />
		</div>
	</aside>

	<!-- Phone top bar -->
	<header
		class="sticky top-0 z-30 flex items-center justify-between bg-background/85 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 backdrop-blur-md md:hidden print:hidden"
	>
		<a href={resolve(home)} aria-label="Oplan Aral home">
			<Logo size={32} wordmark />
		</a>
		<AccountMenu {variant} placement="bar" />
	</header>

	<main
		id="main"
		{@attach smoothMain}
		class="mx-auto w-full max-w-[1440px] px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:min-w-0 md:flex-1 md:overflow-x-hidden md:overflow-y-auto md:px-0.5 md:pt-0.5 md:pb-7 print:max-w-none print:overflow-visible print:p-0"
	>
		<div>{@render children()}</div>
	</main>

	<!-- Phone tab bar -->
	<nav
		class="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden print:hidden"
		aria-label="Main"
	>
		<ul class="mx-auto grid max-w-md grid-cols-4">
			{#each items as item, i (item.path)}
				{@const Icon = item.icon}
				<li>
					<a
						href={item.href}
						class={cn(
							'flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors duration-150',
							i === active ? 'text-brand-strong' : 'text-muted-foreground'
						)}
						aria-current={i === active ? 'page' : undefined}
					>
						<span
							class={cn(
								'grid h-7 w-12 place-items-center rounded-full transition-colors duration-150',
								i === active && 'bg-brand-soft'
							)}
						>
							<Icon class="size-[18px]" strokeWidth={1.9} />
						</span>
						{item.short}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</div>
