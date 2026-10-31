<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import AuthHeading from '#lib/components/auth/AuthHeading.svelte';
	import GoogleButton from '#lib/components/auth/GoogleButton.svelte';
	import OrDivider from '#lib/components/auth/OrDivider.svelte';
	import PasswordInput from '#lib/components/auth/PasswordInput.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';

	// Prototype: no real log-in. Submitting goes straight to the dashboard.
	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		goto(resolve('app'));
	}
</script>

<svelte:head>
	<title>Log in · Oplan Aral</title>
	<meta
		name="description"
		content="Log in to Oplan Aral to take free UPCAT mock exams and see your weak topics."
	/>
</svelte:head>

<div class="flex flex-col gap-7">
	<AuthHeading title="Log in">Welcome back. Pick up where you left off.</AuthHeading>

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
					<div class="flex items-center justify-between gap-3">
						<Field.Label for="password">Password</Field.Label>
						<a
							href={resolve('forgot-password')}
							class="-my-2 rounded-md py-2 text-sm font-medium text-brand-strong underline-offset-4 hover:underline"
						>
							Forgot password?
						</a>
					</div>
					<PasswordInput id="password" autocomplete="current-password" />
				</Field.Field>
				<Button type="submit" class="mt-1 h-11 w-full rounded-full text-[0.9375rem]">Log in</Button>
			</Field.Group>
		</form>
	</div>

	<p class="text-center text-sm text-muted-foreground">
		No account yet?
		<a
			href={resolve('signup')}
			class="font-medium text-foreground underline decoration-brand/50 underline-offset-4 hover:decoration-brand"
		>
			Sign up free
		</a>
	</p>

	<p class="text-center text-xs text-muted-foreground">
		<a
			href={resolve('admin')}
			class="inline-flex min-h-11 items-center rounded-md px-2 underline underline-offset-4 hover:text-foreground"
		>
			Prototype shortcut: view the admin screens
		</a>
	</p>
</div>
