<script lang="ts">
	import ShieldCheck from '@lucide/svelte/icons/shield-check';
</script>

<!--
	Stand-in for Cloudflare Turnstile. The real widget (about 300 × 65) mounts here later;
	the prototype loads no script. Dashed border so nobody mistakes it for the real check.
-->
<div
	class="flex h-[65px] w-full max-w-[300px] items-center gap-3 rounded-lg border border-dashed border-input bg-muted px-3.5"
	role="note"
	aria-label="Bot check placeholder. The real Cloudflare Turnstile check goes here."
>
	<span class="grid size-7 place-items-center rounded-md border border-input bg-card text-success">
		<ShieldCheck class="size-4" aria-hidden="true" />
	</span>
	<span class="flex min-w-0 flex-1 flex-col leading-tight">
		<span class="text-sm font-medium">Bot check</span>
		<span class="truncate text-xs text-muted-foreground">Cloudflare Turnstile · placeholder</span>
	</span>
</div>
