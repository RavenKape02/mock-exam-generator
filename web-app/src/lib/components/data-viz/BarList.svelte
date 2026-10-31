<script lang="ts">
	// Rows of label + bar + percent. Bars grow one after another on load.
	import { cn } from '#lib/utils.js';

	interface Row {
		label: string;
		/** 0–100 */
		percent: number;
		/** e.g. "5 of 12" */
		detail?: string;
		color?: string;
		/** Mark as a weak topic */
		weak?: boolean;
	}

	interface Props {
		rows: Row[];
		/** When the first bar starts growing, in ms */
		delay?: number;
		/** Gap between one bar and the next, in ms */
		step?: number;
		class?: string;
	}

	let { rows, delay = 120, step = 50, class: className }: Props = $props();
</script>

<ul class={cn('flex flex-col gap-3.5', className)}>
	{#each rows as row, i (row.label)}
		<li class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5">
			<span class="flex min-w-0 items-center gap-2 text-sm">
				<span class="truncate">{row.label}</span>
				{#if row.weak}
					<span class="rounded-full bg-warning-soft px-2 py-0.5 text-xs font-medium text-warning"
						>Weak</span
					>
				{/if}
			</span>
			<span class="text-sm font-medium tabular">
				{row.percent}%{#if row.detail}<span class="ml-1.5 font-normal text-muted-foreground"
						>{row.detail}</span
					>{/if}
			</span>
			<span class="col-span-2 h-1.5 overflow-hidden rounded-full bg-secondary">
				<span
					class="block h-full origin-left animate-grow-x rounded-full"
					style:width="{row.percent}%"
					style:background={row.color ?? 'var(--brand)'}
					style:animation-delay="{delay + Math.min(i, 8) * step}ms"
				></span>
			</span>
		</li>
	{/each}
</ul>
