# Public screens (P1–P5) and error page

- P1 landing `src/routes/(marketing)/+page.svelte`: header, gradient hero (promise + Sign up/Log in pills, hero.png art, live question card), How it works (ol in one card, answer-sheet bubble row per step), What's inside (UPCAT solid card / PSHS NCE dashed "Coming soon"), closing CTA with Bloom, footer.
- `src/lib/components/marketing/TryQuestion.svelte`: real bank question `upcat-math-0048` (via `subjectQuestions`/`topicName` from mock.ts); buttons with aria-pressed, bubble fills with animate-fill, explanation reveals, sr-only role=status announces result.
- Auth split layout `src/routes/(auth)/+layout.svelte`: phone = CSS-only gradient band + Bloom (no image); md+ = sticky auth-panel.png (lazy, so phones never fetch) with caption card; form column bg-card, max-w-sm.
- `src/lib/components/auth/`: AuthHeading (title + children + optional icon snippet), GoogleButton (→ app), OrDivider (Field.Separator on bg-card), PasswordInput (show/hide, bindable value), TurnstilePlaceholder (static dashed box; S2 can reuse).
- Pages: login → app / forgot-password / signup / admin shortcut; signup (strength hint) → verify-email; verify-email (InputOTP, inputId="code") → app; forgot-password has client `sent` state.
- `src/routes/+error.svelte`: on-brand 404/error, links home and app.
- Pill buttons are shadcn Button + `h-11 rounded-full` (no pill size variant exists yet). Inputs get `h-11 rounded-xl md:text-base` to keep 16px text.
