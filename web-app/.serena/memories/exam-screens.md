# Exam screens (S2 New exam -> S3 Take exam, S6 Review)

- Handoff: New exam's Start sets `prototype.pendingExam` (ExamSetup, `src/lib/state/prototype.svelte.ts`) in its onclick before the link navigates. Take exam (`src/routes/(focus)/app/exams/[id]/+page.svelte`) builds a `setup` = record ?? (id === NEW_EXAM_ID ? pendingExam : null) ?? defaults (UPCAT full, Settings count/timer). Lost on reload by design.
- `buildExam(setup)` in `src/lib/components/exam/exam.ts` takes `Pick<ExamRecord,'type'|'subject'>`; a one-subject exam keeps only that subject.
- Prototype truth: the exam shows only the sample questions (28); `sampleNote` ("Prototype: N sample questions stand in for this exam's M") is shown on the intro, the desktop answer-sheet header and the phone sheet description.
- Clock: deadline-based (`Date.now()`), `msLeft`/`deadline` plain vars, `$effect` runs only while `timerOn && !onIntro && !timeUp`; teardown saves the remaining ms. `timeUp` is a latched `$state` (set when the running clock hits 0 or by the prototype skip). Untimed resume (no timeLeftMin) gets the time for the remaining questions.
- After time up: `choose()` ignores input and `OptionBubble` gets `disabled`.
- Short landscape (max-height 30rem, below lg): intro goes two columns via the page `<style>` (`.intro`, `.intro-facts`, `.intro-notes`, `.intro-start` hidden). Phone footer is opaque `bg-card` (the blur used to smear the intro's Start button through).
- `passageParts`: title only when the first paragraph is one short line wrapped in straight or curly quotes.
- Review dates use `longDate` from `student/format.ts` (UTC).
