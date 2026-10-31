<script lang="ts">
	// A3 Ready pool: generated questions with their check outcome; rows open A4.
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import QuestionList from '#lib/components/admin/QuestionList.svelte';
</script>

<svelte:head><title>Ready pool · Oplan Aral admin</title></svelte:head>

<PageHeader
	title="Ready pool"
	description="Questions written by LLM 1 and answered blind by LLM 2. New items are fresh questions; variants keep a question and change its values."
/>

<QuestionList source="pool" />
