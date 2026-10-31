<script lang="ts">
	// Hand-made SVG line chart (no chart library). Each series is one line; points can link somewhere.
	interface Point {
		/** Short x label, e.g. "Oct 12" */
		label: string;
		/** 0–100 */
		value: number;
		href?: string;
	}

	interface Series {
		name: string;
		color: string;
		points: Point[];
	}

	interface Props {
		series: Series[];
		height?: number;
		label: string;
		/** Always hide every other x label (it also happens on its own below 420px) */
		sparseLabels?: boolean;
	}

	let { series, height = 200, label, sparseLabels = false }: Props = $props();

	// The chart's units are real pixels (its measured width), so text, dots and tap areas keep their
	// size on every screen instead of shrinking with the chart.
	let width = $state(600);
	const W = $derived(Math.max(width, 240));
	const PAD = { top: 12, right: 12, bottom: 28, left: 34 };
	// Points sit a little inside the plot so the first date clears the y-axis numbers.
	const INSET = 20;
	const ticks = [0, 25, 50, 75, 100];

	const count = $derived(Math.max(...series.map((s) => s.points.length), 1));
	const xs = (i: number) =>
		PAD.left +
		INSET +
		(count === 1 ? 0 : (i / (count - 1)) * (W - PAD.left - PAD.right - 2 * INSET));
	// Show every date unless neighbouring labels would sit closer than 52px.
	const sparse = $derived(
		sparseLabels || (count > 1 && (W - PAD.left - PAD.right - 2 * INSET) / (count - 1) < 52)
	);
	const ys = (v: number) => PAD.top + (1 - v / 100) * (height - PAD.top - PAD.bottom);
	const labels = $derived(series[0]?.points.map((p) => p.label) ?? []);
</script>

<figure class="w-full" bind:clientWidth={width}>
	<svg
		viewBox="0 0 {W} {height}"
		width="100%"
		{height}
		class="block overflow-visible"
		role="img"
		aria-label={label}
	>
		{#each ticks as t (t)}
			<line
				x1={PAD.left}
				x2={W - PAD.right}
				y1={ys(t)}
				y2={ys(t)}
				stroke="var(--border)"
				stroke-width="1"
			/>
			<text
				x={PAD.left - 8}
				y={ys(t)}
				dy="0.32em"
				text-anchor="end"
				class="fill-muted-foreground text-xs tabular">{t}</text
			>
		{/each}
		{#each labels as l, i (i)}
			{#if !sparse || i % 2 === 0 || i === labels.length - 1}
				<text x={xs(i)} y={height - 8} text-anchor="middle" class="fill-muted-foreground text-xs"
					>{l}</text
				>
			{/if}
		{/each}
		{#each series as s (s.name)}
			<polyline
				points={s.points.map((p, i) => `${xs(i)},${ys(p.value)}`).join(' ')}
				fill="none"
				stroke={s.color}
				stroke-width="2.5"
				stroke-linejoin="round"
				stroke-linecap="round"
				vector-effect="non-scaling-stroke"
			/>
			{#each s.points as p, i (i)}
				{#if p.href}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- callers pass resolved hrefs -->
					<a href={p.href} aria-label="{s.name}, {p.label}: {p.value}%">
						<circle cx={xs(i)} cy={ys(p.value)} r="14" fill="transparent" />
						<circle
							cx={xs(i)}
							cy={ys(p.value)}
							r="4"
							fill="var(--card)"
							stroke={s.color}
							stroke-width="2.5"
						/>
					</a>
				{:else}
					<circle
						cx={xs(i)}
						cy={ys(p.value)}
						r="4"
						fill="var(--card)"
						stroke={s.color}
						stroke-width="2.5"
					/>
				{/if}
			{/each}
		{/each}
	</svg>
	{#if series.length > 1}
		<figcaption class="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
			{#each series as s (s.name)}
				<span class="inline-flex items-center gap-1.5">
					<span class="size-2 rounded-full" style:background={s.color}></span>{s.name}
				</span>
			{/each}
		</figcaption>
	{/if}
</figure>
