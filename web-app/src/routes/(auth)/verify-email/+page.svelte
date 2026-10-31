<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Check from '@lucide/svelte/icons/check';
	import MailCheck from '@lucide/svelte/icons/mail-check';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import AuthHeading from '#lib/components/auth/AuthHeading.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import * as InputOTP from '#lib/components/ui/input-otp/index.js';

	let code = $state('');
	let resent = $state(false);

	// Prototype: any code works.
	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		goto(resolve('app'));
	}
</script>

<svelte:head>
	<title>Verify your email · Oplan Aral</title>
	<meta name="description" content="Enter the 6-digit code we sent to your email." />
</svelte:head>

<div class="flex flex-col gap-7">
	<AuthHeading title="Check your email">
		{#snippet icon()}<MailCheck class="size-6" />{/snippet}
		We sent a 6-digit code to the email you signed up with. It may take a minute to arrive.
	</AuthHeading>

	<form {onsubmit} novalidate>
		<Field.Group>
			<Field.Field>
				<Field.Label for="code">6-digit code</Field.Label>
				<InputOTP.Root maxlength={6} inputId="code" pattern={REGEXP_ONLY_DIGITS} bind:value={code}>
					{#snippet children({ cells })}
						<InputOTP.Group class="w-full">
							{#each cells as cell, i (i)}
								<InputOTP.Slot
									{cell}
									class="h-13 min-w-0 flex-1 bg-card text-xl font-medium tabular-nums first:rounded-l-xl last:rounded-r-xl"
								/>
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
			</Field.Field>

			<Button type="submit" class="h-11 w-full rounded-full text-[0.9375rem]">Verify email</Button>

			<div
				class="flex min-h-11 flex-wrap items-center justify-center gap-x-1 text-sm text-muted-foreground"
			>
				{#if resent}
					<span class="inline-flex items-center gap-1.5 text-success" role="status">
						<Check class="size-4" aria-hidden="true" />
						Code sent. Check your inbox and spam folder.
					</span>
				{:else}
					Didn't get a code?
					<button
						type="button"
						class="inline-flex min-h-11 items-center rounded-md px-1 font-medium text-foreground underline decoration-brand/50 underline-offset-4 hover:decoration-brand"
						onclick={() => (resent = true)}
					>
						Resend code
					</button>
				{/if}
			</div>
		</Field.Group>
	</form>

	<Button href={resolve('signup')} variant="ghost" class="-ml-2.5 h-11 w-fit rounded-full px-3">
		<ArrowLeft data-icon="inline-start" />
		Back to sign up
	</Button>
</div>
