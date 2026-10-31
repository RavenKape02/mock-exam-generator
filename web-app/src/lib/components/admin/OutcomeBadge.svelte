<script lang="ts">
	// Whether LLM 2 agreed with LLM 1's key, or the item was replaced by a bank question.
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { cn } from '#lib/utils.js';

	interface Props {
		outcome: 'agreed' | 'replaced';
		/** Longer wording for detail pages */
		long?: boolean;
		class?: string;
	}

	let { outcome, long = false, class: className }: Props = $props();
</script>

<Badge
	variant="secondary"
	class={cn(
		outcome === 'agreed' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning',
		className
	)}
>
	{#if outcome === 'agreed'}
		Agreed
	{:else}
		{long ? 'Replaced by a bank question' : 'Replaced'}
	{/if}
</Badge>
