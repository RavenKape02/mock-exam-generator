# Student screens (S1, S2, S4, S5, S7, S8 + D4)

Routes under `src/routes/(student)/app/`: `+page.svelte` (S1), `exams/new` (S2), `exams/+page.svelte` (S4), `exams/[id]/results` (S5, uses `finishedExam(page.params.id)`), `progress` (S7), `settings` (S8 with the D4 AlertDialog).

Shared parts in `src/lib/components/student/`:

- `Panel.svelte`: a white `.card-surface` card with an `@container`, a heading row plus an `action` snippet, and `i` for the reveal stagger.
- `ExamListItem.svelte`: a link row with score tile, title, meta and chevron (S1 recent exams; S4 on phones).
- `DailyMeter.svelte`: the daily question-limit bar. `using` shows what the exam would take, in red when it is over.
- `format.ts`: `shortDate`/`longDate` (UTC), `num`, `percent`, `SHORT_SUBJECT`, `examQuestionCount`, `examTypeLabel`, `examMeta`, `topicSplit` (the paper's weak-topic formula with largest-remainder rounding).
- `styles.ts`: `pill` (ink pill Button classes, 44px tall) and `cardLink`.
- `preview.ts`: prototype-only URL flags read in the browser only. `?preview=empty` gives the empty states on S1/S4/S7; `?used=1150` on S2 gives the over-limit state.

S5 sequences its bars with CSS in the page `<style>` (`.seq` + nth-child overriding BarList's inline delay). It also holds print CSS that hides the shell.
