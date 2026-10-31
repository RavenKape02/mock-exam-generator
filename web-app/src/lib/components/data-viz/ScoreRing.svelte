<script lang="ts">
	// Ring that fills to `value / max` when it appears (CSS @starting-style, no JS).
	import type { Snippet } from 'svelte';

	interface Props {
		value: number;
		max: number;
		size?: number;
		stroke?: number;
		/** CSS colour for the filled arc; defaults to the brand gradient */
		color?: string;
		/** Content in the middle of the ring */
		children?: Snippet;
		label: string;
	}

	let { value, max, size = 150, stroke = 12, color, children, label }: Props = $props();

	const r = $derived((size - stroke) / 2);
	const circumference = $derived(2 * Math.PI * r);
	const fraction = $derived(max ? Math.min(Math.max(value / max, 0), 1) : 0);
	const gradientId = $props.id();
</script>

<div
	class="relative flex-none"
	style:width="{size}px"
	style:height="{size}px"
	role="img"
	aria-label={label}
>
	<svg width={size} height={size} viewBox="0 0 {size} {size}" class="-rotate-90">
		{#if !color}
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stop-color="var(--brand-glow)" />
					<stop offset="100%" stop-color="var(--brand)" />
				</linearGradient>
			</defs>
		{/if}
		<circle
			cx={size / 2}
			cy={size / 2}
			{r}
			fill="none"
			stroke="var(--secondary)"
			stroke-width={stroke}
		/>
		<circle
			class="ring-value"
			cx={size / 2}
			cy={size / 2}
			{r}
			fill="none"
			stroke={color ?? `url(#${gradientId})`}
			stroke-width={stroke}
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={circumference * (1 - fraction)}
			style:--empty={circumference}
		/>
	</svg>
	{#if children}
		<div class="absolute inset-0 grid place-content-center text-center">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.ring-value {
		transition: stroke-dashoffset 900ms var(--ease-enter) 120ms;
	}
	@starting-style {
		.ring-value {
			stroke-dashoffset: var(--empty);
		}
	}
</style>
