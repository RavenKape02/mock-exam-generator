<script lang="ts">
	// The signature move: the exam's shaded answer sheet. One oval per question, grouped by
	// subject. Taking the exam it shades as you answer; in review it shows right and wrong.
	import Flag from '@lucide/svelte/icons/flag';
	import { cn } from '#lib/utils.js';
	import type { BubbleStatus, ExamItem, ExamSection } from './exam.js';

	interface Props {
		sections: ExamSection[];
		/** Index of the question on screen */
		current: number;
		status: (item: ExamItem) => BubbleStatus;
		flagged?: (item: ExamItem) => boolean;
		onjump: (index: number) => void;
		mode?: 'exam' | 'review';
		class?: string;
	}

	let {
		sections,
		current,
		status,
		flagged = () => false,
		onjump,
		mode = 'exam',
		class: className
	}: Props = $props();

	const STATUS_WORDS: Record<BubbleStatus, string> = {
		blank: 'not answered',
		answered: 'answered',
		correct: 'correct',
		wrong: 'wrong'
	};

	function label(item: ExamItem, section: ExamSection, s: BubbleStatus) {
		const parts = [`${section.short} question ${item.n}`, STATUS_WORDS[s]];
		if (flagged(item)) parts.push('flagged');
		return parts.join(', ');
	}
</script>

<nav aria-label="Answer sheet" class={cn('flex flex-col gap-4', className)}>
	{#each sections as section (section.slug)}
		{@const done = section.items.filter((i) => status(i) !== 'blank').length}
		<section aria-label={section.name} class="flex flex-col gap-1.5">
			<h3 class="flex items-center gap-2 px-0.5 text-[13px] font-medium">
				<span class="size-2 flex-none rounded-full" style:background={section.color}></span>
				<span class="min-w-0 flex-1 truncate">{section.name}</span>
				<span class="text-xs text-muted-foreground tabular">
					{mode === 'review'
						? section.items.filter((i) => status(i) === 'correct').length
						: done}/{section.items.length}
				</span>
			</h3>
			<ol class="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-x-1">
				{#each section.items as item (item.question.id)}
					{@const s = status(item)}
					{@const isCurrent = item.index === current}
					<li>
						<button
							type="button"
							class="group relative grid h-11 w-full place-items-center rounded-xl transition-colors duration-150 hover:bg-muted"
							aria-label={label(item, section, s)}
							aria-current={isCurrent ? 'step' : undefined}
							onclick={() => onjump(item.index)}
						>
							<span
								class={cn(
									'relative grid h-7.5 w-10 place-items-center rounded-[50%] border-[1.5px] text-[12.5px] font-semibold tabular transition-[border-color,box-shadow] duration-150',
									s === 'blank'
										? 'border-foreground/30 text-muted-foreground group-hover:border-foreground/60'
										: 'border-transparent',
									mode === 'review' && s === 'blank' && 'border-dashed',
									isCurrent && 'ring-2 ring-brand ring-offset-2 ring-offset-card'
								)}
							>
								{#if s !== 'blank'}
									<span
										class={cn(
											'absolute -inset-px animate-fill rounded-[50%]',
											s === 'correct' ? 'bg-success' : s === 'wrong' ? 'bg-danger' : 'bg-foreground'
										)}
									></span>
								{/if}
								<span class={cn('relative', s !== 'blank' && 'text-background')}>{item.n}</span>
							</span>
							{#if flagged(item)}
								<!-- Tucked into the cell's corner, clear of the oval's edge (the list's
								     padding leaves room for the 2px it pokes out). -->
								<Flag
									class="absolute -top-0.5 -right-0.5 size-3 fill-warning text-warning"
									aria-hidden="true"
								/>
							{/if}
						</button>
					</li>
				{/each}
			</ol>
		</section>
	{/each}

	<ul
		class="flex flex-wrap gap-x-3.5 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground"
		aria-label="Key"
	>
		{#if mode === 'exam'}
			<li class="flex items-center gap-1.5">
				<span class="h-2.5 w-3.5 rounded-[50%] bg-foreground"></span>Answered
			</li>
			<li class="flex items-center gap-1.5">
				<span class="h-2.5 w-3.5 rounded-[50%] border border-foreground/40"></span>Not yet
			</li>
			<li class="flex items-center gap-1.5">
				<Flag class="size-3 fill-warning text-warning" aria-hidden="true" />Flagged
			</li>
		{:else}
			<li class="flex items-center gap-1.5">
				<span class="h-2.5 w-3.5 rounded-[50%] bg-success"></span>Correct
			</li>
			<li class="flex items-center gap-1.5">
				<span class="h-2.5 w-3.5 rounded-[50%] bg-danger"></span>Wrong
			</li>
			<li class="flex items-center gap-1.5">
				<span class="h-2.5 w-3.5 rounded-[50%] border border-dashed border-foreground/40"></span>Not
				answered
			</li>
		{/if}
	</ul>
</nav>
