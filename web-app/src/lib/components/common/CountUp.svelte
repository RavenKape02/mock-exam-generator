<script lang="ts">
	// Whole number that counts up from 0 with CSS only (see .count in app.css).
	// Screen readers get the final value; the animated digits are hidden from them.
	interface Props {
		value: number;
		suffix?: string;
		class?: string;
	}

	let { value, suffix = '', class: className = '' }: Props = $props();
</script>

<span class={className}
	><span class="count" style:--num={Math.round(value)} aria-hidden="true"></span><span
		aria-hidden="true">{suffix}</span
	><span class="sr-only">{Math.round(value)}{suffix}</span></span
>
