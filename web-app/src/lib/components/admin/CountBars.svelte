<script lang="ts">
	// Subject rows with an icon tile, a count and a bar scaled to the largest count
	// (the reference's storage categories).
	import { SUBJECTS } from '#lib/data/mock.js';
	import type { SubjectSlug } from '#lib/types.js';
	import SubjectTile from './SubjectTile.svelte';
	import { formatNumber } from './format.js';

	interface Row {
		subject: SubjectSlug;
		value: number;
	}

	interface Props {
		rows: Row[];
		/** Word after the number, e.g. "questions" */
		unit: string;
	}

	let { rows, unit }: Props = $props();

	const max = $derived(Math.max(1, ...rows.map((r) => r.value)));
</script>

<ul class="flex flex-col gap-3.5">
	{#each rows as row, i (row.subject)}
		<li class="flex items-center gap-3">
			<SubjectTile subject={row.subject} />
			<div class="min-w-0 flex-1">
				<div class="flex items-baseline justify-between gap-3 text-sm">
					<span class="truncate">{SUBJECTS[row.subject].name}</span>
					<span class="flex-none text-muted-foreground tabular">
						<span class="font-medium text-foreground">{formatNumber(row.value)}</span>
						{unit}
					</span>
				</div>
				<div class="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
					<span
						class="block h-full origin-left animate-grow-x rounded-full"
						style:width="{(row.value / max) * 100}%"
						style:background={SUBJECTS[row.subject].color}
						style:animation-delay="{150 + i * 60}ms"
					></span>
				</div>
			</div>
		</li>
	{/each}
</ul>
