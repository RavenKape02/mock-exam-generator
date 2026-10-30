# Oplan Aral web-app: overview (2026-10-31)

Clickable prototype (no backend) of a free UPCAT / PSHS NCE mock exam app. SvelteKit 3 + Svelte 5 runes,
Tailwind v4, shadcn-svelte (bits-ui 2.20), bun, adapter-static (everything prerendered). Repo guide:
`../AGENTS.md` (folder map, SvelteKit 3 rules, screen rules). Plan: `../docs/PROTOTYPE_PLAN.md`.

## Key facts

- Imports use `#lib/...js` (package.json `imports`), not `$lib`. Links: `resolve('app/...')` (no leading slash).
- Routes: `(marketing)` landing, `(auth)` split-screen auth, `(student)/app/*` inside AppShell, `(focus)/app/exams/[id]`
  take-exam (no shell), `(admin)/admin/*` inside AppShell. Dynamic routes list ids in `+page.ts` `entries`.
- Data: `lib/data/mock.ts` (SUBJECTS with `short`, exams, runs, poolMeta, daily limit), `topics.ts` (topic names; keeps
  question JSON off pages that don't need it), `questions.ts` (real bank questions + admin/pool/rejected),
  `figures.ts` (figure pixel sizes). `lib/state/prototype.svelte.ts`: theme, defaultCount, timerOnByDefault,
  `pendingExam` (New exam -> Take exam handoff).
- Palette "Pisara" (owner choice): green #1F8A5B, rail #16352B, chalk yellow #F2D06B; tokens only in `src/app.css`. No purple.
- Lightweight rule (<=100 KB JS gz/page): use `common/Modal.svelte` (native <dialog>), `common/NativeSelect.svelte`,
  native `popover` menus (`shell/AccountMenu.svelte`, `exam/ExamTimer.svelte`) instead of bits-ui dialog/select/menu.
  bits-ui emits data-state/data-orientation: style with `data-[state=checked]:` etc., never `data-checked:`.
- Motion: Tailwind keyframes in app.css (`animate-reveal`, `animate-fill`, grow-x/y, slide), CSS count-up `.count`,
  `@starting-style`. Lenis smooth scroll: `lib/motion/smooth-scroll.ts` (window in root layout; AppShell main panel
  from 768px; resets main scroll on navigation).
- Art: `lib/assets/art/*.png` (+ `.png.json` prompts) from `../design/assets/generate.py` (OpenAI images, key in
  ../Paper/codebase/.env, explicit base_url). Bloom = raster (`brand/Bloom.svelte`).
- Checks: `bun run check`, `bun run lint`, `bun run build`; svelte autofixer `bunx @sveltejs/mcp svelte-autofixer <file>`.

See also memories: exam-screens, student-screens, admin-screens, screens/public-landing-and-auth.
