<script lang="ts">
	// The brand's 8-petal Bloom, as a real clay-render cut-out (design/assets/generate.py makes it), so
	// it matches the rest of the art. The build turns it into small AVIF/WebP files.
	import green from '#lib/assets/art/bloom.png?enhanced';
	import chalk from '#lib/assets/art/bloom-chalk.png?enhanced';

	type Hue = 'green' | 'chalk';

	interface Props {
		size?: number;
		hue?: Hue;
		/** Slow spin. Only runs on screens 768px and wider, and never with reduced motion. */
		spin?: boolean;
		class?: string;
	}

	let { size = 120, hue = 'green', spin = false, class: className = '' }: Props = $props();
</script>

<div
	class="bloom {className}"
	class:spin
	style:width="{size}px"
	style:height="{size}px"
	aria-hidden="true"
>
	<enhanced:img
		src={hue === 'chalk' ? chalk : green}
		sizes="{size}px"
		alt=""
		fetchpriority="low"
		class="size-full object-contain"
	/>
</div>

<style>
	.bloom {
		flex: none;
		pointer-events: none;
		filter: drop-shadow(0 14px 18px rgb(20 70 50 / 0.18));
	}
	@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
		.bloom.spin {
			animation: bloom-spin 50s linear infinite;
		}
	}
	@keyframes bloom-spin {
		to {
			rotate: 360deg;
		}
	}
</style>
