<script lang="ts">
	// Account menu built on the browser's popover API: light dismiss, Escape to close and focus
	// return come for free, so no menu library ships on every app page.
	import { resolve } from '$app/paths';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import Settings from '@lucide/svelte/icons/settings';
	import ArrowLeftRight from '@lucide/svelte/icons/arrow-left-right';
	import LogOut from '@lucide/svelte/icons/log-out';
	import { prototype } from '#lib/state/prototype.svelte.js';
	import { student } from '#lib/data/mock.js';
	import type { ShellVariant } from './nav.js';
	import { cn } from '#lib/utils.js';

	interface Props {
		variant: ShellVariant;
		/** 'rail' sits on the dark sidebar, 'bar' on the phone top bar */
		placement?: 'rail' | 'bar';
	}

	let { variant, placement = 'rail' }: Props = $props();

	const id = $props.id();

	const email = $derived(variant === 'admin' ? 'researcher@example.com' : student.email);
	const initials = $derived(variant === 'admin' ? 'RC' : student.initials);

	// Links navigate on the client, so close the menu ourselves.
	const close = (e: MouseEvent) =>
		(e.currentTarget as HTMLElement).closest<HTMLElement>('[popover]')?.hidePopover();

	const item =
		'flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 text-sm text-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground';
</script>

<button
	type="button"
	popovertarget="account-{id}"
	class={cn(
		'grid size-11 place-items-center rounded-full text-xs font-semibold transition-transform duration-150 ease-spring active:scale-95',
		'bg-sidebar-primary text-sidebar-primary-foreground',
		placement === 'rail' && 'ring-2 ring-sidebar-accent'
	)}
	aria-label="Account menu"
>
	{initials}
</button>

<div
	id="account-{id}"
	popover="auto"
	class={cn(
		'm-0 w-64 rounded-2xl border bg-popover p-1.5 text-popover-foreground shadow-lift',
		'fixed inset-auto',
		placement === 'rail'
			? 'bottom-4 left-[5.75rem] origin-bottom-left'
			: 'top-[calc(max(0.75rem,env(safe-area-inset-top))+3.25rem)] right-4 origin-top-right',
		'transition-[opacity,scale,display,overlay] transition-discrete duration-150 ease-enter',
		'scale-95 opacity-0 open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0'
	)}
>
	<div class="flex flex-col gap-0.5 px-3 pt-2 pb-2.5">
		<span class="text-xs text-muted-foreground"
			>{variant === 'admin' ? 'Researcher' : 'Student'}</span
		>
		<span class="truncate text-sm font-medium">{email}</span>
	</div>
	<hr class="my-1 border-border" />
	<ul class="flex flex-col">
		<li>
			<button type="button" class={item} onclick={() => prototype.toggleTheme()}>
				{#if prototype.theme === 'dark'}
					<Sun /> Light mode
				{:else}
					<Moon /> Dark mode
				{/if}
			</button>
		</li>
		{#if variant === 'student'}
			<li>
				<a href={resolve('app/settings')} class={item} onclick={close}><Settings /> Settings</a>
			</li>
		{/if}
		<li>
			<a href={resolve(variant === 'admin' ? 'app' : 'admin')} class={item} onclick={close}>
				<ArrowLeftRight />
				{variant === 'admin' ? 'Switch to student view' : 'Switch to admin view'}
			</a>
		</li>
	</ul>
	<hr class="my-1 border-border" />
	<a href={resolve('')} class={item} onclick={close}><LogOut /> Log out</a>
</div>
