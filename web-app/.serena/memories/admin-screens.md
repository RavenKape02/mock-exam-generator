# Admin (researcher) screens A1–A7 + D5

Routes in `src/routes/(admin)/admin/`: `+page` (A1 overview), `bank` (A2), `pool` (A3), `questions/[id]` (A4 + D5 AlertDialog), `questions/[id]/edit` (A7), `runs` (A5), `runs/[id]` (A6). Pages read `params` via `PageProps`; `+page.ts` only lists `entries`.

Shared parts in `src/lib/components/admin/`:

- `QuestionList.svelte` — A2/A3 list (`source` prop): filters (exam/subject/topic, pool adds kind/outcome), search, table ≥md, stacked rows on phones, shadcn Empty states.
- `format.ts` — formatDate, runLabel/runNumber, plainText, SUBJECT_ICONS, figureSize (hard-coded sizes of static/figures), OPTION_LABELS.
- `RichText.svelte` (paragraphs + **bold**), `SubjectTile.svelte`, `OutcomeBadge.svelte`, `CountBars.svelte`, `BackLink.svelte` (Button-based so the resolve lint rule passes).

Gotchas: shadcn Select.Trigger height is on `data-[size=default]:h-8` — override with `data-[size=default]:h-11`. `asset()` needs a cast for string paths. Runs done = highest run id number (mock has no RUNS_DONE).
