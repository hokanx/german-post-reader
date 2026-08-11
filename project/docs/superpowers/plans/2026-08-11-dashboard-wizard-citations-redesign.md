# Dashboard, Letter-Detail Citations, and Reply Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the deadline-first Dashboard, sourced-citation letter-detail view, and 3-step reply wizard from the approved design spec, backed by two new Gemini-returned fields (`key_facts`, `action_required`).

**Architecture:** Two new nullable-free `jsonb`/`boolean` columns on `letters`, surfaced by extending the existing Gemini `RESPONSE_SCHEMA` (no new AI call is added anywhere). Two new pure, unit-tested helper modules (`group-deadlines-by-month.ts`, `reply-wizard.ts`) drive the only two pieces of new client-side logic; everything else is presentational Server/Client Component work following the file/section patterns already in `src/app/(app)/`.

**Tech Stack:** Next.js App Router, Supabase (Postgres + RLS), Google Gemini (`gemini-flash-latest`) via `@google/genai`, Tailwind + shadcn/ui with the project's locked OKLCH tokens, Framer Motion (reduced-motion gated), `tsx` for pure-logic scripts (this repo's existing lightweight test convention — see `src/lib/letters/flatten-deadlines.test.ts`).

## Global Constraints

- Design tokens (fonts, OKLCH colors, radii, shadow/border/chip styles) are locked in `design-system/MASTER.md` — never invent new ones. Every color resolves through a semantic token (`bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `bg-muted`, `bg-accent`, `border-border`, `bg-destructive`) — never a raw Tailwind color class or hex.
- Lucide icons only, `strokeWidth={1.5}`, sizes `size-4`/`size-5` only. Icon-only buttons need `aria-label`.
- Every interactive element styles hover, focus-visible (`focus-visible:ring-2 focus-visible:ring-ring`), active, and disabled. Touch targets ≥ 44px on mobile.
- Arabic (`ar`) renders `dir="rtl"`; Turkish (`tr`) and English (`en`) are `dir="ltr"`. Every new UI piece that shows user-language text must set `dir` correctly — check on every step that touches `letters`/`dashboard`/`deadlines` copy.
- `FREE_LETTER_LIMIT` (4) and `SUBSCRIPTION_PRICE_EUR` ("5.99") live only in `src/lib/constants.ts` — never hardcoded elsewhere. Not touched by this plan, but don't reintroduce a duplicate literal anywhere new code reads pricing/limits.
- Data-access functions return the typed `Result<T>` envelope (`src/lib/result.ts`) — never a raw throw to the UI.
- Every data-backed route keeps its `loading.tsx` / `error.tsx` / `not-found.tsx` trio (`src/app/(app)/letters/[id]/` and `src/app/(app)/dashboard/` already have these — don't remove them; no new routes are added by this plan).
- `reply_draft` is always German; `reply_draft_translation` is always that same reply in the user's chosen language; `summary`, `deadlines`, `risk_flags` (and the new `key_facts`) are always in the user's chosen language, except each `key_facts[].source_quote`, which is always the original German text.
- This plan deliberately extends the AI-pipeline "exact keys" rule in root `CLAUDE.md` with two new required keys (`key_facts`, `action_required`) — approved by the user in the design spec (`docs/superpowers/specs/2026-08-11-dashboard-wizard-citations-redesign-design.md`). Task 12 updates `CLAUDE.md` to keep that rule accurate.
- Verification-before-completion: every task's verification step must actually be run and its real output quoted/observed before checking the step off — never "should work."

---

### Task 1: Migration — `key_facts` and `action_required` columns

**Files:**
- Create: `supabase/migrations/0004_key_facts_and_action_required.sql`

**Interfaces:**
- Produces: `public.letters.key_facts` (`jsonb`, not null, default `'[]'`), `public.letters.action_required` (`boolean`, not null, default `false`) — consumed by every later task that reads or writes a `letters` row.

- [ ] **Step 1: Write the migration file**

```sql
-- Adds the two fields the redesigned letter-detail and dashboard screens need:
-- key_facts powers the "Where this comes from" citation list (each fact paired
-- with its own German source quote), action_required powers the dashboard's
-- Action-needed / No-action pill. Both default so existing rows analyzed under
-- the old schema remain valid (empty citations, no action flagged) rather than
-- needing a backfill.
alter table public.letters add column key_facts jsonb not null default '[]'::jsonb;
alter table public.letters add column action_required boolean not null default false;
```

- [ ] **Step 2: Apply the migration**

Run via the `mcp__supabase__execute_sql` tool against the project, pasting the SQL body above (or via `supabase db push` if a local Postgres is running — check `supabase/config.toml` for the active project ref first).

- [ ] **Step 3: Verify the columns exist with the right defaults**

Run: `mcp__supabase__execute_sql` with:
```sql
select column_name, data_type, column_default, is_nullable
from information_schema.columns
where table_name = 'letters' and column_name in ('key_facts', 'action_required');
```
Expected: two rows — `key_facts` / `jsonb` / `'[]'::jsonb` / `NO`, and `action_required` / `boolean` / `false` / `NO`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0004_key_facts_and_action_required.sql
git commit -m "feat: add key_facts and action_required columns to letters"
```

---

### Task 2: Extend the Gemini schema and `LetterAnalysis` type

**Files:**
- Modify: `src/lib/letters/types.ts`
- Modify: `src/lib/gemini/analyze-letter.ts:14-79` (`RESPONSE_SCHEMA`, `buildSystemInstruction`)
- Test: `src/lib/gemini/verify-key-facts-schema.ts` (throwaway verification script, deleted at the end of this task — see Step 4)

**Interfaces:**
- Consumes: `Type` from `@google/genai` (already imported in `analyze-letter.ts`).
- Produces: `LetterAnalysis.key_facts: { label: string; value: string; source_quote: string }[]`, `LetterAnalysis.action_required: boolean` — consumed by Task 4 (upload insert), Task 8 (letter-detail render), Task 7 (dashboard pill).

- [ ] **Step 1: Extend the `LetterAnalysis` type**

In `src/lib/letters/types.ts`, add after `deadlines`:

```ts
export type LetterAnalysis = {
  summary: string;
  deadlines: { date: string; description: string }[];
  /** Concrete facts (amounts, dates, reference numbers) each backed by their original German wording. */
  key_facts: { label: string; value: string; source_quote: string }[];
  /** True if the recipient must do something (pay, respond, submit, appear) — false for purely informational letters. */
  action_required: boolean;
  /** Always German — this is the text that actually gets sent to the German recipient. */
  reply_draft: string;
  /** The reply_draft's meaning, translated into the user's chosen language, so they know what they're sending. */
  reply_draft_translation: string;
  detected_language_confirmed: boolean;
  risk_flags: string[];
};
```

- [ ] **Step 2: Extend `RESPONSE_SCHEMA` and `buildSystemInstruction`**

In `src/lib/gemini/analyze-letter.ts`, add to `RESPONSE_SCHEMA.properties` (after `deadlines`, before `reply_draft`):

```ts
    key_facts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "Short plain-language name for the fact, e.g. 'Amount owed' or 'Reference number'." },
          value: { type: Type.STRING, description: "The fact's value as the reader should see it, e.g. '142,60 €'." },
          source_quote: { type: Type.STRING, description: "The exact original German text this fact was read from, verbatim from the letter." },
        },
        required: ["label", "value", "source_quote"],
        propertyOrdering: ["label", "value", "source_quote"],
      },
      description: "Concrete facts worth backing with the original text — amounts, dates, reference numbers, names. Empty array if the letter has no such facts. Do not duplicate the deadlines list; key_facts is for facts, deadlines is for dates to act by.",
    },
    action_required: {
      type: Type.BOOLEAN,
      description: "True if the recipient must do something (pay, respond, submit a document, appear somewhere), by a deadline or in general. False for purely informational letters.",
    },
```

and to both `required` and `propertyOrdering` arrays, inserted after `"deadlines"`:

```ts
  required: [
    "summary",
    "deadlines",
    "key_facts",
    "action_required",
    "reply_draft",
    "reply_draft_translation",
    "detected_language_confirmed",
    "risk_flags",
  ],
  propertyOrdering: [
    "summary",
    "deadlines",
    "key_facts",
    "action_required",
    "reply_draft",
    "reply_draft_translation",
    "detected_language_confirmed",
    "risk_flags",
  ],
```

Then in `buildSystemInstruction`, add two new bullets to the `Rules:` list (after the `deadlines:` bullet):

```
- key_facts: pull out concrete facts worth backing with the original text — amounts, dates, reference numbers, names. Each fact needs label and value written in ${LANGUAGE_NAMES[language]}, plus source_quote copied verbatim in the ORIGINAL GERMAN regardless of target language, so the reader can see exactly what the letter said. Empty array if there's nothing worth citing this way. Don't duplicate deadlines here.
- action_required: true if the recipient must do something (pay, respond, submit, appear) by a deadline or in general; false for purely informational letters.
```

- [ ] **Step 3: Write and run a live verification script**

Create `src/lib/gemini/verify-key-facts-schema.ts`:

```ts
import path from "node:path";
import fs from "node:fs";
process.loadEnvFile(path.resolve(__dirname, "../../../.env.local"));

import { analyzeDocument } from "./analyze-letter";

async function main() {
  const bytes = fs.readFileSync(path.resolve(__dirname, "../../../tests/fixtures/big-photo.jpg"));
  const result = await analyzeDocument(bytes, "image/jpeg", "en");

  if (!result.ok) {
    console.error("FAIL: analysis did not succeed:", result.error);
    process.exitCode = 1;
    return;
  }

  const { key_facts, action_required } = result.data;
  console.log("key_facts:", JSON.stringify(key_facts, null, 2));
  console.log("action_required:", action_required);

  if (!Array.isArray(key_facts)) {
    console.error("FAIL: key_facts is not an array");
    process.exitCode = 1;
  } else if (key_facts.some((f) => typeof f.label !== "string" || typeof f.value !== "string" || typeof f.source_quote !== "string")) {
    console.error("FAIL: a key_facts entry is missing label/value/source_quote");
    process.exitCode = 1;
  } else {
    console.log("PASS: key_facts shape is correct");
  }

  if (typeof action_required !== "boolean") {
    console.error("FAIL: action_required is not a boolean");
    process.exitCode = 1;
  } else {
    console.log("PASS: action_required is a boolean");
  }
}

main();
```

Run: `npx tsx src/lib/gemini/verify-key-facts-schema.ts`
Expected: both `PASS` lines printed, at least one `key_facts` entry with a non-empty `source_quote` (the fixture is a real letter photo with a Euro amount on it), exit code 0.

- [ ] **Step 4: Delete the throwaway verification script**

```bash
rm src/lib/gemini/verify-key-facts-schema.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/letters/types.ts src/lib/gemini/analyze-letter.ts
git commit -m "feat: extend Gemini analysis schema with key_facts and action_required"
```

---

### Task 3: Thread the wizard's `answer` into reply regeneration

**Files:**
- Modify: `src/lib/gemini/analyze-letter.ts:200-240` (`regenerateReplyDraft`)
- Modify: `src/app/(app)/letters/[id]/actions.ts` (`regenerateReply`)

**Interfaces:**
- Consumes: `Result<ReplyDraft>` type (unchanged), `REPLY_TONE_INSTRUCTIONS[tone]` (unchanged).
- Produces: `regenerateReplyDraft(letter, tone, language, answer?: string)`, `regenerateReply(letterId, tone, answer?: string)` — consumed by Task 9 (reply wizard component).

- [ ] **Step 1: Add the `answer` parameter to `regenerateReplyDraft`**

In `src/lib/gemini/analyze-letter.ts`, change the signature and context-building:

```ts
export async function regenerateReplyDraft(
  letter: { summary: string; deadlines: { date: string; description: string }[]; riskFlags: string[] },
  tone: ReplyTone,
  language: AppLanguage,
  answer?: string,
): Promise<Result<ReplyDraft>> {
  try {
    const ai = createGeminiClient();
    const context = [
      `Letter summary: ${letter.summary}`,
      letter.deadlines.length > 0
        ? `Deadlines: ${letter.deadlines.map((d) => `${d.date} — ${d.description}`).join("; ")}`
        : "Deadlines: none",
      letter.riskFlags.length > 0 ? `Uncertain points: ${letter.riskFlags.join("; ")}` : "Uncertain points: none",
      answer ? `The user's answer to work into the reply: ${answer}` : null,
    ].filter((line): line is string => line !== null).join("\n");
```

(Leave the rest of the function body unchanged — `context` is already interpolated into the same prompt string below it.)

- [ ] **Step 2: Thread `answer` through the server action**

In `src/app/(app)/letters/[id]/actions.ts`, change the signature and pass-through:

```ts
export async function regenerateReply(
  letterId: string,
  tone: ReplyTone,
  answer?: string,
): Promise<Result<{ reply_draft: string; reply_draft_translation: string }>> {
```

and update the call site:

```ts
  const result = await regenerateReplyDraft(
    {
      summary: letter.summary ?? "",
      deadlines: (letter.deadlines ?? []) as Deadline[],
      riskFlags: (letter.risk_flags ?? []) as string[],
    },
    tone,
    language,
    answer,
  );
```

- [ ] **Step 3: Verify with a live call**

Run: `npx tsx -e "
process.loadEnvFile('.env.local');
import('./src/lib/gemini/analyze-letter').then(async ({ regenerateReplyDraft }) => {
  const result = await regenerateReplyDraft(
    { summary: 'Electricity bill, 187,42 EUR owed, due 2026-02-28.', deadlines: [{ date: '2026-02-28', description: 'Pay balance' }], riskFlags: [] },
    'request_time',
    'en',
    'I can do this by 2026-04-01.',
  );
  console.log(JSON.stringify(result, null, 2));
});
"`

Expected: `ok: true`, and `reply_draft` (German) contains a date/commitment consistent with early April 2026 rather than the original Feb 28 deadline — confirms the answer is actually influencing the generated text, not just being silently accepted.

- [ ] **Step 4: Commit**

```bash
git add src/lib/gemini/analyze-letter.ts src/app/\(app\)/letters/\[id\]/actions.ts
git commit -m "feat: thread wizard follow-up answer into reply regeneration"
```

---

### Task 4: Persist `key_facts` and `action_required` on upload

**Files:**
- Modify: `src/app/(app)/upload/actions.ts`

**Interfaces:**
- Consumes: `LetterAnalysis.key_facts` / `.action_required` (Task 2).
- Produces: `letters.key_facts` / `letters.action_required` populated on every new upload — consumed by Task 7/8's `select()` calls.

- [ ] **Step 1: Add the two fields to the insert**

In the `service.from("letters").insert({...})` call, add after `deadlines: analysis.deadlines,`:

```ts
    key_facts: analysis.key_facts,
    action_required: analysis.action_required,
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Verify end-to-end with a real upload**

Start the dev server (`npm run dev`), open the app in a browser (chrome-devtools MCP), log in as the seeded demo account (`demo@germanpostreader.app` / `DemoAccount123!` — see `src/lib/seed/seed.ts`), upload `tests/fixtures/big-photo.jpg` from `/upload`, then query the new row:

Run (via `mcp__supabase__execute_sql`):
```sql
select id, key_facts, action_required from public.letters order by created_at desc limit 1;
```
Expected: `key_facts` is a non-empty JSON array with `label`/`value`/`source_quote` per entry, `action_required` is `true` or `false` (not null).

- [ ] **Step 4: Commit**

```bash
git add src/app/\(app\)/upload/actions.ts
git commit -m "feat: persist key_facts and action_required on letter upload"
```

---

### Task 5: Pure helpers — date formatting and reply-wizard logic (TDD)

**Files:**
- Create: `src/lib/format-date.ts`
- Create: `src/lib/letters/reply-wizard.ts`
- Test: `src/lib/letters/reply-wizard.test.ts`
- Modify: `src/app/(app)/dashboard/letter-list.tsx:21-27` (switch to the shared formatter)

**Interfaces:**
- Produces: `formatDate(iso: string, language: AppLanguage): string`, `computeRequestTimeOptions(baseDeadlineIso: string | null): { id: "plus_one_month" | "plus_two_months" | "instalments"; date: string | null }[]`, `buildMailtoUrl(body: string, subject: string): string` — consumed by Task 9 (reply wizard component) and Task 7/8 (date display).

- [ ] **Step 1: Extract the shared date formatter**

Create `src/lib/format-date.ts`:

```ts
import type { AppLanguage } from "@/lib/letters/types";

const DATE_LOCALES: Record<AppLanguage, string> = { en: "en-GB", ar: "ar-EG", tr: "tr-TR" };

/** Formats an ISO date for display; returns the raw string unchanged if it isn't a parseable date (e.g. free-text German deadlines like "innerhalb von 14 Tagen"). */
export function formatDate(iso: string, language: AppLanguage): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(DATE_LOCALES[language], { day: "2-digit", month: "short", year: "numeric" });
}
```

In `src/app/(app)/dashboard/letter-list.tsx`, remove the local `DATE_LOCALES` constant and `formatDate` function (lines 21-27), and add:

```ts
import { formatDate } from "@/lib/format-date";
```

- [ ] **Step 2: Write the failing test for `reply-wizard.ts`**

Create `src/lib/letters/reply-wizard.test.ts`:

```ts
import { computeRequestTimeOptions, buildMailtoUrl } from "./reply-wizard";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

// computeRequestTimeOptions
assert(computeRequestTimeOptions(null).length === 0, "null base deadline yields no options");
assert(computeRequestTimeOptions("innerhalb von 14 Tagen").length === 0, "non-ISO base deadline yields no options");

const options = computeRequestTimeOptions("2026-02-28");
assert(options.length === 3, "valid ISO base deadline yields 3 options");
assert(options[0].id === "plus_one_month" && options[0].date === "2026-03-28", "plus_one_month adds one calendar month");
assert(options[1].id === "plus_two_months" && options[1].date === "2026-04-28", "plus_two_months adds two calendar months");
assert(options[2].id === "instalments" && options[2].date === null, "instalments has no specific date");

const decemberOptions = computeRequestTimeOptions("2026-12-15");
assert(decemberOptions[0].date === "2027-01-15", "plus_one_month rolls over into the next year correctly");
assert(decemberOptions[1].date === "2027-02-15", "plus_two_months rolls over into the next year correctly");

// buildMailtoUrl
const url = buildMailtoUrl("Line one\nLine two & more", "My reply");
assert(url.startsWith("mailto:?"), "mailto URL has no recipient, just query params");
assert(url.includes("subject=My%20reply"), "subject is URL-encoded");
assert(url.includes("body=Line%20one%0ALine%20two%20%26%20more"), "body newlines and special characters are URL-encoded");
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx tsx src/lib/letters/reply-wizard.test.ts`
Expected: fails with a module-not-found error (`reply-wizard.ts` doesn't exist yet).

- [ ] **Step 4: Implement `reply-wizard.ts`**

```ts
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type RequestTimeOptionId = "plus_one_month" | "plus_two_months" | "instalments";
export type RequestTimeOption = { id: RequestTimeOptionId; date: string | null };

/**
 * The wizard's request_time step offers dates relative to the letter's own
 * deadline rather than asking Gemini to invent one — the app decides what
 * to ask, Gemini only drafts the final reply text (see design spec decision 2).
 */
export function computeRequestTimeOptions(baseDeadlineIso: string | null): RequestTimeOption[] {
  if (!baseDeadlineIso || !ISO_DATE_RE.test(baseDeadlineIso)) return [];

  const base = new Date(`${baseDeadlineIso}T00:00:00Z`);
  const addMonths = (n: number) => {
    const d = new Date(base);
    d.setUTCMonth(d.getUTCMonth() + n);
    return d.toISOString().slice(0, 10);
  };

  return [
    { id: "plus_one_month", date: addMonths(1) },
    { id: "plus_two_months", date: addMonths(2) },
    { id: "instalments", date: null },
  ];
}

/** Opens the user's own mail client with the reply pre-filled — no send-on-behalf-of infrastructure (design spec decision 6). */
export function buildMailtoUrl(body: string, subject: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx tsx src/lib/letters/reply-wizard.test.ts`
Expected: every line prints `PASS`, exit code 0.

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors (confirms the `letter-list.tsx` formatter swap didn't break anything).

- [ ] **Step 7: Commit**

```bash
git add src/lib/format-date.ts src/lib/letters/reply-wizard.ts src/lib/letters/reply-wizard.test.ts src/app/\(app\)/dashboard/letter-list.tsx
git commit -m "feat: add shared date formatter and reply-wizard pure helpers"
```

---

### Task 6: Pure helper — group deadlines by month (TDD)

**Files:**
- Create: `src/lib/letters/group-deadlines-by-month.ts`
- Test: `src/lib/letters/group-deadlines-by-month.test.ts`

**Interfaces:**
- Consumes: `FlatDeadline` type from `src/lib/letters/flatten-deadlines.ts`.
- Produces: `groupDeadlinesByMonth(deadlines: FlatDeadline[], locale: string, undatedLabel: string): { key: string; label: string; deadlines: FlatDeadline[] }[]` — consumed by Task 10 (deadlines page).

- [ ] **Step 1: Write the failing test**

Create `src/lib/letters/group-deadlines-by-month.test.ts`:

```ts
import { groupDeadlinesByMonth } from "./group-deadlines-by-month";
import type { FlatDeadline } from "./flatten-deadlines";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

const deadlines: FlatDeadline[] = [
  { date: "2026-01-10", description: "Confirm renewal", letterId: "b", letterSummary: "Insurance renewal" },
  { date: "2026-01-25", description: "Second January item", letterId: "e", letterSummary: "Another letter" },
  { date: "2026-03-15", description: "Pay balance", letterId: "a", letterSummary: "Electricity bill" },
  { date: "innerhalb von 14 Tagen", description: "Respond to notice", letterId: "c", letterSummary: "Some notice" },
];

const groups = groupDeadlinesByMonth(deadlines, "en-GB", "No fixed date");

assert(groups.length === 3, "produces 3 groups: Jan, Mar, and undated");
assert(groups[0].key === "2026-01" && groups[0].deadlines.length === 2, "January group has both January deadlines, in order");
assert(groups[1].key === "2026-03" && groups[1].deadlines.length === 1, "March group has the one March deadline");
assert(groups[1].label === "March 2026", "month label is formatted via Intl.DateTimeFormat");
assert(groups[2].key === "undated" && groups[2].label === "No fixed date", "non-ISO deadlines land in a final undated group with the given label");

const decJanGroups = groupDeadlinesByMonth(
  [
    { date: "2025-12-20", description: "December item", letterId: "x", letterSummary: "" },
    { date: "2026-01-05", description: "January item", letterId: "y", letterSummary: "" },
  ],
  "en-GB",
  "No fixed date",
);
assert(decJanGroups.length === 2 && decJanGroups[0].key === "2025-12" && decJanGroups[1].key === "2026-01", "December/January year boundary doesn't merge into one group");
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx tsx src/lib/letters/group-deadlines-by-month.test.ts`
Expected: fails with a module-not-found error.

- [ ] **Step 3: Implement `group-deadlines-by-month.ts`**

```ts
import type { FlatDeadline } from "./flatten-deadlines";

export type MonthGroup = { key: string; label: string; deadlines: FlatDeadline[] };

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Input is expected to already be sorted (soonest ISO date first, non-ISO
 * appended after — see flattenAndSortDeadlines), so this only buckets by
 * month key in the order it receives them, never re-sorting.
 */
export function groupDeadlinesByMonth(deadlines: FlatDeadline[], locale: string, undatedLabel: string): MonthGroup[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
  const groups: MonthGroup[] = [];

  for (const deadline of deadlines) {
    const isIso = ISO_DATE_RE.test(deadline.date);
    const key = isIso ? deadline.date.slice(0, 7) : "undated";
    let group = groups.find((g) => g.key === key);
    if (!group) {
      const label = isIso ? formatter.format(new Date(`${key}-01T00:00:00Z`)) : undatedLabel;
      group = { key, label, deadlines: [] };
      groups.push(group);
    }
    group.deadlines.push(deadline);
  }

  return groups;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx tsx src/lib/letters/group-deadlines-by-month.test.ts`
Expected: every line prints `PASS`, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add src/lib/letters/group-deadlines-by-month.ts src/lib/letters/group-deadlines-by-month.test.ts
git commit -m "feat: add pure helper to group deadlines by month"
```

---

### Task 7: Dashboard — Next-up hero card and Action/No-action pill

**Files:**
- Create: `src/app/(app)/dashboard/next-up-card.tsx`
- Modify: `src/app/(app)/dashboard/page.tsx`
- Modify: `src/app/(app)/dashboard/letter-list.tsx`
- Modify: `src/lib/i18n/copy.ts` (`dashboard` section)

**Interfaces:**
- Consumes: `letters.action_required` (Task 4), `formatDate` (Task 5).
- Produces: no new exports consumed elsewhere — this is a leaf UI task.

- [ ] **Step 1: Add copy keys**

In `src/lib/i18n/copy.ts`, add to the `AppCopy["dashboard"]` type:

```ts
    nextUpHeading: string;
    actionRequiredBadge: string;
    noActionBadge: string;
```

English (`en.dashboard`), add:
```ts
      nextUpHeading: "Next up",
      actionRequiredBadge: "Action needed",
      noActionBadge: "No action needed",
```

Arabic (`ar.dashboard`), add:
```ts
      nextUpHeading: "التالي",
      actionRequiredBadge: "يتطلب إجراء",
      noActionBadge: "لا يتطلب إجراء",
```

Turkish (`tr.dashboard`), add:
```ts
      nextUpHeading: "Sırada",
      actionRequiredBadge: "İşlem gerekiyor",
      noActionBadge: "İşlem gerekmiyor",
```

- [ ] **Step 2: Select `action_required` on both queries**

In `src/app/(app)/dashboard/page.tsx`, change the letters query:

```ts
    supabase
      .from("letters")
      .select("id, summary, deadlines, action_required, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
```

- [ ] **Step 3: Compute the global soonest deadline and render the hero card**

Create `src/app/(app)/dashboard/next-up-card.tsx`:

```tsx
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { formatDate } from "@/lib/format-date";
import type { AppLanguage } from "@/lib/letters/types";

export function NextUpCard({
  letterId,
  description,
  date,
  language,
  heading,
}: {
  letterId: string;
  description: string;
  date: string;
  language: AppLanguage;
  heading: string;
}) {
  return (
    <Link
      href={`/letters/${letterId}#deadlines`}
      className="mb-6 flex flex-col gap-2 rounded-md border-2 border-border bg-primary px-6 py-5 text-primary-foreground shadow-[4px_4px_0_0_var(--border)] transition-shadow hover:shadow-[6px_6px_0_0_var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.06em]">
        <CalendarClock className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {heading}
      </span>
      <span className="text-xl font-extrabold tracking-[-0.02em]">{description}</span>
      <span className="text-sm font-medium opacity-90">{formatDate(date, language)}</span>
    </Link>
  );
}
```

In `src/app/(app)/dashboard/page.tsx`, import it and compute the global soonest deadline right after fetching `letters`:

```ts
import { NextUpCard } from "./next-up-card";
```

```ts
  type Deadline = { date: string; description: string };
  const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
  const nextUp = (letters ?? [])
    .flatMap((letter) => (letter.deadlines as Deadline[] | null ?? []).map((d) => ({ ...d, letterId: letter.id })))
    .filter((d) => ISO_DATE_RE.test(d.date))
    .sort((a, b) => a.date.localeCompare(b.date))[0];
```

Render it right before the `<h1>{copy.dashboard.yourLetters}</h1>` line:

```tsx
          {nextUp && (
            <NextUpCard
              letterId={nextUp.letterId}
              description={nextUp.description}
              date={nextUp.date}
              language={language}
              heading={copy.dashboard.nextUpHeading}
            />
          )}
```

- [ ] **Step 4: Add the Action/No-action pill to each letter row**

In `src/app/(app)/dashboard/letter-list.tsx`, add `action_required: boolean` to `LetterRow`, accept `copy` for the two pill labels, and render the pill next to the existing deadline badge:

```ts
type LetterRow = {
  id: string;
  summary: string | null;
  deadlines: { date: string; description: string }[] | null;
  action_required: boolean;
  created_at: string;
};
```

```tsx
export function LetterList({
  letters,
  language,
}: {
  letters: LetterRow[];
  language: AppLanguage;
}) {
  const shouldReduceMotion = useReducedMotion();
  const copy = APP_COPY[language];
```

(`copy` is already destructured here — no signature change needed beyond the `LetterRow` type.) In the row's pill container, add before the existing `{deadline && (...)}` block:

```tsx
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`rounded-full border-2 border-border px-3 py-1 text-xs font-bold uppercase tracking-[0.04em] ${
                    letter.action_required ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {letter.action_required ? copy.dashboard.actionRequiredBadge : copy.dashboard.noActionBadge}
                </span>
                {deadline && (
```

(closing the existing `</div>` after the chevron is unchanged — only one new sibling span was inserted before the existing conditional.)

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 6: Visual verification**

Start the dev server, open `/dashboard` for the seeded demo account via chrome-devtools MCP, screenshot at 375px and 1440px, and switch language to `ar` to confirm the hero card and pills flip correctly under `dir="rtl"` (inherited from the page's `dir` wrapper).

- [ ] **Step 7: Commit**

```bash
git add src/app/\(app\)/dashboard/
git commit -m "feat: add dashboard next-up hero card and action-required pill"
```

---

### Task 8: Letter detail — action hero band and "Where this comes from" citations

**Files:**
- Create: `src/app/(app)/letters/[id]/key-facts-section.tsx`
- Modify: `src/app/(app)/letters/[id]/page.tsx`
- Modify: `src/lib/i18n/copy.ts` (`letters` section)

**Interfaces:**
- Consumes: `letters.key_facts` / `.action_required` (Task 4).
- Produces: no new exports consumed elsewhere.

- [ ] **Step 1: Add copy keys**

In `src/lib/i18n/copy.ts`, add to `AppCopy["letters"]`:

```ts
    keyFactsHeading: string;
    actionRequiredBadge: string;
    noActionBadge: string;
    actionRequiredDescription: string;
    noActionDescription: string;
```

English:
```ts
      keyFactsHeading: "Where this comes from",
      actionRequiredBadge: "Action needed",
      noActionBadge: "No action needed",
      actionRequiredDescription: "This letter needs a response from you.",
      noActionDescription: "Nothing to do here — for your records.",
```

Arabic:
```ts
      keyFactsHeading: "من أين جاءت هذه المعلومات",
      actionRequiredBadge: "يتطلب إجراء",
      noActionBadge: "لا يتطلب إجراء",
      actionRequiredDescription: "يتطلب هذا الخطاب ردًا منك.",
      noActionDescription: "لا شيء للقيام به هنا — للاحتفاظ بسجلك فقط.",
```

Turkish:
```ts
      keyFactsHeading: "Bu bilgi nereden geliyor",
      actionRequiredBadge: "İşlem gerekiyor",
      noActionBadge: "İşlem gerekmiyor",
      actionRequiredDescription: "Bu mektup sizden bir yanıt gerektiriyor.",
      noActionDescription: "Burada yapılacak bir şey yok — sadece kayıtlarınız için.",
```

- [ ] **Step 2: Build the key-facts section component**

Create `src/app/(app)/letters/[id]/key-facts-section.tsx`:

```tsx
import { Quote } from "lucide-react";

type KeyFact = { label: string; value: string; source_quote: string };

export function KeyFactsSection({ facts, heading }: { facts: KeyFact[]; heading: string }) {
  if (facts.length === 0) return null;

  return (
    <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
      <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">{heading}</h2>
      <ul className="mt-4 grid gap-4">
        {facts.map((fact, i) => (
          <li key={i} className="grid gap-1.5">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.04em] text-muted-foreground">{fact.label}</span>
              <span className="text-base font-bold text-foreground">{fact.value}</span>
            </div>
            <p dir="ltr" className="flex items-start gap-1.5 text-left text-sm italic text-foreground/70">
              <Quote className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              {fact.source_quote}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

(`dir="ltr"` on the quote is deliberate: `source_quote` is always German regardless of the page's RTL/LTR direction, matching the existing pattern for `reply_draft` in `reply-draft-card.tsx`.)

- [ ] **Step 3: Wire it into the letter-detail page**

In `src/app/(app)/letters/[id]/page.tsx`:

Add to the `select()` call: `"id, summary, deadlines, key_facts, action_required, reply_draft, reply_draft_translation, detected_language_confirmed, risk_flags, language, created_at"`.

Add the import:
```ts
import { KeyFactsSection } from "./key-facts-section";
```

Add after `const riskFlags = ...`:
```ts
  const keyFacts = (letter.key_facts ?? []) as { label: string; value: string; source_quote: string }[];
  const actionRequired = letter.action_required === true;
```

Replace the existing status pill block:
```tsx
          <div>
            <span className="rounded-full border-2 border-border bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
              {copy.analysisComplete}
            </span>
            <h1 className="sr-only">{copy.analysisComplete}</h1>
          </div>
```

with a version that also shows the action badge and description:
```tsx
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border-2 border-border bg-muted px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-muted-foreground">
                {copy.analysisComplete}
              </span>
              <span
                className={`rounded-full border-2 border-border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] ${
                  actionRequired ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                }`}
              >
                {actionRequired ? copy.actionRequiredBadge : copy.noActionBadge}
              </span>
            </div>
            <h1 className="sr-only">{copy.analysisComplete}</h1>
            <p className="mt-2 text-sm text-foreground/70">
              {actionRequired ? copy.actionRequiredDescription : copy.noActionDescription}
            </p>
          </div>
```

Add the new section right after the existing `<section>` that renders `letter.summary` (before the deadline/risk-flag chip row):
```tsx
          <KeyFactsSection facts={keyFacts} heading={copy.keyFactsHeading} />
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Visual verification**

Open a letter with `action_required = true` and one with `action_required = false` (from the seeded demo data or the Task 4 upload) via chrome-devtools MCP, screenshot both, and confirm: the badge/description switch correctly, the key-facts section renders only when non-empty, and the source quotes stay LTR even when viewing in `ar`.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(app\)/letters/\[id\]/key-facts-section.tsx src/app/\(app\)/letters/\[id\]/page.tsx src/lib/i18n/copy.ts
git commit -m "feat: add action-required hero band and key-facts citations to letter detail"
```

---

### Task 9: Reply wizard — 3-step stepper

**Files:**
- Create: `src/app/(app)/letters/[id]/reply-wizard-card.tsx`
- Delete: `src/app/(app)/letters/[id]/reply-draft-card.tsx`
- Modify: `src/app/(app)/letters/[id]/page.tsx`
- Modify: `src/lib/i18n/copy.ts` (`letters.wizard` section)

**Interfaces:**
- Consumes: `regenerateReply(letterId, tone, answer?)` (Task 3), `computeRequestTimeOptions`, `buildMailtoUrl` (Task 5), `formatDate` (Task 5), `REPLY_TONE_LABELS`, `ReplyTone` (existing), `CopyReplyButton` (existing, unchanged).
- Produces: `ReplyWizardCard` component — consumed only by `letters/[id]/page.tsx`.

- [ ] **Step 1: Add wizard copy keys**

In `src/lib/i18n/copy.ts`, add a `wizard` object to `AppCopy["letters"]`:

```ts
    wizard: {
      stepIntentHeading: string;
      stepFollowUpHeading: string;
      requestTimeQuestion: string;
      requestTimeOptionPlusOneMonth: string;
      requestTimeOptionPlusTwoMonths: string;
      requestTimeOptionInstalments: string;
      requestTimeCustomDateLabel: string;
      objectQuestion: string;
      objectPlaceholder: string;
      clarifyQuestion: string;
      clarifyPlaceholder: string;
      continueButton: string;
      backButton: string;
      editAnswerButton: string;
      sendByEmailButton: string;
      mailtoSubject: string;
      answerByDate: (date: string) => string;
      answerInstalments: string;
      answerRequired: string;
      generatingReply: string;
    };
```

English (add inside `en.letters`):
```ts
      wizard: {
        stepIntentHeading: "What do you want to say?",
        stepFollowUpHeading: "A couple more details",
        requestTimeQuestion: "When can you do this by?",
        requestTimeOptionPlusOneMonth: "In 1 month",
        requestTimeOptionPlusTwoMonths: "In 2 months",
        requestTimeOptionInstalments: "In instalments",
        requestTimeCustomDateLabel: "Choose another date",
        objectQuestion: "What's incorrect?",
        objectPlaceholder: "Tell us what's wrong, in your own words.",
        clarifyQuestion: "What do you want to ask?",
        clarifyPlaceholder: "Type your question.",
        continueButton: "Continue",
        backButton: "Back",
        editAnswerButton: "Edit answer",
        sendByEmailButton: "Send by email",
        mailtoSubject: "My reply",
        answerByDate: (date) => `I can do this by ${date}.`,
        answerInstalments: "I'd like to arrange to pay in instalments.",
        answerRequired: "Add an answer to continue.",
        generatingReply: "Drafting your reply…",
      },
```

Arabic (add inside `ar.letters`):
```ts
      wizard: {
        stepIntentHeading: "ماذا تريد أن تقول؟",
        stepFollowUpHeading: "بضعة تفاصيل إضافية",
        requestTimeQuestion: "متى يمكنك القيام بذلك؟",
        requestTimeOptionPlusOneMonth: "خلال شهر واحد",
        requestTimeOptionPlusTwoMonths: "خلال شهرين",
        requestTimeOptionInstalments: "على أقساط",
        requestTimeCustomDateLabel: "اختر تاريخًا آخر",
        objectQuestion: "ما الخطأ في ذلك؟",
        objectPlaceholder: "اشرح ما هو غير صحيح بكلماتك الخاصة.",
        clarifyQuestion: "ما الذي تريد سؤاله؟",
        clarifyPlaceholder: "اكتب سؤالك.",
        continueButton: "متابعة",
        backButton: "رجوع",
        editAnswerButton: "تعديل الإجابة",
        sendByEmailButton: "إرسال بالبريد الإلكتروني",
        mailtoSubject: "ردي",
        answerByDate: (date) => `يمكنني القيام بذلك بحلول ${date}.`,
        answerInstalments: "أرغب في السداد على أقساط.",
        answerRequired: "أضف إجابة للمتابعة.",
        generatingReply: "جارٍ صياغة ردك…",
      },
```

Turkish (add inside `tr.letters`):
```ts
      wizard: {
        stepIntentHeading: "Ne söylemek istiyorsunuz?",
        stepFollowUpHeading: "Birkaç detay daha",
        requestTimeQuestion: "Bunu ne zamana kadar yapabilirsiniz?",
        requestTimeOptionPlusOneMonth: "1 ay içinde",
        requestTimeOptionPlusTwoMonths: "2 ay içinde",
        requestTimeOptionInstalments: "Taksitle",
        requestTimeCustomDateLabel: "Başka bir tarih seçin",
        objectQuestion: "Neyi yanlış buluyorsunuz?",
        objectPlaceholder: "Yanlış olanı kendi cümlelerinizle anlatın.",
        clarifyQuestion: "Ne sormak istiyorsunuz?",
        clarifyPlaceholder: "Sorunuzu yazın.",
        continueButton: "Devam et",
        backButton: "Geri",
        editAnswerButton: "Yanıtı düzenle",
        sendByEmailButton: "E-posta ile gönder",
        mailtoSubject: "Yanıtım",
        answerByDate: (date) => `Bunu ${date} tarihine kadar yapabilirim.`,
        answerInstalments: "Taksitle ödeme yapmak istiyorum.",
        answerRequired: "Devam etmek için bir yanıt ekleyin.",
        generatingReply: "Yanıtınız hazırlanıyor…",
      },
```

- [ ] **Step 2: Build `reply-wizard-card.tsx`**

Create `src/app/(app)/letters/[id]/reply-wizard-card.tsx`:

```tsx
"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Languages, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REPLY_TONE_LABELS, type AppLanguage, type ReplyTone } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { formatDate } from "@/lib/format-date";
import { computeRequestTimeOptions, buildMailtoUrl, type RequestTimeOptionId } from "@/lib/letters/reply-wizard";
import { CopyReplyButton } from "./copy-reply-button";
import { regenerateReply } from "./actions";

const TONES = Object.keys(REPLY_TONE_LABELS.en) as ReplyTone[];
type Step = "intent" | "follow-up" | "reply";

export function ReplyWizardCard({
  letterId,
  language,
  initialReplyDraft,
  initialTranslation,
  translationLanguageLabel,
  translationDir,
  soonestDeadlineIso,
}: {
  letterId: string;
  language: AppLanguage;
  initialReplyDraft: string;
  initialTranslation: string;
  translationLanguageLabel: string;
  translationDir: "ltr" | "rtl";
  soonestDeadlineIso: string | null;
}) {
  const copy = APP_COPY[language].letters;
  const wizard = copy.wizard;
  const toneLabels = REPLY_TONE_LABELS[language];

  const [step, setStep] = useState<Step>("intent");
  const [tone, setTone] = useState<ReplyTone | null>(null);
  const [freeText, setFreeText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState(initialReplyDraft);
  const [translation, setTranslation] = useState(initialTranslation);
  const [showTranslation, setShowTranslation] = useState(false);
  const [pending, startTransition] = useTransition();

  const requestTimeOptions = computeRequestTimeOptions(soonestDeadlineIso);

  function requestTimeLabel(id: RequestTimeOptionId) {
    if (id === "plus_one_month") return wizard.requestTimeOptionPlusOneMonth;
    if (id === "plus_two_months") return wizard.requestTimeOptionPlusTwoMonths;
    return wizard.requestTimeOptionInstalments;
  }

  function handleToneSelect(nextTone: ReplyTone) {
    setTone(nextTone);
    setFreeText("");
    setValidationError(null);
    if (nextTone === "confirm") {
      submit(nextTone, undefined);
    } else {
      setStep("follow-up");
    }
  }

  function handleRequestTimeOption(option: { id: RequestTimeOptionId; date: string | null }) {
    const answer = option.date ? wizard.answerByDate(formatDate(option.date, language)) : wizard.answerInstalments;
    submit("request_time", answer);
  }

  function handleFreeTextContinue() {
    if (freeText.trim().length === 0) {
      setValidationError(wizard.answerRequired);
      return;
    }
    submit(tone!, freeText.trim());
  }

  function submit(submittedTone: ReplyTone, answer: string | undefined) {
    if (pending) return;
    startTransition(async () => {
      const result = await regenerateReply(letterId, submittedTone, answer);
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }
      setReplyDraft(result.data.reply_draft);
      setTranslation(result.data.reply_draft_translation);
      setStep("reply");
      toast.success(copy.replyRedraftedToast);
    });
  }

  function handleEditAnswer() {
    setStep(tone === "confirm" ? "intent" : "follow-up");
  }

  return (
    <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
      {step === "intent" && (
        <>
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {wizard.stepIntentHeading}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={copy.replyToneGroupLabel}>
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                disabled={pending}
                onClick={() => handleToneSelect(t)}
                className="flex h-11 items-center rounded-full border-2 border-border bg-muted px-4 text-sm font-bold uppercase tracking-[0.04em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              >
                {toneLabels[t]}
              </button>
            ))}
          </div>
        </>
      )}

      {step === "follow-up" && tone && tone !== "confirm" && (
        <>
          <button
            type="button"
            onClick={() => setStep("intent")}
            className="mb-4 flex h-9 items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
            {wizard.backButton}
          </button>

          {tone === "request_time" && (
            <>
              <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
                {wizard.requestTimeQuestion}
              </h2>
              <div className="mt-4 grid gap-2">
                {requestTimeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    disabled={pending}
                    onClick={() => handleRequestTimeOption(option)}
                    className="flex h-11 items-center justify-between rounded-sm border-2 border-border bg-muted px-4 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                  >
                    <span>{requestTimeLabel(option.id)}</span>
                    {option.date && <span className="text-muted-foreground">{formatDate(option.date, language)}</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {(tone === "object" || tone === "clarify") && (
            <>
              <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
                {tone === "object" ? wizard.objectQuestion : wizard.clarifyQuestion}
              </h2>
              <textarea
                value={freeText}
                onChange={(e) => {
                  setFreeText(e.target.value);
                  setValidationError(null);
                }}
                placeholder={tone === "object" ? wizard.objectPlaceholder : wizard.clarifyPlaceholder}
                rows={4}
                className="mt-4 w-full rounded-sm border-2 border-border bg-background px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {validationError && <p className="mt-2 text-sm text-destructive">{validationError}</p>}
              <Button
                type="button"
                onClick={handleFreeTextContinue}
                disabled={pending}
                className="mt-4 h-11 rounded-sm text-sm font-bold"
              >
                {wizard.continueButton}
              </Button>
            </>
          )}
        </>
      )}

      {step === "reply" && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
              {copy.yourReplyInGerman}
            </h2>
            <div className="flex gap-2">
              <CopyReplyButton text={replyDraft} copy={copy} />
              <a
                href={buildMailtoUrl(replyDraft, wizard.mailtoSubject)}
                className="flex h-10 items-center gap-2 rounded-sm border-2 border-border bg-muted px-3 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail className="size-4" strokeWidth={1.5} aria-hidden="true" />
                {wizard.sendByEmailButton}
              </a>
            </div>
          </div>
          <p className="mt-1 text-sm text-foreground/60">{copy.readyToSend}</p>

          <p
            dir="ltr"
            aria-busy={pending}
            className={`mt-4 whitespace-pre-wrap text-left text-sm leading-relaxed text-foreground transition-opacity ${pending ? "opacity-50" : ""}`}
          >
            {pending ? wizard.generatingReply : replyDraft}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowTranslation((v) => !v)}
              aria-expanded={showTranslation}
              aria-controls="reply-translation"
              className="flex h-11 items-center gap-2 rounded-sm border-2 border-border bg-muted px-4 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Languages className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {showTranslation
                ? copy.hideTranslation(translationLanguageLabel)
                : copy.showTranslation(translationLanguageLabel)}
            </button>
            <button
              type="button"
              onClick={handleEditAnswer}
              disabled={pending}
              className="flex h-11 items-center rounded-sm border-2 border-border bg-muted px-4 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            >
              {wizard.editAnswerButton}
            </button>
          </div>

          {showTranslation && (
            <div
              id="reply-translation"
              dir={translationDir}
              className="mt-3 whitespace-pre-wrap rounded-sm border-2 border-border bg-muted px-4 py-3 text-sm leading-relaxed text-foreground/80"
            >
              {pending ? "…" : translation}
            </div>
          )}
        </>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Wire it into the letter-detail page and remove the old component**

```bash
rm src/app/\(app\)/letters/\[id\]/reply-draft-card.tsx
```

In `src/app/(app)/letters/[id]/page.tsx`, replace the import and usage:

```ts
import { ReplyWizardCard } from "./reply-wizard-card";
```

```tsx
          <ReplyWizardCard
            letterId={letter.id}
            language={language}
            initialReplyDraft={letter.reply_draft ?? ""}
            initialTranslation={letter.reply_draft_translation ?? ""}
            translationLanguageLabel={LANGUAGE_NAMES[language]}
            translationDir={isRtl ? "rtl" : "ltr"}
            soonestDeadlineIso={deadlines.length > 0 ? [...deadlines].sort((a, b) => a.date.localeCompare(b.date))[0].date : null}
          />
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors, and no dangling import errors for the deleted `reply-draft-card.tsx`.

- [ ] **Step 5: Manual walkthrough of all four tones**

Via chrome-devtools MCP against the dev server, on a letter with a real ISO deadline: click through `confirm` (should skip straight to the reply step), `request_time` (should show 3 dated options, picking one should produce a reply mentioning that date), `object` (free-text, empty-submit should show the validation message, then submitting real text should produce a reply), `clarify` (same free-text flow). Screenshot the reply step. Then switch language to `ar` and repeat the `request_time` path to confirm RTL layout holds.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(app\)/letters/\[id\]/ src/lib/i18n/copy.ts
git commit -m "feat: replace one-shot tone picker with 3-step reply wizard"
```

---

### Task 10: Deadlines page — group by month

**Files:**
- Modify: `src/app/(app)/deadlines/page.tsx`
- Modify: `src/lib/i18n/copy.ts` (`deadlines` section)

**Interfaces:**
- Consumes: `groupDeadlinesByMonth` (Task 6).
- Produces: none — leaf UI task.

- [ ] **Step 1: Add the `undatedLabel` copy key**

In `src/lib/i18n/copy.ts`, add to `AppCopy["deadlines"]`: `undatedLabel: string;`

English: `undatedLabel: "No fixed date",`
Arabic: `undatedLabel: "بدون تاريخ محدد",`
Turkish: `undatedLabel: "Sabit tarih yok",`

- [ ] **Step 2: Group and render by month**

In `src/app/(app)/deadlines/page.tsx`, add the import:

```ts
import { groupDeadlinesByMonth } from "@/lib/letters/group-deadlines-by-month";
```

Replace:
```ts
  const deadlines = flattenAndSortDeadlines(letters ?? []);
```
with:
```ts
  const deadlines = flattenAndSortDeadlines(letters ?? []);
  const monthGroups = groupDeadlinesByMonth(deadlines, language === "ar" ? "ar-EG" : language === "tr" ? "tr-TR" : "en-GB", copy.undatedLabel);
```

Replace the `<ul>` block (the whole `{deadlines.length > 0 ? (...) : (...)}` ternary's truthy branch) with a version that renders one heading + list per group:

```tsx
        {deadlines.length > 0 ? (
          <div className="grid gap-6">
            {monthGroups.map((group) => (
              <div key={group.key}>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.06em] text-muted-foreground">
                  {group.label}
                </h2>
                <ul className="grid grid-cols-1 gap-3">
                  {group.deadlines.map((d, i) => (
                    <li key={`${d.letterId}-${i}`}>
                      <Link
                        href={`/letters/${d.letterId}#deadlines`}
                        className="flex flex-col gap-2 rounded-md border-2 border-border bg-card px-5 py-4 shadow-[3px_3px_0_0_var(--border)] transition-shadow hover:shadow-[5px_5px_0_0_var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <p dir="ltr" className="truncate text-base font-medium text-foreground">{d.description}</p>
                          <p dir="ltr" className="mt-0.5 truncate text-xs text-foreground/60">{d.letterSummary}</p>
                        </div>
                        <span className="shrink-0 rounded-full border-2 border-border bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
                          {d.date}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
```

(the `EmptyState` branch after `) : (` is unchanged.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Visual verification**

Open `/deadlines` for the seeded demo account (which has deadlines across multiple months) via chrome-devtools MCP, screenshot, and confirm month headings appear in the right order with the right deadlines grouped underneath.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(app\)/deadlines/page.tsx src/lib/i18n/copy.ts
git commit -m "feat: group deadlines page by month"
```

---

### Task 11: Verify Settings needs no code changes

**Files:** none modified — verification only.

- [ ] **Step 1: Confirm current Settings already matches the locked decisions**

Read `src/app/(app)/settings/page.tsx` and confirm it has exactly three sections (Language, Subscription, Account) with no calendar-sync toggle, no family-plan row, and no address field — matching design-spec decisions 1 and 5 verbatim ("Settings: visual restyle only... stay as they are today" / "'Your address' field: dropped").

Expected: no diff needed. If a discrepancy is found (e.g. a stray field was added since the spec was written), open a note for the user rather than silently changing scope.

- [ ] **Step 2: No commit** (nothing changed).

---

### Task 12: Update CLAUDE.md's AI-pipeline exact-keys rule

**Files:**
- Modify: `CLAUDE.md` (repo root)

**Interfaces:** none — documentation only.

- [ ] **Step 1: Update the exact-keys list**

In the `### AI pipeline rules` section, change:

> The analysis server action MUST return structured JSON with these exact keys: `summary` (string), `deadlines` (array of {date, description}), `reply_draft` (string), `reply_draft_translation` (string), `detected_language_confirmed` (boolean), `risk_flags` (array of strings for ambiguous amounts or dates).

to:

> The analysis server action MUST return structured JSON with these exact keys: `summary` (string), `deadlines` (array of {date, description}), `key_facts` (array of {label, value, source_quote} — source_quote always in the original German), `action_required` (boolean), `reply_draft` (string), `reply_draft_translation` (string), `detected_language_confirmed` (boolean), `risk_flags` (array of strings for ambiguous amounts or dates).

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update AI pipeline exact-keys rule with key_facts and action_required"
```

---

### Task 13: Full regression pass

**Files:** none modified — verification only.

- [ ] **Step 1: Type-check the whole project**

Run: `npx tsc --noEmit`
Expected: exit code 0.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: exit code 0.

- [ ] **Step 3: Run the pure-logic test scripts**

Run: `npx tsx src/lib/letters/flatten-deadlines.test.ts && npx tsx src/lib/nav-active.test.ts && npx tsx src/lib/letters/reply-wizard.test.ts && npx tsx src/lib/letters/group-deadlines-by-month.test.ts`
Expected: every line prints `PASS`, combined exit code 0.

- [ ] **Step 4: Run the existing e2e suite**

Run: `npm run test:e2e`
Expected: `auth.spec.ts`, `stripe-webhook.spec.ts`, and `upload-large-file.spec.ts` all pass — confirms the schema/insert changes (Tasks 2 and 4) didn't break the upload flow those specs exercise.

- [ ] **Step 5: Report results to the user**

Summarize pass/fail for each of the above with actual output, not a paraphrase. If anything failed, fix it and rerun before considering the plan complete.
