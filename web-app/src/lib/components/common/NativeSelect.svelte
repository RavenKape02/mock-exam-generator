<script lang="ts" generics="T extends string">
	// A styled native <select>: no JavaScript library, and phones show their own picker.
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { cn } from '#lib/utils.js';

	interface Option {
		value: T;
		label: string;
	}

	interface Props {
		/** Shown in front of the value, e.g. "Subject" */
		label: string;
		options: Option[];
		value: T;
		onchange?: (value: T) => void;
		disabled?: boolean;
		title?: string;
		/** 'pill' for filter rows, 'field' for forms (the label then lives outside) */
		variant?: 'pill' | 'field';
		id?: string;
		class?: string;
	}

	let {
		label,
		options,
		value = $bindable(),
		onchange,
		disabled = false,
		title,
		variant = 'pill',
		id,
		class: className
	}: Props = $props();
</script>

<label
	{title}
	class={cn(
		'relative flex h-11 min-w-0 items-center gap-1.5 border border-input bg-transparent pr-9 pl-3.5 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
		variant === 'pill' ? 'rounded-full' : 'rounded-lg',
		disabled && 'opacity-50',
		className
	)}
>
	{#if variant === 'pill'}
		<span class="flex-none text-sm text-muted-foreground">{label}</span>
	{/if}
	<select
		{id}
		{disabled}
		bind:value
		onchange={() => onchange?.(value)}
		aria-label={variant === 'pill' ? label : undefined}
		class="absolute inset-0 cursor-pointer appearance-none rounded-[inherit] text-base opacity-0 disabled:cursor-not-allowed"
	>
		{#each options as option (option.value)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
	<span class="truncate text-base font-medium md:text-sm" aria-hidden="true">
		{options.find((o) => o.value === value)?.label ?? ''}
	</span>
	<ChevronDown
		class="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
		aria-hidden="true"
	/>
</label>
