<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		/** One or two short sentences under the title */
		children?: Snippet;
		/** Optional mark above the title (e.g. a mail icon on the check-your-email states) */
		icon?: Snippet;
	}

	let { title, children, icon }: Props = $props();
</script>

<div class="flex flex-col gap-2">
	{#if icon}
		<div
			class="mb-2 grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand-strong"
			aria-hidden="true"
		>
			{@render icon()}
		</div>
	{/if}
	<h1 class="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] text-balance">
		{title}
	</h1>
	{#if children}
		<p class="text-[0.9375rem] leading-relaxed text-pretty text-muted-foreground">
			{@render children()}
		</p>
	{/if}
</div>
