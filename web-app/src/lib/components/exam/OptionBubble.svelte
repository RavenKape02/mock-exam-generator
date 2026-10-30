<script lang="ts">
	// One answer option drawn like a row on the answer sheet: a lettered bubble that gets shaded.
	// With `name` it is a real radio button (Take exam); without, a read-only row (Answer review).
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import { cn } from '#lib/utils.js';
	import RichText from './RichText.svelte';

	type ReviewState = 'correct' | 'wrong' | 'key' | 'idle';

	interface Props {
		letter: string;
		text: string;
		/** Radio group name; makes the row selectable */
		name?: string;
		checked?: boolean;
		onselect?: () => void;
		/** Locks the choice (e.g. after time is up) */
		disabled?: boolean;
		/** Keyboard shortcut shown on devices with a mouse */
		shortcut?: string;
		/** Review only */
		review?: ReviewState;
	}

	let {
		letter,
		text,
		name,
		checked = false,
		onselect,
		disabled = false,
		shortcut,
		review = 'idle'
	}: Props = $props();

	const shaded = $derived(name ? checked : review === 'correct' || review === 'wrong');
	const tag = $derived(
		review === 'correct' || review === 'wrong'
			? 'Your answer'
			: review === 'key'
				? 'Correct answer'
				: null
	);
</script>

{#snippet body()}
	<span
		class={cn(
			'relative grid size-8 flex-none place-items-center rounded-full border-2 text-[13px] font-semibold transition-colors duration-100',
			review === 'key'
				? 'border-success text-success'
				: shaded
					? 'border-transparent'
					: 'border-foreground/30 text-foreground/80'
		)}
		aria-hidden="true"
	>
		{#if shaded}
			<span
				class={cn(
					'absolute -inset-0.5 animate-fill rounded-full',
					review === 'correct' ? 'bg-success' : review === 'wrong' ? 'bg-danger' : 'bg-foreground'
				)}
			></span>
		{/if}
		<span class={cn('relative', shaded && 'text-background')}>{letter}</span>
	</span>
	<RichText {text} inline class="min-w-0 flex-1 text-[15px] leading-snug" />
	{#if tag}
		<span
			class={cn(
				'flex flex-none items-center gap-1 text-xs font-medium',
				review === 'wrong' ? 'text-danger' : 'text-success'
			)}
		>
			{#if review === 'wrong'}<X class="size-4" />{:else}<Check class="size-4" />{/if}
			<span class="sr-only sm:not-sr-only">{tag}</span>
		</span>
	{:else if shortcut}
		<kbd
			class="hidden size-6 flex-none place-items-center rounded-md border border-border bg-muted font-sans text-xs text-muted-foreground pointer-fine:grid"
			>{shortcut}</kbd
		>
	{/if}
{/snippet}

{#if name}
	<label
		class={cn(
			'flex min-h-13 items-center gap-3 rounded-2xl border px-3 py-2 transition-[background-color,border-color,transform] duration-100 ease-standard select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
			disabled ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]',
			checked
				? 'border-foreground/50 bg-secondary'
				: cn('border-border bg-card', !disabled && 'hover:bg-muted')
		)}
	>
		<input
			type="radio"
			class="sr-only"
			{name}
			value={letter}
			{checked}
			{disabled}
			onchange={() => {
				if (!disabled) onselect?.();
			}}
		/>
		{@render body()}
	</label>
{:else}
	<div
		class={cn(
			'flex min-h-13 items-center gap-3 rounded-2xl border px-3 py-2',
			review === 'correct'
				? 'border-success/40 bg-success-soft'
				: review === 'wrong'
					? 'border-danger/40 bg-danger-soft'
					: review === 'key'
						? 'border-dashed border-success/50'
						: 'border-border'
		)}
	>
		{@render body()}
	</div>
{/if}
