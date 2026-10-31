---
name: Oplan Aral
description: Free UPCAT and PSHS NCE mock exams, drawn as a calm chalkboard-green study desk with a shaded answer sheet at its heart.
colors:
  chalkboard-green: "#1f8a5b"
  chalkboard-green-deep: "#14603f"
  chalkboard-green-wash: "#e1f3e9"
  chalkboard-green-glow: "#bfe6cf"
  rail-green: "#16352b"
  rail-green-raised: "#21473a"
  rail-chalk-text: "#9fb8ab"
  chalk-yellow: "#f2d06b"
  ink: "#18171d"
  paper-white: "#ffffff"
  classroom-ground: "#e8edea"
  soft-slate: "#eef2ef"
  muted-slate: "#f4f7f5"
  muted-ink: "#5c6862"
  hairline: "#e3e8e5"
  field-line: "#d6ded9"
  success: "#1e7a48"
  success-wash: "#e7f8ee"
  warning: "#a15c07"
  warning-wash: "#fdf1dc"
  danger: "#b42318"
  danger-wash: "#fdecec"
  subject-math: "#1f8a5b"
  subject-science: "#b7791f"
  subject-reading: "#3d74d9"
  subject-language: "#c8519f"
typography:
  display:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 6.4vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 3.6vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  page-title:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
    letterSpacing: "-0.01em"
  question:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.3vw, 1.125rem)"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    fontFeature: "\"tnum\" 1"
rounded:
  sm: "8.4px"
  md: "11.2px"
  lg: "14px"
  xl: "19.6px"
  2xl: "25.2px"
  card: "22px"
  rail: "26px"
  hero: "28px"
  oval: "50%"
  pill: "9999px"
spacing:
  shell-gutter: "14px"
  grid-gap: "16px"
  card-pad: "18px"
  card-pad-phone: "16px"
  page-gutter-phone: "16px"
  section-gap: "96px"
  tap-target: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "rgb(24 23 29 / 0.8)"
  button-hero:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.muted-slate}"
  button-destructive:
    backgroundColor: "{colors.danger-wash}"
    textColor: "{colors.danger}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "44px"
  card:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "0 14px"
    height: "44px"
  option-row:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    padding: "8px 12px"
    height: "52px"
  option-row-selected:
    backgroundColor: "{colors.soft-slate}"
  answer-oval:
    backgroundColor: "transparent"
    textColor: "{colors.muted-ink}"
    rounded: "{rounded.oval}"
    width: "40px"
    height: "30px"
  answer-oval-shaded:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-white}"
  nav-rail:
    backgroundColor: "{colors.rail-green}"
    textColor: "{colors.rail-chalk-text}"
    rounded: "{rounded.rail}"
    width: "64px"
  nav-rail-active:
    backgroundColor: "{colors.chalk-yellow}"
    textColor: "{colors.rail-green}"
    rounded: "{rounded.pill}"
    size: "44px"
  segmented:
    backgroundColor: "{colors.soft-slate}"
    textColor: "{colors.muted-ink}"
    rounded: "{rounded.pill}"
    padding: "3px"
  segmented-active:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
  chip-weak:
    backgroundColor: "{colors.warning-wash}"
    textColor: "{colors.warning}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
---

# Design System: Oplan Aral

## Overview

**Creative North Star: "The Answer Sheet on the Chalkboard"**

Oplan Aral looks like a quiet classroom: a pale green-grey wall, a dark chalkboard-green rail down the side, and white cards pinned to it. The one thing every student already knows, the paper answer sheet with its row of ovals, is the product's signature. Answers are shaded into ovals, scores fill bars, and progress grows in from the left. The layout, shapes and motion come from the owner's reference dashboard (`design/reference/PremiumDashboard.jsx`). The colour comes from the owner's "Pisara" palette, which replaced the reference's purple.

The mood is calm and serious, never playful. Density is medium: a dashboard shows five or six cards at once, each with one job and a small heading. Colour is spent on meaning. Green is the brand and progress, each subject has its own colour, red and green mark wrong and right, and chalk yellow appears only once or twice on a screen. Everything else is ink on white.

Depth is soft. Cards float on a long, faint shadow. Primary actions are black ink pills. Motion is short and springy, and it always explains a change: a bubble fills, a bar grows, an indicator slides to the new tab. With reduced motion turned on, all of it stops.

**Key Characteristics:**
- Chalkboard-green icon rail (desktop) with a chalk-yellow circle that slides to the current page.
- White cards with a 22px radius and a soft, long shadow on a green-grey ground.
- Ink-black pill buttons for the main action; ghost pills for the second one.
- Answer-sheet ovals and lettered bubbles that fill when chosen. This is the signature.
- One colour per subject, used for dots, bars and chart lines.
- Geist with tabular numbers everywhere a number changes.
- Clay-rendered Bloom flower and hero art used sparingly, as ornament only.
- Full light and dark themes from the same token names.

## Colors

A cool green-grey classroom with one chalkboard green, one chalk yellow, ink for action, and four subject colours that carry data.

### Primary
- **Chalkboard Green** (`chalkboard-green`): the brand. Progress bars, the daily meter, filled bubbles on the landing page, the focus ring, the text caret, the active tab on phones. In dark mode it lightens to a mint green so it stays visible.
- **Deep Chalkboard Green** (`chalkboard-green-deep`): green text on a light green wash, such as links and the icon tile on auth pages.
- **Chalkboard Wash** (`chalkboard-green-wash`) and **Chalkboard Glow** (`chalkboard-green-glow`): soft green fills. The wash sits behind score badges and the active phone tab; the glow is the text-selection colour and the light end of the score ring.

### Secondary
- **Rail Green** (`rail-green`): the desktop icon rail and nothing else, plus tooltips that come out of it. **Rail Raised** (`rail-green-raised`) marks the Settings button when it is current. **Rail Chalk Text** (`rail-chalk-text`) is the colour of idle rail icons.

### Tertiary
- **Chalk Yellow** (`chalk-yellow`): the sliding indicator on the rail, the account avatar, and at most one marker stroke per screen (the dashboard puts it under today's "questions left" number at 40% strength). It is the same in light and dark mode.

### Neutral
- **Ink** (`ink`): body text, headings, primary buttons, and shaded ovals on the exam answer sheet (shaded like a pencil mark).
- **Paper White** (`paper-white`): cards and popovers.
- **Classroom Ground** (`classroom-ground`): the page background behind cards.
- **Soft Slate** (`soft-slate`) and **Muted Slate** (`muted-slate`): the segmented-control track, selected option rows, hover fills, track behind bars.
- **Muted Ink** (`muted-ink`): secondary text, captions, idle tab labels.
- **Hairline** (`hairline`) and **Field Line** (`field-line`): dividers and card-internal lines; input and scrollbar strokes.

### Data colours
- **Subjects**: Math uses Chalkboard Green, Science amber (`subject-science`), Reading blue (`subject-reading`), Language pink (`subject-language`). They appear as 8px dots before subject names, as bar fills, and as chart lines.
- **States**: `success`, `warning`, `danger`, each with a pale `-wash` partner for backgrounds. Right answers are success green, wrong answers danger red, flags and "Weak" chips are warning amber.

### Named Rules
**The One Chalk Mark Rule.** Chalk yellow appears only on the rail indicator, the avatar, and at most one highlight stroke per screen. If a second yellow highlight shows up on the same screen, remove one.

**The Subject Owns Its Colour Rule.** A subject's colour means that subject and nothing else. Never use the science amber for a warning or the reading blue for a link.

**The No Purple Rule.** No purple, violet or lavender anywhere, including charts and illustrations. The palette must also not drift toward UP's maroon-and-green pairing.

## Typography

**Display Font:** Geist Variable (with ui-sans-serif, system-ui)
**Body Font:** Geist Variable (same family)

**Character:** One neutral, modern sans in several weights. Headings are semibold with tight negative tracking, so they read firm and compact; body text is regular weight with relaxed leading for tired eyes.

### Hierarchy
- **Display** (600, `clamp(2.1rem, 6.4vw, 3.75rem)`, line-height 1.04, -0.04em): the landing-page promise only.
- **Headline** (600, `clamp(1.6rem, 3.6vw, 2.25rem)`, -0.03em): landing-page section headings and the closing call to sign up.
- **Page Title** (600, `clamp(1.5rem, 3vw, 2rem)`, -0.03em): the title at the top of every app screen ("Settings", "UPCAT full mock exam"). The dashboard hero card uses a slightly smaller clamp (1.375rem to 1.75rem).
- **Title** (600, 0.875rem, -0.01em): the small heading at the top-left of every card ("Last score", "Answer sheet").
- **Question** (500, `clamp(1rem, ... , 1.125rem)`, 1.5): the question stem on the exam screen. Options sit at 15px with snug leading.
- **Body** (400, 1rem, 1.625): paragraphs. Landing paragraphs keep to about 34rem; page descriptions to 60ch.
- **Label** (500, 13px, tabular numbers): segmented controls, answer-sheet section names, bubble numbers. Meta text drops to 12px in Muted Ink.

### Named Rules
**The Tabular Numbers Rule.** Any number that counts, scores or ticks (percentages, "5/12", the timer, "960 of 1,200") uses tabular figures so digits never jump.

**The Sentence Case Rule.** Headings, buttons and labels are in sentence case. No all-caps labels, no letter-spaced small caps.

## Layout

**Desktop and tablet (768px and up):** a fixed-height shell. A 64px icon rail sits on the left inside a 14px outer gutter, with a 16px gap to the main area. The main area scrolls on its own (with Lenis smooth scrolling) and is capped at 1440px. App screens are a card grid with 16px gaps. The dashboard is a 3-column grid: the hero card spans two columns, the daily meter sits beside it, three cards fill the next row, and recent exams spans the full width.

**Phone (under 768px):** the rail is replaced by a sticky top bar (logo and avatar, blurred translucent ground) and a fixed bottom tab bar with four tabs, each at least 56px tall. Cards stack in one column with a 16px side gutter, and the page leaves room at the bottom for the tab bar and the safe area.

**Focus screens (Take exam):** no rail. A top bar holds the exam name, subject tabs (a segmented control), the timer and "Save and leave". The question card takes most of the width; the answer sheet card sits on the right on desktop and becomes a "0 / 28" pill in the bottom bar on phones.

**Landing page:** a 1440px column. The hero is a large rounded gradient field split into promise (left) and a live question card (right), which stack on phones. Sections below are spaced about 96px apart and capped at 1200px.

**Rhythm:** card padding 18px (16px on phones); a card's heading row sits 14px above its content; grids and stacks use 16px; tap targets are at least 44px.

## Elevation & Depth

A soft, layered system. The ground is flat; white cards rise off it with one long, faint shadow, and the main call to action rises a little more. There are no hard borders around cards in light mode; the shadow and the white-on-grey contrast do the work. In dark mode the same two shadow tokens switch to deeper black values and cards become a slightly lighter green-black than the ground.

### Shadow Vocabulary
- **Card** (`--shadow-card`): every card. A 1px contact shadow plus a long, low-opacity drop.
- **Lift** (`--shadow-lift`): the landing hero's "Sign up free" button, and anything that should read as the one thing to press.
- **Indicator** (`0 1px 3px rgb(24 23 29 / 0.12)`): the white thumb inside segmented controls.
- **Bloom drop** (`drop-shadow(0 14px 18px rgb(20 70 50 / 0.18))`): under the Bloom flower art only.

### Named Rules
**The One Shadow Per Surface Rule.** A surface gets the card shadow or the lift shadow, never a stack of both and never a coloured glow.

## Shapes

Soft and round throughout. The base radius is 14px; everything else scales from it (8.4px, 11.2px, 14px, 19.6px, 25.2px). Cards use 22px, the desktop rail 26px, and the landing hero field 28px. Buttons, chips, tabs, the segmented control and avatars are full pills or circles. Option rows use the 25.2px step at 52px tall, so they read as near-pills.

The answer-sheet oval is the one non-circular shape: a 40 by 30px ellipse (`border-radius: 50%`) with a 1.5px ring, the same oval a student shades on the paper test. Score badges in exam lists reuse it at 60 by 36px.

### Named Rules
**The Oval Means Answer Rule.** The ellipse is kept for answers and scores. Do not use it for decorative buttons or tags.

## Components

### Buttons
Tactile ink pills.
- **Shape:** full pill, 44px tall (48px for the landing hero pair).
- **Primary:** ink background, white text, 15px medium label, 20px side padding, optional trailing arrow icon. Hover lightens to 80% ink; pressed moves down 1px.
- **Hero primary:** adds the lift shadow and rises 1px on hover with the spring easing.
- **Ghost:** no fill, ink text; hovers to Muted Slate. On gradient fields it sits on a 70% white fill.
- **Destructive:** pale red wash with danger-red text and icon ("Delete account").
- **Focus:** a 3px ring in the brand green at half strength, plus the global 2px outline.

### Chips
- **Badge:** small ink pill ("Open now") or Soft Slate pill ("Coming soon").
- **Weak chip:** Warning Wash background, warning-amber text, used next to weak topic names on results and progress.

### Cards / Containers
- **Corner Style:** 22px.
- **Background:** Paper White (dark mode: green-black card).
- **Shadow Strategy:** the Card shadow (see Elevation & Depth).
- **Border:** none in light mode; internal lists use Hairline dividers.
- **Internal Padding:** 18px (16px on phones), with a small semibold title row and an optional right-side link ("See results", "Progress →").
- **Hero card:** the dashboard and results hero cards and the landing hero use the mint-to-chalk-yellow gradient field instead of white, with Bloom or clay art on the right.

### Inputs / Fields
- **Style:** 44px tall, 19.6px radius, Field Line stroke, transparent fill (Muted Slate when read-only), 14px side padding, 16px text so phones do not zoom.
- **Focus:** stroke turns brand green with a 3px green ring at half strength.
- **Error / Disabled:** danger stroke and danger ring; disabled at half opacity.

### Navigation
- **Desktop rail:** 64px wide Rail Green column with 26px radius, logo tile at the top, four 44px round icon links, Settings and avatar at the bottom. The current page sits on a chalk-yellow circle that slides between items (380ms, spring). Idle icons are Rail Chalk Text and turn white on hover. Labels appear as tooltips to the right on hover or focus.
- **Phone tab bar:** fixed white bar at 95% with blur and a top hairline. Each tab is an icon over a 12px label; the active tab turns brand green and its icon sits on a Chalkboard Wash pill.
- **Segmented control:** Soft Slate pill track with a white thumb that slides under the chosen option (380ms, spring). Used for subject tabs on the exam, question counts and theme in Settings.

### Answer Option (signature)
A full-width row drawn like a line of the answer sheet: a 32px lettered circle (A–D), the answer text, and on mouse devices a small keyboard-shortcut key on the right. Choosing it fills the circle with ink from 40% scale in 100ms and tints the row Soft Slate. In review, right rows turn Success Wash with a green fill, wrong rows Danger Wash with a red fill, and the correct key gets a dashed green outline.

### Answer Sheet (signature)
A card listing every question as a numbered oval, grouped under each subject's colour dot with a "done / total" count. Blank ovals have a faint ink ring; answered ovals fill with ink; the current question gets a 2px brand-green ring with an offset. A small amber flag sits on the corner of flagged ovals. A key at the bottom explains the marks. In review the fills switch to green and red, and blanks become dashed.

### Data Viz
- **Score ring:** a thick arc that fills from Chalkboard Glow to Chalkboard Green, with the percentage and "166 of 240" in the middle.
- **Bars:** 6–8px rounded tracks in Muted Slate, filled in the subject colour, growing from the left (380ms). Percent and "5/12" sit right-aligned in tabular figures.
- **Trend chart:** a single brand-green line with hollow dots on a light grid.
- **Count-up numbers:** big stats count up from zero in 600ms using pure CSS.

## Do's and Don'ts

### Do:
- **Do** put the main action in an ink pill at least 44px tall, and keep one per area.
- **Do** put content on white 22px cards with the card shadow, on the Classroom Ground.
- **Do** colour data by subject: Math green, Science amber, Reading blue, Language pink.
- **Do** use tabular figures for every score, count and timer.
- **Do** animate only to explain a change: bubbles fill (100ms), bars grow (380ms), indicators slide (380ms spring), cards reveal with a 40ms stagger capped at six items. Respect reduced motion.
- **Do** define every new colour for both light and dark under the same token name.
- **Do** keep the Bloom and clay art rare: one piece per hero area at most.

### Don't:
- **Don't** use purple, violet or lavender anywhere.
- **Don't** use chalk yellow for buttons, text or more than one highlight per screen.
- **Don't** use the shadcn Button or Input at their default 32px height and 14px radius; size them up to the 44px pill and 44px field.
- **Don't** add hard borders or coloured glows around cards.
- **Don't** add fake proof: no testimonials, user counts, pass rates or partner logos, and no official UP, PSHS or DOST marks.
- **Don't** make it look like a game: no badges for streaks, confetti, or cartoon mascots.
