<script lang="ts">
	import AppShell from '#lib/components/shell/AppShell.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<AppShell variant="admin">
	{@render children()}
</AppShell>
