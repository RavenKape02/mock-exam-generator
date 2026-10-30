<script lang="ts">
	import Eye from '@lucide/svelte/icons/eye';
	import EyeOff from '@lucide/svelte/icons/eye-off';
	import { Input } from '#lib/components/ui/input/index.js';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'value' | 'files'> {
		id: string;
		value?: string;
		autocomplete: 'current-password' | 'new-password';
	}

	let { id, value = $bindable(''), autocomplete, ...rest }: Props = $props();

	let visible = $state(false);
</script>

<div class="relative">
	<Input
		{id}
		name="password"
		type={visible ? 'text' : 'password'}
		{autocomplete}
		autocapitalize="none"
		spellcheck={false}
		bind:value
		class="h-11 rounded-xl pr-12 pl-3.5 md:text-base"
		{...rest}
	/>
	<button
		type="button"
		class="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-xl text-muted-foreground transition-colors duration-150 hover:text-foreground"
		aria-controls={id}
		aria-label={visible ? 'Hide password' : 'Show password'}
		onclick={() => (visible = !visible)}
	>
		{#if visible}
			<EyeOff class="size-[1.125rem]" aria-hidden="true" />
		{:else}
			<Eye class="size-[1.125rem]" aria-hidden="true" />
		{/if}
	</button>
</div>
