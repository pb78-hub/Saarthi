# AGENTS.md

## Mission

Saarthi is a better, improvised clone of CPGRAMS (India's central public
grievance portal) — **a full multi-page website**, not a single-screen app
or embedded widget. It replaces a login-gated, jargon-heavy, 92-department
self-categorization form with a conversational filing experience that
drafts a properly formatted, correctly routed grievance — then decodes
status updates in plain language.

Built for Varun Mayya's "Build What Moves India" hackathon. Judged on:
problem severity, UX simplicity, and genuinely meaningful (non-superficial)
use of the OpenAI API. Optimize for those three things over anything else.

This repo is being built entirely by you (Codex), from these docs, from
scratch. There is no existing codebase to extend — treat every file below as
something you are creating for the first time.

## Read these first, in this order

1. `product-spec.md` — what to build and why, including the full site map.
2. `design.md` — how it should look, feel, and read. Non-negotiable
   constraint: **usable and calm, not flashy.**
3. `architecture.md` — how to build it: stack, folder structure, data
   models, the exact AI prompt/schema, API contracts, mock data rules.

## Global rules (apply everywhere, no exceptions)

- This is a website: every page shares one header/footer shell and
  consistent navigation. No page should feel like a standalone tool
  dropped into an empty template.
- Everything is mocked. No real CPGRAMS integration, no real database, no
  auth. `architecture.md` specifies exactly what the mock layer should do —
  don't reach further than that.
- No gradients, no glow, no decorative animation, no stock illustration.
  `design.md` names the one motion that's allowed. Everything else is flat
  and quiet by design, not by omission.
- Never invent government process details that aren't in `product-spec.md`
  or `architecture.md`. If something is ambiguous, make the most usable
  choice and leave a `// TODO:` comment explaining the assumption, rather
  than guessing silently.
- Match the tone in `design.md`'s writing section in every piece of UI copy
  you write, including empty states, errors, and button labels.

## Suggested build order

1. Scaffold the app (config files, global styles, design tokens) per
   `architecture.md`.
2. Build the shared site shell (header + footer + nav) used by every page.
3. Build the data models and mock data layer — everything else reads from
   it.
4. Build the AI orchestration layer (prompt + structured-output schema) and
   the `/api/chat` route. Test it with a few sample conversations before
   touching UI.
5. Build the pages in this order: Home → File a Grievance → Track a
   Grievance → FAQ.
6. Pass over everything once against `design.md`'s restraint checklist
   before calling it done.

## Non-goals

- Don't integrate with the real CPGRAMS API or scrape pgportal.gov.in.
- Don't add scope beyond `product-spec.md` without flagging it first.
- Don't add visual flourish beyond what `design.md` specifies — that's a
  deliberate brief constraint, not an oversight to "improve" on.
