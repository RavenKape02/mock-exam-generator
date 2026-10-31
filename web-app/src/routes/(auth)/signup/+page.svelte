<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AuthHeading from '#lib/components/auth/AuthHeading.svelte';
	import GoogleButton from '#lib/components/auth/GoogleButton.svelte';
	import OrDivider from '#lib/components/auth/OrDivider.svelte';
	import PasswordInput from '#lib/components/auth/PasswordInput.svelte';
	import TurnstilePlaceholder from '#lib/components/auth/TurnstilePlaceholder.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { cn } from '#lib/utils.js';

	let password = $state('');

	// A simple hint, not a rule: 1 = too short, 2 = okay, 3 = strong.
	const strength = $derived.by(() => {
		if (password.length === 0) return 0;
		if (password.length < 8) return 1;
		const mixed = /[a-z]/i.test(password) && /\d/.test(password);
		const extra = /[^a-z\d]/i.test(password) || password.length >= 12;
		return mixed && extra ? 3 : 2;
	});

	const hints = [
		{ word: '', text: 'Use at least 8 characters.', tone: '' },
		{ word: 'Too short.', text: 'Use at least 8 characters.', tone: 'text-danger' },
		{ word: 'Okay.', text: 'Add a number or a symbol to make it stronger.', tone: 'text-warning' },
		{ word: 'Strong.', text: 'Good password.', tone: 'text-success' }
	];
	const barTone = ['', 'bg-danger', 'bg-warning', 'bg-success'];

	const hint = $derived(hints[strength]);

	// Prototype: no real account is made. Next step is the email code.
	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		goto(resolve('verify-email'));
	}
</script>

<svelte:head>
	<title>Sign up · Oplan Aral</title>
	<meta
		name="description"
		content="Create a free Oplan Aral account to take UPCAT mock exams. We only ask for your email and a password."
	/>
</svelte:head>

<div class="flex flex-col gap-7">
	<AuthHeading title="Create your free account">
		Only your email and a password. Nothing else.
	</AuthHeading>

	<div class="flex flex-col gap-5">
		<GoogleButton />
		<OrDivider />

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
						class="h-11 rounded-xl px-3.5 md:text-base"
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="password">Password</Field.Label>
					<PasswordInput
						id="password"
						autocomplete="new-password"
						aria-describedby="password-hint"
						bind:value={password}
					/>
					<div class="grid grid-cols-3 gap-1.5" aria-hidden="true">
						{#each [1, 2, 3] as step (step)}
							<span
								class={cn(
									'h-1 rounded-full bg-muted transition-colors duration-150',
									strength >= step && barTone[strength]
								)}
							></span>
						{/each}
					</div>
					<Field.Description id="password-hint" aria-live="polite">
						{#if hint.word}<span class={cn('font-medium', hint.tone)}>{hint.word}</span>{/if}
						{hint.text}
					</Field.Description>
				</Field.Field>

				<TurnstilePlaceholder />

				<Button type="submit" class="h-11 w-full rounded-full text-[0.9375rem]">
					Create account
				</Button>
				<p class="text-xs leading-relaxed text-pretty text-muted-foreground">
					We only collect your email and password, nothing else. Many of our students are under 18,
					so we keep it that way, following the Data Privacy Act of 2012.
				</p>
			</Field.Group>
		</form>
	</div>

	<p class="text-center text-sm text-muted-foreground">
		Have an account?
		<a
			href={resolve('login')}
			class="font-medium text-foreground underline decoration-brand/50 underline-offset-4 hover:decoration-brand"
		>
			Log in
		</a>
	</p>
</div>
