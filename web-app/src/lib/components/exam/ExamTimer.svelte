<script lang="ts">
	// Ring timer in the exam header. Its menu (a native popover, no menu library) turns the timer off
	// (no countdown, no time limit) and holds one prototype-only control to jump to the time-up dialog.
	import TimerOff from '@lucide/svelte/icons/timer-off';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import FastForward from '@lucide/svelte/icons/fast-forward';
	import ScoreRing from '#lib/components/data-viz/ScoreRing.svelte';
	import { cn } from '#lib/utils.js';
	import { formatClock } from './exam.js';

	interface Props {
		secondsLeft: number;
		totalSeconds: number;
		on: boolean;
		/** Prototype control: end the time now */
		onskip: () => void;
	}

	let { secondsLeft, totalSeconds, on = $bindable(), onskip }: Props = $props();

	const id = $props.id();

	const lastMinute = $derived(on && secondsLeft <= 60);
	const clock = $derived(formatClock(secondsLeft));

	function skip(e: MouseEvent) {
		(e.currentTarget as HTMLElement).closest<HTMLElement>('[popover]')?.hidePopover();
		onskip();
	}
</script>

<button
	type="button"
	popovertarget="timer-{id}"
	class={cn(
		'flex h-11 flex-none items-center gap-2 rounded-full pr-2.5 pl-1.5 text-sm font-semibold tabular transition-colors duration-150',
		lastMinute ? 'bg-warning-soft text-warning' : 'bg-secondary hover:bg-muted',
		!on && 'pl-3 font-medium text-muted-foreground'
	)}
	aria-label={on ? `Time left ${clock}. Timer options` : 'Timer is off. Timer options'}
>
	{#if on}
		<span aria-hidden="true">
			<ScoreRing
				value={secondsLeft}
				max={totalSeconds}
				size={30}
				stroke={4}
				color={lastMinute ? 'var(--warning)' : 'var(--brand)'}
				label="Time left"
			/>
		</span>
		<span aria-hidden="true">{clock}</span>
	{:else}
		<TimerOff class="size-4" aria-hidden="true" />
		<span class="hidden sm:inline">No timer</span>
	{/if}
	<ChevronDown class="size-3.5 opacity-60" aria-hidden="true" />
</button>

<div
	id="timer-{id}"
	popover="auto"
	class={cn(
		'fixed inset-auto top-[calc(env(safe-area-inset-top)+4rem)] right-3 m-0 w-64 origin-top-right rounded-2xl border bg-popover p-1.5 text-popover-foreground shadow-lift',
		'transition-[opacity,scale,display,overlay] transition-discrete duration-150 ease-enter',
		'scale-95 opacity-0 open:scale-100 open:opacity-100 starting:open:scale-95 starting:open:opacity-0'
	)}
>
	<button
		type="button"
		role="switch"
		aria-checked={on}
		onclick={() => (on = !on)}
		class="flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 text-sm transition-colors hover:bg-accent"
	>
		Show timer
		<span
			class={cn(
				'relative h-5 w-9 flex-none rounded-full transition-colors duration-150',
				on ? 'bg-brand' : 'bg-input'
			)}
			aria-hidden="true"
		>
			<span
				class={cn(
					'absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform duration-150 ease-spring',
					on && 'translate-x-4'
				)}
			></span>
		</span>
	</button>
	<p class="px-3 pb-2 text-xs text-muted-foreground">
		{on
			? 'Turn it off to practise with no time limit.'
			: 'No time limit. Turn it on to practise under exam time.'}
	</p>
	<hr class="my-1 border-border" />
	<button
		type="button"
		onclick={skip}
		class="flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&_svg]:size-4"
	>
		<FastForward />
		Skip to time up (prototype)
	</button>
</div>
