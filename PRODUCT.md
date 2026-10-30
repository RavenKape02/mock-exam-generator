# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Students reviewing for Philippine entrance exams:** Grade 12 students
  taking the UPCAT (about 17 years old) and Grade 6 pupils taking the PSHS
  NCE (about 11–12). Design and copy are tuned for teens: calm and serious
  enough for a Grade 12 student, with words simple enough for a Grade 6
  pupil. Nothing childish.
- They mostly use **low-end Android phones on slow mobile data**; some use
  iPhones, iPads, laptops and desktops.
- **The researcher (admin):** checks the question bank, the ready pool of
  generated questions, and the results of each generation run.

## Product Purpose

Oplan Aral gives students free mock exams for the UPCAT and the PSHS NCE.
Questions come from a hand-checked question bank and from AI-generated
questions that a second model has checked. After each exam the student sees
their score per subject and per topic, and the next exam gives more
questions on their weak topics.

Success: students take repeated mock exams, see where they are weak, and
practise those topics more.

## Positioning

Other Philippine reviewers are fixed quiz pages and PDFs. Oplan Aral builds
a fresh mock exam each time, only from questions the student has not seen,
and shifts questions toward each student's weak topics.

## Operating Context

- UPCAT: 4 subjects (Math, Science, Reading Comprehension, Language
  Proficiency). PSHS NCE: 4 subjects (Science, Math, English, Abstract
  Reasoning).
- A full mock exam is 60 questions per subject. Students can also take one
  subject only, and set 10–60 questions per subject.
- Daily limit: 1,200 questions per student.
- Reading questions sit under their passage. Figure questions (all Abstract
  Reasoning, some Math and Science) show an image.
- Students know the paper exam and its shaded answer sheet.

## Capabilities and Constraints

- Current stage: **clickable prototype only**, no real log-in, grading or
  database.
- Stack (from the study's Ch 3): SvelteKit + TypeScript + Tailwind CSS +
  shadcn-svelte; later FastAPI, Heroku Postgres, Clerk log-in, Cloudflare
  Turnstile and R2. Bun is the package manager.
- Pages must be light: ≤ 100 KB JS (gzipped) per page, Tailwind-only
  animation, no extra libraries without approval.
- Lenis smooth scroll is approved by the owner (2026-10-31): the one extra
  library, wheel/trackpad only, off for reduced motion.
- Light and dark mode. English only.
- Plan and screen list: `docs/PROTOTYPE_PLAN.md`.

## Brand Commitments

- Name: **Oplan Aral** ("operation study").
- Visual reference the owner made binding for layout, shapes and motion:
  `design/reference/PremiumDashboard.jsx` (dark rounded icon rail, soft rounded
  cards, the Bloom flower, Geist font, springy motion).
- **Palette (owner's choice, 2026-10-31): "Pisara"**, classroom chalkboard
  green (`#1F8A5B`, rail `#16352B`) with a chalk-yellow highlight (`#F2D06B`).
  It replaces the reference's lavender and violet. No purple anywhere. Chosen
  because green suits anxious test-takers and fits the classroom; it must not
  drift toward UP's maroon and green.
- No official UP, PSHS or DOST logos or seals.

## Evidence on Hand

- Real UPCAT questions: `../Paper/Question Bank/UPCAT/bank/*.json`
  (575 checked questions, topic-tagged, WebP figures).
- No testimonials, user counts, pass rates or partner logos exist. Do not
  invent any.

## Product Principles

1. Exam-real: the exam screen should feel like the real test, so practice
   transfers.
2. Show the weak spot, then the next step: every result points to what to
   study next.
3. Light and fast on a cheap phone before anything else.
4. Honest: never claim results, affiliations or numbers we don't have.

## Accessibility & Inclusion

- Users include minors; ask only for email and password (Data Privacy Act
  of 2012).
- WCAG AA contrast, tap targets ≥ 44px, full keyboard use on the exam
  screen, reduced-motion support.
