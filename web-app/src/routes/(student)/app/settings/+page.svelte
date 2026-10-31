<script lang="ts">
	// S8 Settings and D4 Delete account. Settings write straight to the prototype state, so New exam
	// (S2) picks up the default count and timer. Delete goes to the landing page.
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Trash from '@lucide/svelte/icons/trash-2';
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import Segmented from '#lib/components/common/Segmented.svelte';
	import Modal from '#lib/components/common/Modal.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import { Switch } from '#lib/components/ui/switch/index.js';
	import Panel from '#lib/components/student/Panel.svelte';
	import { pill } from '#lib/components/student/styles.js';
	import { QUESTION_COUNTS, exams, student } from '#lib/data/mock.js';
	import { prototype } from '#lib/state/prototype.svelte.js';
	import { cn } from '#lib/utils.js';

	const CONFIRM_WORD = 'DELETE';
	const examCount = exams.length;

	let deleteOpen = $state(false);
	let confirmText = $state('');
	const confirmed = $derived(confirmText.trim() === CONFIRM_WORD);

	function askToDelete() {
		confirmText = '';
		deleteOpen = true;
	}

	function deleteAccount() {
		deleteOpen = false;
		goto(resolve(''));
	}
</script>

<svelte:head>
	<title>Settings · Oplan Aral</title>
</svelte:head>

<PageHeader title="Settings" description="Changes save as soon as you make them." />

<div class="grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-12">
	<!-- Exam defaults -->
	<Panel title="Exam defaults" i={1} class="md:col-span-2 lg:col-span-7">
		<Field.Group class="gap-6">
			<Field.Set>
				<Field.Legend variant="label">Questions per subject</Field.Legend>
				<Field.Description>
					New exams start with this many. You can still change it for each exam.
				</Field.Description>
				<Segmented
					label="Default questions per subject"
					bind:value={() => prototype.defaultCount, (v) => (prototype.defaultCount = v)}
					stretch
					class="max-w-md"
					options={QUESTION_COUNTS.map((n) => ({ value: n, label: String(n) }))}
				/>
			</Field.Set>
			<Field.Separator />
			<Field.Field orientation="horizontal">
				<Field.Content>
					<Field.Label for="timer-default">Timer on by default</Field.Label>
					<Field.Description>
						New exams start timed. You can turn the timer off when you set up an exam or during it.
					</Field.Description>
				</Field.Content>
				<Switch
					id="timer-default"
					bind:checked={() => prototype.timerOnByDefault, (v) => (prototype.timerOnByDefault = v)}
				/>
			</Field.Field>
		</Field.Group>
	</Panel>

	<!-- Appearance -->
	<Panel title="Appearance" i={2} class="lg:col-span-5">
		<Field.Set>
			<Field.Legend variant="label">Theme</Field.Legend>
			<Field.Description>Dark is easier on the eyes at night.</Field.Description>
			<Segmented
				label="Theme"
				bind:value={() => prototype.theme, (v) => prototype.setTheme(v)}
				stretch
				class="max-w-xs"
				options={[
					{ value: 'light', label: 'Light' },
					{ value: 'dark', label: 'Dark' }
				]}
			/>
		</Field.Set>
	</Panel>

	<!-- Account -->
	<Panel title="Account" i={3} class="lg:col-span-7">
		<Field.Field>
			<Field.Label for="email">Email</Field.Label>
			<Input id="email" type="email" value={student.email} readonly class="h-11 bg-muted" />
			<Field.Description>You log in with this email.</Field.Description>
		</Field.Field>
	</Panel>

	<!-- Delete account -->
	<Panel title="Delete account" i={4} class="md:col-span-2 lg:col-span-5">
		<p class="text-sm leading-relaxed text-muted-foreground">
			This removes your account, your {examCount} exams and every score. It can't be undone.
		</p>
		<Button variant="destructive" class={cn(pill, 'mt-4 self-start')} onclick={askToDelete}>
			<Trash data-icon="inline-start" />
			Delete account
		</Button>
	</Panel>
</div>

<!-- D4: centred from 640px; on phones it slides up from the bottom. -->
<Modal
	bind:open={deleteOpen}
	title="Delete your account?"
	description="Your account, all {examCount} exams and every score will be deleted for good. You can't undo this."
>
	<Field.Field>
		<Field.Label for="confirm-delete">Type {CONFIRM_WORD} to confirm</Field.Label>
		<Input
			id="confirm-delete"
			bind:value={confirmText}
			autocomplete="off"
			autocapitalize="characters"
			spellcheck={false}
			class="h-11"
		/>
	</Field.Field>
	{#snippet actions()}
		<Button variant="outline" class={pill} onclick={() => (deleteOpen = false)}>Cancel</Button>
		<Button variant="destructive" class={pill} disabled={!confirmed} onclick={deleteAccount}>
			Delete account
		</Button>
	{/snippet}
</Modal>
