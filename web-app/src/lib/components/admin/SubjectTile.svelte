<script lang="ts">
	// Rounded icon tile tinted with the subject's colour (the reference's file-type tiles).
	import { SUBJECTS } from '#lib/data/mock.js';
	import type { SubjectSlug } from '#lib/types.js';
	import { cn } from '#lib/utils.js';
	import { SUBJECT_ICONS } from './format.js';

	interface Props {
		subject: SubjectSlug;
		class?: string;
	}

	let { subject, class: className }: Props = $props();

	const Icon = $derived(SUBJECT_ICONS[subject]);
	const color = $derived(SUBJECTS[subject].color);
</script>

<span
	class={cn('grid size-9 flex-none place-items-center rounded-[11px]', className)}
	style:background="color-mix(in oklch, {color} 14%, transparent)"
	style:color
	aria-hidden="true"
>
	<Icon class="size-4" strokeWidth={1.9} />
</span>
