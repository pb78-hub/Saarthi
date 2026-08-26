# product-spec.md

## The problem, grounded in the real portal

CPGRAMS (pgportal.gov.in) is India's central grievance redressal portal.
Walking through it directly surfaces the exact friction Saarthi exists to
remove:

- **Filing is gated entirely.** You cannot see the grievance form without
  first creating an account — there is no drafting-before-commitment.
- **Registration is heavy before you've said anything.** Name, gender, full
  address with cascading country/state/district dropdowns, pincode, mobile,
  phone, email, and a captcha — all before typing one word of the actual
  complaint.
- **The categorization trap is large and real.** There are 92 central
  ministries/departments alone that a citizen must correctly self-select
  from, before any sub-department drill-down. Picking wrong likely means
  delay or a bounced grievance.
- **Status tracking is also gated**, requiring either a registration number
  plus a grievance password, or email/mobile plus a captcha — no OTP, no
  magic link.
- **Process rules are buried, not surfaced.** A 21-day standard redress
  window, a 30-day appeal deadline that only opens after a "Poor"
  satisfaction rating, and a rule that closed grievances can't be reopened
  (a fresh one must be filed instead) all exist only in FAQ text, never
  surfaced proactively during the actual flow.
- **The site itself is dense and dated** — heavy top nav, a 20-language
  plain-text link list, banner carousels, a visitor counter.

Saarthi is a full website that replaces this experience end to end — not a
single embedded tool, but its own site with the same basic shape as the
portal it's improving on: a home page, a filing page, a tracking page, and
an FAQ page — each one deliberately calmer and clearer than its CPGRAMS
counterpart.

## Target user

Someone with a real, often urgent, civic complaint (no water, a delayed
refund, a pothole, a stalled pension) who is not going to fight a 92-option
dropdown or a captcha wall to be heard. May write in English, Hindi, or
Hinglish. May be a first-time or infrequent user of government digital
services.

## Site structure

Four pages, one shared header/footer shell, consistent navigation
throughout — this is a website, not a standalone widget.

| Page | Route | Replaces (on CPGRAMS) | What's different |
|---|---|---|---|
| Home | `/` | Dense homepage with banners, visitor counter, 20-language link list | A clear one-screen explainer with two obvious actions: File a Grievance, Track a Grievance |
| File a Grievance | `/file` | Login-gated Lodge Grievance form + heavy registration form | No login wall — conversational intake, live draft, Health Score, mocked submission |
| Track a Grievance | `/track` | Captcha + password/registration-number status lookup | Same basic input, but the result is decoded into plain language with a days-remaining countdown |
| FAQ | `/faq` | FAQ page with SLA/appeal/reopening rules buried in dense text | The same real rules, written in plain language, easy to scan |

## Core flows

### 1. Filing a grievance (`/file`)

1. The person describes their problem in their own words, in whatever
   language mix is natural to them.
2. Saarthi asks at most one clarifying question at a time, only for
   information that's actually missing — never a wall of form fields.
3. As the conversation progresses, a live draft builds in a side panel:
   department, location, timeframe, desired outcome, and a formal grievance
   text version of what the person said.
4. A "Health Score" shows how complete the draft is against what CPGRAMS
   would actually need, as a simple checklist plus an overall readiness
   indicator — this is the direct answer to the categorization-trap and
   incomplete-submission problems above.
5. Once the required fields are present, the person can submit. Submission
   is mocked: it returns a registration number in the same shape a real
   CPGRAMS filing would (see `architecture.md`).

### 2. Tracking a grievance (`/track`)

1. The person enters a registration number.
2. Saarthi looks it up (against mock data) and returns the status in plain
   language, plus how many days remain in the standard redress window —
   turning the buried SLA/appeal rules above into something proactively
   surfaced, not something you'd only find by reading an FAQ.

### 3. Understanding the rules (`/faq`)

A static, plain-language page covering the same real rules CPGRAMS states
in its own FAQ (21-day window, 30-day appeal after a "Poor" rating, no
reopening a closed grievance) — but scannable at a glance instead of buried
in dense paragraphs. No AI needed on this page; it's a content/design task.

## Feature list

| Feature | What it does | Page |
|---|---|---|
| Home explainer | Orients a first-time visitor in one screen, two clear CTAs | `/` |
| Conversational intake | Turns free-form, mixed-language complaint text into structured fields, one question at a time | `/file` |
| Health Score | Shows submission readiness as a checklist + overall score | `/file` |
| Department auto-routing | Picks the correct department from a fixed list, removing the 92-option manual dropdown | `/file` |
| Formal draft generation | Rewrites the citizen's casual description into a clear, respectful, action-ready grievance | `/file` |
| Mock submission | Returns a registration number in CPGRAMS' format, no real backend call | `/file` |
| Status decoder | Translates a mocked status + SLA countdown into plain language | `/track` |
| Plain-language rules | Surfaces SLA/appeal/reopening rules clearly instead of burying them | `/faq` |

## Non-functional constraints

- Everything is mocked — no real CPGRAMS integration, no persistent
  database, no authentication. This is a hackathon MVP, scoped for a demo,
  not for production traffic.
- Build for a live demo: fast to load, forgiving of a judge typing something
  unexpected, and legible on a shared screen.

## Demo script (suggested)

A tight narrative for judging, in order:

1. Open on the Home page — one line on the problem, two clear buttons.
2. Click into "File a Grievance," type a real, relatable complaint in
   Hinglish (e.g. no water supply for several days).
3. Show Saarthi asking one natural follow-up, not a form.
4. Point at the Health Score filling in live as the draft becomes complete.
5. Submit — show the registration number appear.
6. Navigate to "Track a Grievance," paste one of the seeded demo
   registration numbers, and show the plain-language status with the
   days-remaining countdown.
7. Briefly show the FAQ page as the "we thought about the whole journey,
   not just the chat" moment.
8. Close by naming the specific real-portal friction each screen just
   solved (login wall, 92-department picker, buried SLA) — judges should be
   able to map every screen back to a specific, real problem.
