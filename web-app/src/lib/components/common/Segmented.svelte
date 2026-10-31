<script lang="ts" generics="T extends string | number">
	// Pill switcher with a sliding indicator (from design/reference).
	import { cn } from '#lib/utils.js';

	interface Option {
		value: T;
		label: string;
	}

	interface Props {
		options: Option[];
		value: T;
		label: string;
		onchange?: (value: T) => void;
		class?: string;
		/** Fill the width and split it evenly */
		stretch?: boolean;
	}

	let {
		options,
		value = $bindable(),
		label,
		onchange,
		class: className,
		stretch = false
	}: Props = $props();

	let indicator = $state({ x: 0, w: 0 });

	const buttonFor = (root: HTMLElement, v: T) =>
		root.querySelector<HTMLElement>(`[data-value="${CSS.escape(String(v))}"]`);

	// Measures the selected button so the indicator can slide under it. Re-runs when `value` changes
	// and whenever the switcher is resized.
	function trackIndicator(root: HTMLElement) {
		const selected = value;
		const measure = () => {
			const el = buttonFor(root, selected);
			if (el) indicator = { x: el.offsetLeft, w: el.offsetWidth };
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(root);
		return () => observer.disconnect();
	}

	function select(next: T) {
		value = next;
		onchange?.(next);
	}

	function onkeydown(event: KeyboardEvent) {
		const i = options.findIndex((o) => o.value === value);
		const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		const next = options[(i + step + options.length) % options.length];
		select(next.value);
		buttonFor(event.currentTarget as HTMLElement, next.value)?.focus();
	}
</script>

<div
	{@attach trackIndicator}
	role="radiogroup"
	aria-label={label}
	tabindex="-1"
	{onkeydown}
	class={cn(
		'relative inline-flex flex-none rounded-full bg-secondary p-[3px]',
		stretch && 'flex w-full',
		className
	)}
>
	<span
		class="absolute top-[3px] bottom-[3px] left-0 rounded-full bg-card shadow-[0_1px_3px_rgb(24_23_29/0.12)] transition-[transform,width,opacity] duration-[380ms] ease-spring"
		style:width="{indicator.w}px"
		style:transform="translateX({indicator.x}px)"
		style:opacity={indicator.w ? 1 : 0}
		aria-hidden="true"
	></span>
	{#each options as option (option.value)}
		<button
			type="button"
			role="radio"
			aria-checked={option.value === value}
			tabindex={option.value === value ? 0 : -1}
			data-value={option.value}
			onclick={() => select(option.value)}
			class={cn(
				'relative z-10 min-h-11 rounded-full px-3.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 pointer-fine:min-h-9',
				stretch && 'flex-1',
				option.value === value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
			)}
		>
			{option.label}
		</button>
	{/each}
</div>
