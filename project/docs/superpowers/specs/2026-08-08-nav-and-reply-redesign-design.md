# Navigation + Structured Reply Redesign

**Date:** 2026-08-08
**Status:** approved, ready for implementation planning

## Context

Papkram (formerly German Post Letter Reader) currently has no persistent
in-app navigation — each authenticated page (`/dashboard`, `/upload`,
`/letters/[id]`) only links back via a single "Back to dashboard" link in
the header. The letter detail page shows a single flowing summary, a
deadlines list, a risk-flags list, and a reply card with 4 fixed tone
buttons (Confirm, Ask for more time, Object, Ask a question first) that
regenerate the reply draft in place. There is no cross-letter deadline
view, no dedicated settings page, no sender information extracted from
letters, and no structured share/export step after a reply is drafted.

This spec covers four pieces of work, decomposed because they touch
different parts of the app:

1. Remove the "Take a photo" button from the upload form (trivial, bundled
   in, no design needed beyond "just remove it").
2. A persistent navigation shell for authenticated routes.
3. New Gemini-extracted fields (sender, reply subject, reply closing) and a
   reorganized "report bubble" analysis display.
4. A redesigned, guided reply flow, and a new share/export step.

**Explicitly out of scope** (confirmed with the user): PDF export of the
reply. This is already listed in `SPEC.md`'s `later_stages` backlog
("Reply PDF + Sending") and stays there — this spec does not pull it
forward. The share step covers `mailto:` + copy-to-clipboard only.

## 1. Navigation shell

**Layout:** a bottom tab bar on mobile, a left sidebar on desktop (same
responsive breakpoint the rest of the app already uses, `sm:`/`md:`).
Four items, in order: **History**, **Upload** (visually emphasized —
raised/accent-colored, like a center FAB on the mobile tab bar), **Deadlines**,
**Settings**.

**Where it appears:** every authenticated app route — `/dashboard` (History),
`/upload`, `/letters/[id]`, the new `/deadlines`, the new `/settings`. It does
**not** appear on the marketing site (`/`), `/login`, `/signup`, or
`/onboarding` (the mandatory first-run language picker — showing nav there
would let a user navigate away before completing a required step).

**Routing:** `/dashboard` keeps its URL (avoids touching
`success_url`/`cancel_url` in the Stripe checkout route and the webhook's
existing assumptions) — the nav tab is simply labeled "History" while
linking to `/dashboard`. `/deadlines` and `/settings` are new routes.

**Component shape:** a new `AppNav` component (client component, needs
`usePathname()` to highlight the active tab), rendered from a shared
authenticated-layout wrapper rather than duplicated per-page. Given every
authenticated page currently renders `<AppHeader>` itself, the cleanest fix
is a route group layout — `src/app/(app)/layout.tsx` wrapping
dashboard/upload/letters/deadlines/settings — that renders `AppHeader` +
`{children}` + `AppNav` once, instead of each page composing them
individually. This is a structural refactor of existing pages (moving them
into a route group) alongside the new nav, not just an addition.

## 2. New data: Deadlines page

`/deadlines` is a new Server Component page. It fetches
`select id, summary, deadlines from letters where user_id = X`, flattens
every letter's `deadlines` array into one list of
`{ date, description, letterId, letterSummary }`, sorts by date ascending,
and renders it as a single chronological list (reusing the existing
deadline-chip visual style from the letter detail page). Each row links to
`/letters/{letterId}#deadlines`. Empty state: "No deadlines yet" (reuses
the existing `EmptyState` component). No new database columns — this is a
read/reshape of data that already exists.

## 3. New data: Settings page

`/settings` is a new page consolidating account controls that currently
live in two places (header language switcher, dashboard subscription
banner):

- Language preference (moves the existing `LanguageSwitcher` here from
  `AppHeader`; `AppHeader` drops its own switcher)
- Subscription status + the existing "Manage subscription" /
  Customer-Portal link (moves here from the dashboard banner)
- Log out (moves here from `AppHeader`)

Account deletion is **not** added as a new self-service feature in this
spec — it stays support-based (contact `hello@germanpostreader.app`),
matching the current Privacy Policy text. Adding self-service deletion
(cascading letter/storage cleanup, Stripe cancellation, Supabase auth user
deletion) is a real, separate feature the user didn't ask for; flagging it
here as a candidate for its own future spec rather than quietly bundling it
in.

## 4. Gemini schema additions

Three new pieces of structured output, added to the existing
`responseSchema` in `analyzeDocument()` (`lib/gemini/analyze-letter.ts`),
generated once at initial analysis time — not regenerated when the reply
tone changes later:

```
sender: {
  name: string
  organization: string | null
  address: string | null
  email: string | null
}
reply_subject: string
reply_closing: string   // e.g. "Mit freundlichen Grüßen,\n[Your name]"
```

`sender.email`/`sender.address` will frequently be `null` — German
institutional letters mostly expect a physical reply, not email. The UI
must handle these as genuinely absent, not render empty strings.

**Database:** a new migration adds `sender` (jsonb, matching the existing
`deadlines`/`risk_flags` jsonb-array convention), `reply_subject` (text),
`reply_closing` (text) to the `letters` table.

**`[Your name]` placeholder:** the app doesn't collect a real user name
today. `reply_closing` always contains the literal placeholder text; the
user is expected to replace it themselves before sending (same trust model
as the rest of the reply draft — nothing is auto-sent).

## 5. Analysis display — report bubbles

The letter detail page's summary section is reorganized from one flowing
block into separate labeled cards, reusing the existing card visual style
(`border-2 border-border bg-card shadow-[4px_4px_0_0_var(--border)]`) —
this is a layout/composition change, not a new visual language:

- **Sender** card — name, organization, address, email (each line omitted
  if null; if the whole sender object is unusably empty, the card itself is
  omitted)
- **Summary** card — unchanged content, existing card
- **Deadlines** card — unchanged content (list), existing card
- **Worth checking** card — unchanged content (risk flags), existing card,
  only rendered if risk flags exist (already the current behavior)

## 6. Reply flow redesign

Replaces `ReplyDraftCard`'s current 4-button tone picker
(`REPLY_TONE_LABELS`: confirm / request_time / object / clarify) with:

- **Confirm** — same as today's "confirm" tone
- **Deny** — same intent as today's "object" tone (renamed for clarity)
- **Ask for time** — reveals a weeks selector (1–8 weeks, dropdown) before
  regenerating; the chosen duration is passed to Gemini and must appear
  explicitly in the generated reply text (e.g. "I am requesting a 3-week
  extension")
- **Write your own** — reveals a textarea; the user describes their
  response in plain language in their own language, and this free text is
  sent to Gemini (alongside the letter's summary/deadlines/risk_flags, same
  as the existing tone-based regeneration) with an instruction to draft a
  formal, ready-to-send German reply reflecting that intent

Today's 4th tone, "clarify" (ask a question first), is dropped as a fixed
button — that intent is now expressed through "Write your own" instead
(e.g. the user types "ask them what the deadline extension actually
covers"). `REPLY_TONE_LABELS`/`REPLY_TONE_INSTRUCTIONS` in
`lib/letters/types.ts` lose the `clarify` entry.

All four paths call the same underlying regenerate action with a
discriminated payload instead of a fixed tone enum:

```
{ mode: "confirm" }
{ mode: "deny" }
{ mode: "ask_for_time"; weeks: number }
{ mode: "freeform"; userText: string }
```

`regenerateReplyDraft()` (`lib/gemini/analyze-letter.ts`) and the
`regenerateReply()` server action (`letters/[id]/actions.ts`) both need
their signatures updated to accept this payload shape instead of
`ReplyTone`. `reply_subject`/`reply_closing` are **not** touched by
regeneration — they stay from the initial analysis, since they're
tone-independent boilerplate tied to the original letter, not the reply's
stance.

An initial reply draft still auto-generates during the very first
analysis (as today), using a sensible default (`confirm`) — so the Share
section is never empty on first load. Picking any of the four options
above simply regenerates it in place, exactly like today's tone buttons do.

## 7. Share/export section

A new card on the letter detail page, below the reply card, visible
whenever a reply draft exists (i.e., always, per the point above):

- **"Send via email" button** — builds a `mailto:` link:
  `mailto:{sender.email}?subject={reply_subject}&body={reply_draft}\n\n{reply_closing}`,
  URL-encoded. If `sender.email` is null, the `mailto:` link omits the
  recipient (opens the mail app with subject/body filled, recipient blank)
  rather than being disabled — still saves the user re-typing everything.
- **Four separate copy buttons** — recipient email, subject, body,
  closing — each copies just that one field, reusing the existing
  copy-button pattern (`CopyReplyButton`, generalized to take a label +
  text instead of being reply-body-specific).
- No PDF button (deferred, see Context).

## Error handling

- Sender/subject/closing extraction failures: if Gemini returns
  `null`/empty for a field it's allowed to omit (email, address), that's
  not an error — handled as absent data in the UI. If Gemini fails to
  return `reply_subject`/`reply_closing` at all (should be required by the
  schema), that's the same "Analysis failed" error path the pipeline
  already has for malformed responses — no new error UI needed.
- Free-text reply generation failure (empty input, Gemini error): same
  `toast.error(result.error.message)` pattern the existing tone buttons
  use; the textarea keeps the user's typed text so they don't lose it.
- Weeks selector: constrained to a fixed 1–8 dropdown, so there's no
  invalid-input state to handle.

## Testing / verification plan

- Typecheck + production build after each phase (nav shell, schema +
  migration, display redesign, reply flow, share section).
- Screenshot-verify the new `/deadlines` and `/settings` pages in all three
  languages (EN/AR/TR) at 375px and 1440px, both empty and populated
  states, following the same pattern used for every other page this
  session.
- A real end-to-end pass with a throwaway test account: upload a letter (or
  seed one directly), confirm sender/subject/closing appear, regenerate the
  reply via all 4 modes including a real weeks value, confirm the
  `mailto:` link and all 4 copy buttons produce correct values, confirm
  everything renders correctly RTL in Arabic.
- Run `/design-review` on the redesigned letter detail page and the two new
  pages before considering this done, per CLAUDE.md's design-review gate.

## Migration / rollout notes

This changes the `letters` table schema (additive columns, safe migration)
and changes two function signatures
(`regenerateReplyDraft`/`regenerateReply`) that are internal to this
codebase (no external API consumers) — no backward-compatibility shim
needed. Existing letters in the database will have `sender: null`,
`reply_subject: null`, `reply_closing: null` after the migration (analyzed
before this feature existed) — the Sender card and share fields must
handle that gracefully (omit the Sender card, leave subject/closing blank
in the share fields) rather than assuming every row has these fields
populated.
