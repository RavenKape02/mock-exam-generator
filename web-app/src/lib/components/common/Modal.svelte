<script lang="ts">
	// Modal built on the native <dialog>: focus trap, Escape, top layer and backdrop come from the
	// browser, so no dialog library ships. 'dialog' is centred on larger screens and slides up from
	// the bottom on phones; 'sheet' is always a bottom sheet.
	import type { Snippet } from 'svelte';
	import X from '@lucide/svelte/icons/x';
	import { cn } from '#lib/utils.js';

	interface Props {
		open: boolean;
		title: string;
		description?: string;
		/** Escape, the backdrop and the close button close it (false for must-answer dialogs) */
		dismissable?: boolean;
		variant?: 'dialog' | 'sheet';
		/** Buttons, primary last */
		actions?: Snippet;
		children?: Snippet;
		class?: string;
	}

	let {
		open = $bindable(),
		title,
		description,
		dismissable = true,
		variant = 'dialog',
		actions,
		children,
		class: className
	}: Props = $props();

	const id = $props.id();

	// Keep the element in step with `open`; closing by Escape or the backdrop flows back through onclose.
	function sync(dialog: HTMLDialogElement) {
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	}
</script>

<dialog
	{@attach sync}
	data-lenis-prevent
	aria-labelledby="{id}-title"
	aria-describedby={description ? `${id}-desc` : undefined}
	onclose={(e) => {
		// A second Escape can't be cancelled (browser close-watcher), so a must-answer dialog reopens.
		if (!dismissable && open) e.currentTarget.showModal();
		else open = false;
	}}
	oncancel={(e) => {
		if (!dismissable) e.preventDefault();
	}}
	onclick={(e) => {
		if (dismissable && e.target === e.currentTarget) e.currentTarget.close();
	}}
	class={cn(
		'flex-col gap-5 overflow-y-auto bg-card p-6 text-card-foreground shadow-lift open:flex',
		'transition-[opacity,translate,scale,display,overlay] transition-discrete duration-200 ease-enter',
		'opacity-0 open:opacity-100 starting:open:opacity-0',
		'backdrop:bg-[rgb(18_17_24/0.45)] backdrop:opacity-0 backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-200 open:backdrop:opacity-100 starting:open:backdrop:opacity-0',
		variant === 'dialog'
			? [
					'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md rounded-[var(--radius-card)]',
					'scale-96 open:scale-100 starting:open:scale-96',
					'max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:scale-100 max-sm:rounded-b-none max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]',
					'max-sm:translate-y-8 max-sm:open:translate-y-0 max-sm:starting:open:translate-y-8'
				]
			: [
					'mx-auto mt-auto mb-0 max-h-[85dvh] w-full max-w-2xl rounded-t-[var(--radius-card)] pb-[max(1.5rem,env(safe-area-inset-bottom))]',
					'translate-y-8 open:translate-y-0 starting:open:translate-y-8'
				],
		className
	)}
>
	<header class="flex items-start gap-3">
		<div class="flex min-w-0 flex-1 flex-col gap-1.5">
			<h2 id="{id}-title" class="text-lg font-semibold tracking-[-0.02em] text-balance">{title}</h2>
			{#if description}
				<p id="{id}-desc" class="text-sm text-muted-foreground">{description}</p>
			{/if}
		</div>
		{#if dismissable && variant === 'sheet'}
			<button
				type="button"
				class="-mt-1 -mr-2 grid size-11 flex-none place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				aria-label="Close"
				onclick={() => (open = false)}
			>
				<X class="size-4" />
			</button>
		{/if}
	</header>
	{@render children?.()}
	{#if actions}
		<div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			{@render actions()}
		</div>
	{/if}
</dialog>
