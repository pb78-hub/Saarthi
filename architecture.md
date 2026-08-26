# architecture.md

## Stack — and why

**Next.js 14 (App Router) + TypeScript + Tailwind CSS**, single stack, no
separate backend service. This produces a normal multi-page website (routed
pages, shared layout, static content pages included) — not just a
single-screen app; App Router's file-based routing is what makes the
four-page site structure in `product-spec.md` straightforward to build.

Rationale specific to building this via an autonomous coding agent: one
framework means one repo, one deploy target, and no glue code between a
separate frontend and backend. It's also the most heavily-represented stack
in general web tooling knowledge, which means more reliable, more
conventional code generation and fewer integration surprises than a
split-service setup would produce for a time-boxed hackathon build.

Supporting libraries:
- `openai` — official SDK, used for Structured Outputs (`gpt-4o`), needed
  only on the `/file` page's API route
- `zod` — runtime validation of the model's structured output before it
  touches UI state

No database, no auth library, no ORM — the mock data layer below replaces
all of that for this MVP.

## Folder structure

```
saarthi/
├── AGENTS.md / product-spec.md / design.md / architecture.md
├── app/
│   ├── layout.tsx            ← fonts, metadata, wraps every page in SiteHeader/SiteFooter
│   ├── globals.css           ← Tailwind entrypoint + focus/motion rules
│   ├── page.tsx              ← Home page ("/")
│   ├── file/
│   │   └── page.tsx          ← File a Grievance — chat + live draft ("/file")
│   ├── track/
│   │   └── page.tsx          ← Track a Grievance — status decoder ("/track")
│   ├── faq/
│   │   └── page.tsx          ← FAQ — static plain-language rules ("/faq")
│   └── api/
│       ├── chat/route.ts     ← POST: conversation turn → extraction (used by /file)
│       ├── submit/route.ts   ← POST: finalize draft → registration id
│       └── track/[id]/route.ts ← GET: look up mock record by id
├── components/
│   ├── SiteHeader.tsx        ← wordmark + nav, shared across every page
│   ├── SiteFooter.tsx        ← one-line prototype disclaimer, shared across every page
│   ├── ChatWindow.tsx        ← transcript + input (used on /file)
│   ├── GrievancePreview.tsx  ← live draft panel + submit button (used on /file)
│   └── HealthScoreSeal.tsx   ← the signature readiness seal
├── lib/
│   ├── openai.ts             ← client + structured-output schema + call fn
│   ├── prompts.ts            ← system prompt builder
│   ├── departments.ts        ← department list + keyword hints
│   └── mockDb.ts             ← in-memory mock CPGRAMS store
├── types/
│   └── grievance.ts          ← shared types + Zod schema
├── package.json / tsconfig.json / next.config.js / tailwind.config.ts
└── .env.example              ← OPENAI_API_KEY
```

`app/layout.tsx` renders `<SiteHeader />{children}<SiteFooter />` so every
route automatically gets the shared shell — no page should render its own
ad hoc header.

## Data models

```ts
// The fields Saarthi tracks to decide whether a grievance is ready to
// submit. Also what the Health Score checklist renders.
type HealthField =
  | "issueDescribed"
  | "location"
  | "department"
  | "dateOrTimeframe"
  | "desiredOutcome"
  | "supportingDetail";

interface GrievanceDraft {
  summary: string | null;
  fullText: string | null;       // formal grievance text, shown in the preview panel
  location: string | null;
  department: string | null;
  dateOrTimeframe: string | null;
  desiredOutcome: string | null;
}

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

// A record as it would exist in CPGRAMS. Entirely mocked — see below.
interface MockGrievanceRecord {
  id: string;                    // format: SAA/{year}/{6-digit random}
  draft: GrievanceDraft;
  citizenName: string;
  status: "Registered" | "Pending with Nodal Officer" | "Transferred" | "Disposed";
  statusNote: string;
  filedOn: string;                // ISO date
  slaDeadline: string;             // ISO date — filedOn + 21 days
}
```

## AI orchestration

Only the `/file` page and its `/api/chat` route touch the model. Home,
Track, and FAQ are plain React/static pages — Track's "decoding" is simple
template logic in `mockDb.ts`/the route handler, not a model call, since the
mock records already store a plain-language `statusNote`.

### System prompt (use verbatim as the base; extend, don't replace)

```
You are Saarthi, a calm and patient assistant that helps Indian citizens
turn a messy, informal complaint into a properly written public grievance
for CPGRAMS.

Ground rules:
- The person may write in English, Hindi, or Hinglish. Match their language
  and keep replies short and warm, never bureaucratic.
- Ask only ONE follow-up question at a time, and only for information that
  is actually missing.
- Never invent facts. If the person hasn't said where or when something
  happened, leave that field null and ask for it — don't guess.
- Route the grievance to exactly one department from the provided list when
  you can tell which one fits. If you genuinely cannot tell yet, leave
  department null and ask a clarifying question.
- A grievance is ready to submit only once you have: a clear issue
  description, a location, a department, and what outcome the person wants.
  A date/timeframe and supporting detail are helpful but not strictly
  required.
- Once ready, draft.fullText should read like a clear, respectful, properly
  formatted grievance a government officer can act on immediately — not a
  copy of the person's casual wording.
- Keep "reply" itself conversational — that's what the person sees in the
  chat bubble. The formal writing lives in draft.fullText, not in reply.
```

Inject the department list (see below) into the prompt as the "provided
list" referenced above.

### Structured output schema (OpenAI Structured Outputs, `strict: true`)

```json
{
  "name": "grievance_extraction",
  "strict": true,
  "schema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "reply": { "type": "string" },
      "draft": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "summary": { "type": ["string", "null"] },
          "fullText": { "type": ["string", "null"] },
          "location": { "type": ["string", "null"] },
          "department": { "type": ["string", "null"] },
          "dateOrTimeframe": { "type": ["string", "null"] },
          "desiredOutcome": { "type": ["string", "null"] }
        },
        "required": ["summary", "fullText", "location", "department", "dateOrTimeframe", "desiredOutcome"]
      },
      "fieldsCaptured": {
        "type": "array",
        "items": { "type": "string", "enum": ["issueDescribed", "location", "department", "dateOrTimeframe", "desiredOutcome", "supportingDetail"] }
      },
      "missingFields": {
        "type": "array",
        "items": { "type": "string", "enum": ["issueDescribed", "location", "department", "dateOrTimeframe", "desiredOutcome", "supportingDetail"] }
      },
      "followUpQuestion": { "type": ["string", "null"] },
      "readyToSubmit": { "type": "boolean" }
    },
    "required": ["reply", "draft", "fieldsCaptured", "missingFields", "followUpQuestion", "readyToSubmit"]
  }
}
```

Validate the model's JSON response against a matching Zod schema before it
touches any UI state — never trust model output for shape, only for
content. Verify this exact schema shape against whichever OpenAI SDK/model
version ends up installed; Structured Outputs syntax has shifted across SDK
versions.

### Department list (working subset — expand if the demo needs more)

Central departments, each with a name and a few lowercase keyword hints
(keywords are for an optional lightweight client-side pre-hint only — the
model does the real routing):

- Railways — train, railway, station, irctc, ticket
- Posts — post office, courier, speed post, parcel, postman
- Financial Services (Banking) — bank, loan, account, atm, cheque
- Power — electricity, power cut, meter, bijli, transformer
- Drinking Water and Sanitation — water supply, sewage, drainage, tap water
- Road Transport and Highways — road, highway, pothole, rto, driving licence
- Telecommunications — mobile network, sim, broadband, telecom, bsnl
- Health & Family Welfare — hospital, doctor, health scheme, ayushman, clinic
- Housing and Urban Affairs — municipal, housing scheme, urban development, building plan
- Consumer Affairs — consumer, overcharging, product defect, warranty
- Labour and Employment — epf, provident fund, salary, employer, labour
- Food and Public Distribution — ration card, pds, ration shop, food grain
- Home Affairs — police, fir, law and order, passport
- Pensions and Pensioners Welfare — pension, retiree, ppo
- Other / Not sure yet — (fallback when none fit; model should ask instead of guessing)

## API contract

### `POST /api/chat`
- **Request:** `{ "history": ChatTurn[] }` — full conversation so far,
  ending in the latest user turn.
- **Response 200:** the full structured-output object described above.
- **Response 400:** `{ "error": string }` if `history` is missing/empty.
- **Response 500:** `{ "error": string }` on model/parse failure.

### `POST /api/submit`
- **Request:** `{ "draft": GrievanceDraft, "citizenName": string }`
- **Response 200:** `{ "registrationId": string, "slaDeadline": string }`
- **Response 400:** `{ "error": string }` if `fullText`, `location`, or
  `department` is missing — don't allow submitting an incomplete draft.

### `GET /api/track/:id`
- **Response 200:** `MockGrievanceRecord & { daysLeft: number }`
  (`daysLeft` computed from `slaDeadline` minus now, in whole days).
- **Response 404:** `{ "error": string }` if no record matches.

## Mock data layer

- In-memory store only (e.g. a `Map` keyed by registration id) — resets on
  server restart. This is intentional for a hackathon demo; note it clearly
  in code comments as the first thing to replace for anything beyond a
  demo.
- Registration id format: `SAA/{current year}/{6-digit random number}`.
- On submit, set `status: "Registered"`, `filedOn: now`, `slaDeadline: now + 21 days`.
- **Seed two demo records** so `/track` has something to show even before
  anyone files anything in the current session:
  - `SAA/2026/DEMO01` — a water-supply complaint, status "Pending with
    Nodal Officer," forwarded to a district water board, site visit
    expected.
  - `SAA/2026/DEMO02` — a delayed train-ticket refund, status "Disposed,"
    refund processed and credited.

## FAQ page content

`/faq` is static — no API call. Source its question/answer pairs from the
real rules already established in `product-spec.md`: the 21-day standard
redress window, the 30-day appeal deadline that opens only after a "Poor"
satisfaction rating, and the rule that a closed grievance can't be reopened
(a fresh one must be filed instead, referencing the old one). Write the
answers in the plain-language voice from `design.md`, not as a copy of
bureaucratic phrasing.

## Known gaps / good next tasks

- No streaming on `/api/chat` — replies wait for the full response.
  Streaming would make the chat feel faster if there's time to add it.
- No persistence beyond the in-memory store — everything resets on restart.
- No auth — not required for the mocked MVP, but flag clearly as a gap if
  this goes beyond demo use.
- The department list above is a demo-sized subset of CPGRAMS' real ~92 —
  expand only if the live demo needs a department that isn't listed.
- A searchable department/nodal-officer directory page (mirroring CPGRAMS'
  own directory) is a reasonable stretch page beyond the four core ones, if
  time allows — not required for the MVP demo.
