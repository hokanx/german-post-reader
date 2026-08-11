# Dashboard, letter-detail citations, and reply wizard redesign

Status: approved by user (2026-08-11)

## Context

A design handoff (six mockup screens) was provided for a UI redesign: a
deadline-first Dashboard, a restructured "answer-first" letter-detail screen
with per-fact source citations, a 3-step guided reply wizard, a printable
letter PDF preview, a month-grouped Deadlines timeline, and a Settings
screen.

Two of the six mockup screens conflict with locked v1 scope in
[`CLAUDE.md`](../../../CLAUDE.md) ("v1 does NOT include PDF export of reply
drafts, calendar sync, or team/family seats"). The mockups also implied two
schema-level product decisions (a Yes/No "action required" signal per
letter, and per-claim source quotes) that aren't in today's `LetterAnalysis`
shape, and a reply flow that's a real interaction change, not just a
reskin (today: pick a tone, get a redrafted reply immediately; mockup: pick
a tone, answer a follow-up question, then get the reply).

These were resolved with the user via clarifying questions before this doc
was written; the resolutions are captured as decisions below.

## Decisions

1. **Scope conflicts (PDF preview, calendar sync, family seats): cut, not
   deferred-with-a-flag.** These mockup sections are dropped from this
   project entirely. Redirect to the `later_stages` backlog per CLAUDE.md's
   existing scope-guardrail language — no half-built entry points, no
   greyed-out buttons pointing at them.
2. **Reply flow: new 3-step wizard**, replacing today's single-step tone
   picker in [`reply-draft-card.tsx`](../../../src/app/(app)/letters/[id]/reply-draft-card.tsx).
   Step 2 (the follow-up question) uses a **fixed template per intent**,
   not an AI-generated free-form question — the AI is not asked to decide
   what to ask; the app decides, and fills in letter-specific details
   (e.g. suggested dates) from data already on the letter.
3. **"Action required" signal: new AI-returned boolean field**
   (`action_required`), not derived client-side from existing fields —
   Gemini already reasons over the letter's content and is best placed to
   judge this.
4. **Source citations: a new `key_facts` array**, each entry pairing a
   plain-language fact with its own German source quote — matching the
   mockup's "Where this comes from" section exactly, not a lighter
   citations-on-deadlines-only alternative.
5. **"Your address" Settings field: dropped.** It existed in the mockups
   solely to feed the (now-cut) PDF letterhead. No such field or backend
   support exists today, and nothing else in this design consumes it.
6. **"Send by email" in the wizard's final step: a `mailto:` link**, not a
   send-on-the-user's-behalf feature — opens the user's own mail client
   with the reply pre-filled. No email-sending infrastructure is added.

## Data model

New migration, `0004_key_facts_and_action_required.sql`, following the
additive-with-explanatory-comment pattern from
[`0002_bilingual_reply_and_lifetime_access.sql`](../../../supabase/migrations/0002_bilingual_reply_and_lifetime_access.sql):

```sql
alter table public.letters add column key_facts jsonb not null default '[]'::jsonb;
alter table public.letters add column action_required boolean not null default false;
```

`key_facts` shape: `{ label: string; value: string; source_quote: string }[]`.
Example: `{ label: "Amount owed", value: "142,60 €", source_quote: "Nachzahlung: 142,60 €" }`.
`source_quote` is always the original German text from the letter, regardless
of the user's chosen language — this is what powers "Where this comes from."

Both columns get a default so existing rows don't need a backfill;
`key_facts` empty array / `action_required` false is a safe default for a
letter analyzed under the old schema.

## AI pipeline

`RESPONSE_SCHEMA` and `buildSystemInstruction()` in
[`analyze-letter.ts`](../../../src/lib/gemini/analyze-letter.ts) gain two
required fields, documented to Gemini the same way `risk_flags` already is
(plain language, empty array/false if nothing applies):

- `action_required: boolean` — true if the recipient must do something
  (pay, respond, submit a document, appear somewhere) by a deadline or in
  general; false for purely informational letters.
- `key_facts: { label, value, source_quote }[]` — the concrete facts a
  reader would want backed by the original text (amounts, dates, reference
  numbers, names) — not a duplicate of `deadlines`, which stays focused on
  dates specifically.

`LetterAnalysis` in [`types.ts`](../../../src/lib/letters/types.ts) gains
matching fields. This is a deliberate, user-approved extension of the
CLAUDE.md AI-pipeline rule that lists the "exact keys" the analysis action
must return — CLAUDE.md should be updated to include these two keys once
this ships, so the rule stays accurate.

**No new Gemini call is added for the wizard's step 2.** The follow-up
question and its answer options are computed in application code from data
already on the letter row (the existing `deadlines` array), not generated
by the model. Only step 3 (generating the actual reply) calls Gemini, reusing
the existing `regenerateReplyDraft` function with one new optional
parameter — the user's step-2 answer — threaded into the prompt exactly the
way `tone` already is today. The `regenerateReply` server action in
[`actions.ts`](../../../src/app/(app)/letters/[id]/actions.ts) passes this
parameter through; no new server action is needed.

## Reply wizard (screen 2c)

Client-side stepper embedded in the letter-detail page (not a new route),
replacing `reply-draft-card.tsx`'s current always-visible tone-button-row +
inline draft.

- **Step 1 — Intent.** The same four tones that exist today
  (`confirm` / `request_time` / `object` / `clarify`, from
  `REPLY_TONE_LABELS`). No new taxonomy.
- **Step 2 — Follow-up (fixed template per intent).**
  - `confirm` — skipped entirely; nothing to ask, goes straight to step 3.
  - `request_time` — "When can you do this by?" Options are computed from
    the letter's own deadline (+1 month, +2 months, "in instalments"), plus
    a custom date picker.
  - `object` — "What's incorrect?" — free-text.
  - `clarify` — "What do you want to ask?" — free-text.
- **Step 3 — Reply.** Bilingual reply card (German original + translation,
  same toggle UX as today), Copy button (existing `CopyReplyButton`), an
  "Edit answer" action that reopens step 2, and "Send by email" as a
  `mailto:` link with the reply body pre-filled. No PDF button.

## Screen-by-screen

- **Dashboard** ([`letter-list.tsx`](../../../src/app/(app)/dashboard/letter-list.tsx)):
  a new hero "Next up" card is added above the list, promoting the single
  soonest deadline across *all* of the user's letters (computed the same
  way the existing per-row `soonestDeadline()` already computes a single
  letter's soonest deadline, just run once across the full letter set).
  Each letter row keeps its existing per-card deadline pill (unchanged) and
  additionally gets a new Action-required / No-action-needed pill sourced
  from `action_required`.
- **Letter detail**: a hero band showing amount + due date when
  `action_required` is true, a calmer variant otherwise. The existing
  summary paragraph is unchanged. A new "Where this comes from" section
  renders `key_facts` below it. The existing `risk_flags` warning box keeps
  its data, restyled to match. The reply section becomes the wizard's entry
  point instead of showing tone buttons and a draft inline immediately.
- **Reply wizard**: see above.
- **Letter PDF preview**: not built. Cut per decision 1.
- **Deadlines** ([`deadlines/page.tsx`](../../../src/app/(app)/deadlines/page.tsx)):
  same data source (`flattenAndSortDeadlines`), grouped by month for
  display — ISO-dated deadlines group by their `YYYY-MM`, non-ISO
  (free-text) deadlines keep appending after all dated groups in their
  existing relative order, matching the sort function's existing
  ISO-first/non-ISO-after behavior. No calendar-sync row.
- **Settings** ([`settings/page.tsx`](../../../src/app/(app)/settings/page.tsx)):
  visual restyle only — language, subscription, and account/logout
  sections stay as they are today. No calendar-sync toggle, no family-plan
  row, no address field.

## Out of scope (explicitly, redirect to later_stages backlog)

- Letter reply PDF export / printable letter preview (mockup screen 2d).
- Calendar sync.
- Team / family seats.
- Free-form AI-generated follow-up questions in the reply wizard (fixed
  templates only, per decision 2).
- Sending email on the user's behalf (the wizard only opens a `mailto:`
  link, per decision 6).
