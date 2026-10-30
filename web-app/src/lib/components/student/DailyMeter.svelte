<script lang="ts">
	// Bar for the daily question limit. The green part is what is left today; with `using`,
	// the share a new exam would take shows lighter at the end, or red when it does not fit.
	import { cn } from '#lib/utils.js';

	interface Props {
		left: number;
		limit: number;
		/** Questions the exam being set up would use */
		using?: number;
		class?: string;
	}

	let { left, limit, using = 0, class: className }: Props = $props();

	const over = $derived(using > left);
	const keep = $derived(over ? 0 : left - using);
	const share = (n: number) => `${(Math.max(n, 0) / limit) * 100}%`;
</script>

<div
	class={cn('flex h-2 overflow-hidden rounded-full bg-secondary', className)}
	role="meter"
	aria-valuemin={0}
	aria-valuemax={limit}
	aria-valuenow={left}
	aria-label="Questions left today"
>
	<span
		class="h-full origin-left animate-grow-x bg-brand transition-[width] duration-150 ease-standard"
		style:width={share(keep)}
	></span>
	{#if using > 0}
		<span
			class={cn(
				'h-full transition-[width,background-color] duration-150 ease-standard',
				over ? 'bg-danger' : 'bg-brand-glow'
			)}
			style:width={share(over ? left : using)}
		></span>
	{/if}
</div>
