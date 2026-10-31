<script lang="ts">
	// A2 Question bank: hand-checked questions, filterable; rows open A4.
	import PageHeader from '#lib/components/common/PageHeader.svelte';
	import QuestionList from '#lib/components/admin/QuestionList.svelte';
</script>

<svelte:head><title>Question bank · Oplan Aral admin</title></svelte:head>

<PageHeader
	title="Question bank"
	description="Hand-checked questions. When LLM 2 disagrees with a generated question, a bank question on the same topic takes its place."
/>

<QuestionList source="bank" />
