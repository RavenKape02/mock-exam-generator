---
version: 1
slug: "web-app-src-routes-student-app-page-svelte"
primary_target: "web-app/src/routes/(student)/app/+page.svelte"
related_targets: ["web-app/src/routes/(auth)","web-app/src/routes/(admin)","web-app/src/routes/(focus)","web-app/src/routes/(student)"]
---

## Scope

Every working screen of the prototype: auth (P2–P5), student app (S1–S8, D1–D4), admin (A1–A7, D5). Mode: Operate. Tasks and states per docs/PROTOTYPE_PLAN.md section 5.

## Direction contract

THESIS: A calm, exam-real study tool where the shaded answer sheet is the signature move; it refuses the grey admin template and the gamified learning-app look.
OWN-WORLD: Reference shell: chalkboard-green rounded icon rail #16352B (bottom tab bar on phones) with chalk-yellow sliding indicator, #E8EDEA ground, white 22px cards with soft shadows, ink pill primary buttons, green #1F8A5B accent, one colour per subject (math green, science amber, reading blue, language pink), Geist with tabular numbers, Bloom only as rare ornament.
STORY: The student sees where they stand, starts an exam in two taps, takes it like the paper test, and leaves results knowing which topics to practise next.
FIRST VIEWPORT: Dashboard: hero card "Start a mock exam" (or Continue exam when one is saved) at the top-left of the grid, last score ring and weak-topic bars beside it, questions-left-today visible without scrolling.
FORM: Pinned by the owner, no concept roll run. Owner's words: "our main design reference would be @PremiumDashboard.jsx" and, for colour, the owner chose the "Pisara" palette after rejecting purple. Signature move: the answer-sheet bubble grid on Take exam and Answer review. seed: none (owner-pinned, roll not run)
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
