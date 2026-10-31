# Oplan Aral: agent guide

Free UPCAT and PSHS NCE mock exams for Filipino students. This repo holds the
app; the study (paper, question bank) lives in the sibling `../Paper` repo.

Current stage: **clickable prototype**. Screens and navigation only; no real
log-in, grading or database. Plan: [docs/PROTOTYPE_PLAN.md](docs/PROTOTYPE_PLAN.md).
Product truth: [PRODUCT.md](PRODUCT.md).

## Folder map

```
.
├── AGENTS.md, PRODUCT.md      # this guide; product truth (Impeccable)
├── docs/                      # PROTOTYPE_PLAN.md and other planning docs
├── design/
│   ├── reference/             # PremiumDashboard.jsx: the binding visual reference
│   └── assets/generate.py     # makes every raster with the OpenAI Images API
├── tools/                     # one-off scripts (make_sample_data.py)
├── .claude/                   # skills (impeccable, svelte-*, shadcn-svelte), agents
├── .impeccable/surfaces/      # direction contracts per surface
└── web-app/                   # SvelteKit 3 app (bun)
    ├── static/figures/        # question figures (later served from Cloudflare R2)
    └── src/
        ├── app.css            # ALL design tokens: colours (light + dark), radius, motion
        ├── app.html           # sets light/dark before first paint
        ├── lib/
        │   ├── assets/art/    # generated art (+ .png.json prompt sidecars)
        │   ├── components/
        │   │   ├── ui/        # shadcn-svelte (generated; edit only to fix bugs)
        │   │   ├── shell/     # AppShell, AccountMenu, nav.ts
        │   │   ├── brand/     # Logo, Bloom
        │   │   ├── common/    # CountUp, Segmented, PageHeader, small shared bits
        │   │   ├── data-viz/  # ScoreRing, BarList, TrendChart (hand-made SVG)
        │   │   ├── exam/      # Take exam / review parts (answer sheet, question card…)
        │   │   ├── auth/      # split auth layout parts
        │   │   └── admin/     # admin-only parts
        │   ├── data/          # mock.ts (exams, runs), topics.ts, questions.ts + sample-questions.json
        │   ├── motion/        # smooth-scroll.ts (Lenis)
        │   ├── state/         # prototype.svelte.ts (theme, settings, exam setup)
        │   ├── types.ts
        │   └── utils.ts       # cn() + shadcn prop types
        └── routes/
            ├── (marketing)/   # P1 landing  "/"
            ├── (auth)/        # P2–P5 split-screen auth pages
            ├── (student)/app/ # S1, S2, S4–S8 inside the student AppShell
            ├── (focus)/app/exams/[id]/  # S3 Take exam, no shell
            └── (admin)/admin/ # A1–A7 inside the admin AppShell
```

Put a component in `lib/components/<area>/` once two screens use it; until
then it can live next to its route as `Thing.svelte`.

## Serena (required for code work)

The Serena project is **`web-app/`**, not the repo root:
`activate_project` with `...\mock-exam-generator\web-app`. Paths in Serena tools
are relative to `web-app/` (e.g. `src/lib/data/mock.ts`). Its config
(`web-app/.serena/project.yml`) runs the `svelte` language server, which also
covers TypeScript. If the first symbol call fails, wait a few seconds: the
server may still be starting.

## Commands (run in `web-app/`)

| Task | Command |
| --- | --- |
| Dev server | `bun run dev` |
| Type check | `bun run check` |
| Lint + format check | `bun run lint` (fix formatting: `bun run format`) |
| Production build (static) | `bun run build` |
| Svelte docs | `bunx @sveltejs/mcp list-sections`, `bunx @sveltejs/mcp get-documentation "<section>"` |
| Svelte autofixer | `bunx @sveltejs/mcp svelte-autofixer <file.svelte>` |
| Add a shadcn component | `bunx shadcn-svelte@latest add <name> -y -o` |

## SvelteKit 3 rules (changed from v2)

- `$lib` is gone: import with `#lib/...` **and the file extension**, e.g.
  `import { cn } from '#lib/utils.js'`, `import X from '#lib/components/common/X.svelte'`.
- Every internal link goes through `resolve` from `$app/paths`, as a path
  **without** a leading slash: `href={resolve('app/exams/new')}`,
  `` resolve(`app/exams/${id}/results`) `` must be a literal or a template
  literal the types accept. Lint fails otherwise.
- `$app/state` (not stores), `$app/env` (renamed). `goto(...)` options changed.
- Config lives in `vite.config.ts`; there is no `svelte.config.js`.
- Everything is prerendered (`routes/+layout.ts`); dynamic routes list their
  ids in `+page.ts` `entries`.

## Rules for every screen

1. **Design source:** `design/reference/PremiumDashboard.jsx` sets layout,
   shapes and motion. **Colours are the "Pisara" palette** (chalkboard green
   `#1F8A5B`, rail `#16352B`, chalk yellow `#F2D06B`); the owner rejected the
   reference's purple, so never use purple. Use tokens from `app.css` (`bg-card`, `text-muted-foreground`,
   `bg-brand-soft`, `text-subject-math`, `shadow-card`, `rounded-[var(--radius-card)]`
   or `.card-surface`). No raw hex in components; no `dark:` colour overrides
   (tokens already switch).
2. **Skills:** follow `.claude/skills/impeccable/reference/craft-floor.md`
   (bans included: no eyebrow/kicker labels above headings, no gradient text,
   no coloured side borders, no identical icon-card grids, no emoji icons),
   `.claude/skills/shadcn-svelte/SKILL.md` rules (gap not space-y, size-*,
   Field for forms, Empty for empty states, data-icon on button icons), and
   `.claude/skills/svelte-core-bestpractices/SKILL.md`. Run the Svelte
   autofixer on every `.svelte` file you write.
3. **Motion:** Tailwind/CSS only. Use `animate-reveal` + `style="--i: n"`
   (or the `.reveal` class) for entrances, `animate-grow-x/y`, `animate-fill`,
   `animate-slide-next/prev`, `ease-spring` only for indicators/press,
   `CountUp` for numbers, `@starting-style` for appear transitions. No
   motion libraries, no Svelte `transition:` directives.
4. **Lightweight:** no new npm packages (Lenis is the one approved extra; it
   is already set up in `lib/motion/smooth-scroll.ts`).
   Prefer the zero-library building blocks over bits-ui based shadcn parts:
   `common/Modal.svelte` (native `<dialog>`, centred or bottom sheet) instead
   of Dialog/AlertDialog/Sheet, `common/NativeSelect.svelte` instead of Select,
   and the `popover` attribute (see `shell/AccountMenu.svelte`) instead of
   DropdownMenu. bits-ui emits `data-state=…` / `data-orientation=…`, so style
   with `data-[state=open]:`, never bare `data-open:` or `data-checked:`. Icons: one import per icon from
   `@lucide/svelte/icons/<name>`. Images: `<enhanced:img>` for files in
   `src/lib/assets`, plain `<img loading="lazy" width height>` for
   `static/figures`. Budget ≤ 100 KB JS gzipped per page.
5. **Responsive:** design at 360px first. Check 320, 360, 402 (iPhone 17),
   844×390 (phone sideways), 820 and 1180 (iPad), 1366×768, 1920. No
   sideways scroll at 320. Tap targets ≥ 44px (answer options ≥ 48px),
   inputs ≥ 16px text, `dvh` and safe-area insets. Tables become stacked
   cards on phones. Dialogs slide up from the bottom on phones.
6. **Copy:** plain English, sentence case, buttons name their action. Never
   invent testimonials, user counts, pass rates or affiliations. No UP,
   PSHS or DOST logos.
7. **Reachability:** every screen links to at least one other screen, and
   every button that would do real work just moves to the next screen.
8. Before you finish: `bun run check`, `bun run lint`, `bun run build` all
   pass.
