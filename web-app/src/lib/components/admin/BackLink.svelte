<script lang="ts">
	// "← Back to …" link above a page title. Pass an href made with resolve().
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import { Button } from '#lib/components/ui/button/index.js';

	interface Props {
		href: string;
		label: string;
	}

	let { href, label }: Props = $props();
</script>

<Button
	variant="ghost"
	{href}
	class="-ml-2 h-11 rounded-full px-2 font-normal text-muted-foreground hover:bg-transparent hover:text-foreground has-data-[icon=inline-start]:pl-1.5"
>
	<ChevronLeft data-icon="inline-start" />
	{label}
</Button>
