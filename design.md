# design.md

## Principle

The brief is explicit: **maximize usability, do not make this flashy.** The
entire premise of the product is being the calm, legible opposite of the
government portal it replaces — dense navigation, banner carousels, visitor
counters, a 20-language link list. Every design decision here should read
as restraint, not as a missing feature.

This is a website with four pages sharing one consistent shell — not a
single tool. Consistency of nav, header, and footer across pages is part of
what makes it read as a real site rather than a demo widget.

Avoid the generic "AI-generated" defaults: no warm-cream-background-with-
serif-and-terracotta-accent, no near-black-with-neon-accent, no dense
broadsheet-with-hairline-rules layout. This product's identity comes from
its own subject matter — an official document taking shape through a casual
conversation — not from a trending aesthetic.

## Color tokens

Flat colors only. No gradients, no glow, no drop shadows beyond a hairline
border. Named tokens, used consistently:

| Token | Hex | Use |
|---|---|---|
| `paper` | `#FAFAF8` | Page background — warm off-white, not stark white |
| `ink` | `#1C1B1A` | Primary text |
| `muted` | `#6B6559` | Secondary text, labels, placeholders |
| `line` | `#E4E1DA` | Hairline borders, dividers |
| `seal-primary` | `#2B4570` | Deep civic blue — user's own chat bubbles, primary buttons, links, nav |
| `seal-ready` | `#3E7C59` | Muted teal-green — "ready to submit" / success states |
| `seal-pending` | `#B8863B` | Muted amber — "needs attention" / mid-progress states |

Deliberately not saffron/green (avoids a kitschy flag-color reading) and not
a cold corporate blue-and-gray (avoids feeling like generic enterprise
software). The palette should feel like an official stamp, not a startup.

## Typography

Three roles, each a distinct family — not the same font doing double duty:

- **Display** (`Space Grotesk`, weights 500/700) — headings, the wordmark,
  the Health Score's numeral. Slightly technical and geometric — matches
  "citizen advocate AI" without feeling cold.
- **Body** (`Inter`, weights 400/500/600) — everything else, including nav
  and body copy. Chosen specifically for legibility across a wide range of
  reading fluency and screen quality, since the target user may be a
  first-time or infrequent user of government digital services.
- **Mono** (`JetBrains Mono`, weights 400/500) — registration numbers,
  status codes, anything that reads as an official/precise piece of data.

## Site shell (every page)

A persistent header and footer, identical across all four pages:

```
┌─────────────────────────────────────────────┐
│  Saarthi     Home  File a Grievance  Track  FAQ  │  ← header
├─────────────────────────────────────────────┤
│                                               │
│                 (page content)               │
│                                               │
├─────────────────────────────────────────────┤
│  This is a hackathon prototype — not affiliated  │  ← footer
│  with the Government of India.                    │
└─────────────────────────────────────────────┘
```

- Header: wordmark left, nav links right (current page underlined, not
  color-swapped, to keep the palette flat). Collapses to a simple stacked
  or hamburger nav on mobile — no more than the four links, so a simple
  wrap or a minimal disclosure is enough; no need for a heavy mobile-nav
  pattern.
- Footer: one line, small `muted` text, explicitly disclosing this is a
  hackathon prototype and not an official government site. This matters —
  the product clones a government portal's purpose, so the disclaimer is a
  design requirement, not an afterthought.

## Page layouts

### Home (`/`)

```
┌─────────────────────────────────────────────┐
│  [header/nav]                                │
├─────────────────────────────────────────────┤
│                                               │
│   Saarthi                                    │
│   File a public grievance in your own words. │
│   No forms. No 92-department dropdown.       │
│                                               │
│   [ File a Grievance ]   [ Track a Grievance ]│
│                                               │
│   ── three short lines, not cards with icons ─│
│   Talk, don't fill forms.                     │
│   See exactly what's missing before you file. │
│   Get your status explained, not just labeled.│
│                                               │
├─────────────────────────────────────────────┤
│  [footer]                                    │
└─────────────────────────────────────────────┘
```

One screen, no scroll-triggered reveals, no hero image needed — the
headline and the two buttons *are* the hero. The three supporting lines are
plain sentences, not icon cards; resist the urge to add iconography here.

### File a Grievance (`/file`) — split view

```
┌─────────────────────────────────────────────┐
│  [header/nav]                    [your name] │
├───────────────────────┬───────────────────────┤
│                       │  Grievance draft       │
│   Chat transcript     │  ⬤ Health Score seal   │
│   (user right,        │  ─────────────────     │
│    assistant left)    │  Department: …         │
│                       │  Location: …            │
│                       │  When: …                 │
│                       │  Grievance text: …        │
│                       │                            │
│  [ type here...  ] [Send]  [ Submit grievance ]  │
├───────────────────────┴───────────────────────┤
│  [footer]                                    │
└─────────────────────────────────────────────┘
```

Two columns on desktop/tablet (roughly equal width, hairline divider, no
shadow between them). Stacks to a single column on mobile — chat above the
draft panel — since the conversation is the entry point.

### Track a Grievance (`/track`) — single centered column

```
┌─────────────────────────────────────────────┐
│  [header/nav]                                │
├─────────────────────────────────────────────┤
│   Track a grievance                          │
│   [ registration number input ] [ Track ]    │
│                                               │
│   ┌─────────────────────────────────────┐   │
│   │  result card, appears after lookup    │   │
│   └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  [footer]                                    │
└─────────────────────────────────────────────┘
```

A short instruction line, one input + button, and a result card below on
lookup. No split view — this is a single quick task, not an ongoing session.

### FAQ (`/faq`) — single column, static content

A plain list of question/answer pairs covering the real rules (21-day
window, 30-day appeal after a "Poor" rating, no reopening a closed
grievance). Use plain `<h3>`/`<p>` pairs or a simple accordion — no icons,
no card grid. This page is proof that clarity, not AI, solves half of the
original portal's problem.

## The signature element: the Health Score seal

This is the one place to spend visual boldness — everything else stays
quiet. Render readiness as a **flat circular seal/stamp**, not a generic
gradient progress bar:

- A ring (SVG circle, `stroke-width: 4`, `stroke-linecap: round`) that fills
  clockwise from the top as required fields are captured.
- A number in the display face at the center (percentage), with a small
  "ready" label beneath it in the mono/caption size.
- Color shifts across the three seal tokens as it fills: `seal-primary` when
  low, `seal-pending` in the middle, `seal-ready` once complete — reusing
  the same three tokens as everything else, not a new gradient scale.
- A short checklist beside the ring (issue described, location, department,
  when, desired outcome, supporting detail), each item a small dot that
  fills solid once captured.

Rationale: the product's whole premise is a casual conversation becoming an
official document. A stamp/seal motif makes that transformation visible
without needing extra copy to explain it. This is the only page element
that should feel remarkable — the home, track, and FAQ pages should feel
almost plain by comparison.

## Motion

Exactly one transition is allowed: the seal's fill animates over ~400ms with
an ease curve when the score changes. Nothing else animates — no page-load
sequences, no hover glow, no scroll reveals. Respect
`prefers-reduced-motion` globally; when set, disable even that transition.

## Component notes

- **Chat bubbles**: user messages right-aligned in `seal-primary` with
  `paper`-colored text; assistant messages left-aligned, white background,
  hairline `line` border. No avatars, no timestamps.
- **Buttons**: solid `ink` background for neutral actions (Send), solid
  `seal-ready` for the primary commit action (Submit), both with a disabled
  state at reduced opacity rather than a color change.
- **Inputs**: white background, hairline `line` border, focus state is a
  visible 2px `seal-primary` outline (never remove focus outlines).
- **Nav links**: underline for the active page, no background pill, no
  color change beyond the existing link color.

## Writing guidelines

Words are part of the design, not decoration on top of it.

- **Plain language over bureaucratic language**, always. "Still being
  drafted as you chat…" not "Draft status: pending."
- **Active voice, and the same verb throughout a flow.** If a button says
  "Submit grievance," the confirmation state says "Submitted," not "Your
  request has been processed."
- **Name what people control**, not how the system works internally. "Your
  name (for the record)" not "Citizen identifier field."
- **Errors state what happened and what to do next, without apologizing on
  the interface's behalf.** "Couldn't find that grievance. Check the
  registration number and try again." not "Oops! Something went wrong."
- **Empty states are an invitation, not a dead end.** "Tell Saarthi what
  happened, in your own words — Hindi, English, or a mix" rather than a
  blank box with no prompt.

## Accessibility floor (non-negotiable, not a stretch goal)

- Responsive down to a single mobile column, on every page, including the
  header nav.
- Visible keyboard focus on every interactive element.
- `prefers-reduced-motion` respected everywhere motion appears.
- Color is never the only signal — the Health Score checklist uses filled
  dots *and* text labels, not color alone.
