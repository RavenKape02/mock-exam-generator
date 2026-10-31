<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Check from '@lucide/svelte/icons/check';
	import MailCheck from '@lucide/svelte/icons/mail-check';
	import AuthHeading from '#lib/components/auth/AuthHeading.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';

	let email = $state('');
	let sent = $state(false);
	let resent = $state(false);

	const shownEmail = $derived(email.trim());

	// Prototype: no email is sent. The screen just switches to its "check your email" state.
	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		resent = false;
		sent = true;
	}
</script>

<svelte:head>
	<title>Reset your password · Oplan Aral</title>
	<meta
		name="description"
		content="Forgot your Oplan Aral password? Enter your email and we'll send you a reset code."
	/>
</svelte:head>

{#if !sent}
	<div class="flex flex-col gap-7">
		<AuthHeading title="Reset your password">
			Enter the email you signed up with. We'll send you a code to set a new password.
		</AuthHeading>

		<form {onsubmit} novalidate>
			<Field.Group>
				<Field.Field>
					<Field.Label for="email">Email</Field.Label>
					<Input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						inputmode="email"
						autocapitalize="none"
						spellcheck={false}
						placeholder="you@example.com"
						bind:value={email}
						class="h-11 rounded-xl px-3.5 md:text-base"
					/>
				</Field.Field>
				<Button type="submit" class="h-11 w-full rounded-full text-[0.9375rem]">
					Send reset code
				</Button>
			</Field.Group>
		</form>

		<Button href={resolve('login')} variant="ghost" class="-ml-2.5 h-11 w-fit rounded-full px-3">
			<ArrowLeft data-icon="inline-start" />
			Back to log in
		</Button>
	</div>
{:else}
	<div class="reveal flex flex-col gap-7">
		<AuthHeading title="Check your email">
			{#snippet icon()}<MailCheck class="size-6" />{/snippet}
			{#if shownEmail}
				If an account uses <strong class="font-medium break-all text-foreground"
					>{shownEmail}</strong
				>, we sent it a code to reset your password.
			{:else}
				If an account uses that email, we sent it a code to reset your password.
			{/if}
			Check your spam folder too.
		</AuthHeading>

		<div class="flex flex-col gap-2">
			<Button href={resolve('login')} class="h-11 w-full rounded-full text-[0.9375rem]">
				Back to log in
			</Button>
			<Button
				variant="ghost"
				class="h-11 w-full rounded-full text-[0.9375rem]"
				onclick={() => (sent = false)}
			>
				Use a different email
			</Button>
		</div>

		<div
			class="flex min-h-11 flex-wrap items-center justify-center gap-x-1 text-sm text-muted-foreground"
		>
			{#if resent}
				<span class="inline-flex items-center gap-1.5 text-success" role="status">
					<Check class="size-4" aria-hidden="true" />
					Code sent again.
				</span>
			{:else}
				Didn't get it?
				<button
					type="button"
					class="inline-flex min-h-11 items-center rounded-md px-1 font-medium text-foreground underline decoration-brand/50 underline-offset-4 hover:decoration-brand"
					onclick={() => (resent = true)}
				>
					Send again
				</button>
			{/if}
		</div>
	</div>
{/if}
