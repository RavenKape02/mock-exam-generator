<script lang="ts">
	import { cn } from '#lib/utils.js';

	interface Props {
		/** Show the "Oplan Aral" wordmark next to the mark */
		wordmark?: boolean;
		size?: number;
		class?: string;
	}

	let { wordmark = false, size = 36, class: className }: Props = $props();
	const uid = $props.id();
	const gradientId = `oplan-mark-${uid}`;
</script>

<!-- The mark is a row of answer-sheet bubbles, the middle one shaded. -->
<span class={cn('inline-flex items-center gap-2.5', className)}>
	<svg
		width={size}
		height={size}
		viewBox="0 0 40 40"
		aria-hidden={wordmark ? 'true' : undefined}
		role={wordmark ? undefined : 'img'}
		aria-label={wordmark ? undefined : 'Oplan Aral'}
		class="shrink-0"
	>
		<defs>
			<linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="#3fae7b" />
				<stop offset="1" stop-color="#16352b" />
			</linearGradient>
		</defs>
		<rect width="40" height="40" rx="13" fill="url(#{gradientId})" />
		<circle cx="11" cy="20" r="4.2" fill="none" stroke="#fff" stroke-width="2" opacity="0.85" />
		<circle cx="20" cy="20" r="5.2" fill="#fff" />
		<circle cx="29" cy="20" r="4.2" fill="none" stroke="#fff" stroke-width="2" opacity="0.85" />
	</svg>
	{#if wordmark}
		<span class="text-[1.05rem] font-semibold tracking-[-0.02em] text-foreground">Oplan Aral</span>
	{/if}
</span>
