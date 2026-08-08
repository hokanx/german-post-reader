# Structured Reply Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract sender/reply-subject/reply-closing from Gemini, reorganize the letter detail page into labeled "report bubble" cards, replace the 4-fixed-tone reply picker with a guided confirm/deny/ask-for-time(weeks)/write-your-own flow, and add a share card (mailto + 4 separate copy fields) below it.

**Architecture:** Additive Gemini schema fields + one additive DB migration, a small pure `buildReplyInstruction`/`buildMailtoUrl` logic layer (both tested directly with `tsx`, no browser needed), a UI split into `ReplyDraftCard` (the picker + draft text) and `ShareCard` (mailto + copy fields), unified by a new client wrapper `ReplySection` that lifts the "current draft" state up so both can react to a regenerated reply. `CopyReplyButton` generalizes into a reusable `CopyField`.

**Tech Stack:** Next.js 16 App Router, `@google/genai` structured output, Supabase (Postgres migration), `tsx` for pure-function tests, Playwright reserved for real-browser flows (unaffected by this plan beyond a from-scratch manual pass — see Task 9).

**Path note:** this plan assumes the companion `2026-08-08-navigation-shell.md` plan has already moved `dashboard`/`upload`/`letters` into `src/app/(app)/`. If that plan hasn't run yet, every `src/app/(app)/letters/...` and `src/app/(app)/upload/...` path below is instead `src/app/letters/...` / `src/app/upload/...` — same files, same content, just without the route-group wrapper. Nothing else in this plan depends on the nav plan.

## Global Constraints

- Semantic color tokens only, Lucide icons only (`strokeWidth={1.5}`, `size-4`/`size-5`), every interactive element styles hover/focus-visible/active/disabled with `focus-visible:ring-2 focus-visible:ring-ring`, touch targets ≥44px on mobile (`components/CLAUDE.md`).
- `reply_draft` is always German (the recipient reads German); `reply_draft_translation`/`summary`/`risk_flags`/the new `reply_subject`/`reply_closing` follow the user's chosen language for everything except the reply body itself, which — per root `CLAUDE.md`'s AI pipeline rules — must always be German regardless of UI language (`reply_subject`/`reply_closing` are new to this plan and follow the **same German-always rule as `reply_draft`**, since they're part of the same outgoing letter, not analysis commentary).
- Never surface raw OCR output to the user; wrap every Gemini call in try/catch; on failure show a specific `ErrorState`, never partial output (root `CLAUDE.md` AI pipeline rules) — already true of the code this plan touches, and stays true after.
- Gemini's free tier is capped at 20 requests/day — Task 9's real end-to-end pass is deliberately a single manual run, not an automated/repeated test, to avoid burning the quota.
- A route is not done until its states are screenshotted by `/design-review` (root `CLAUDE.md`).

---

## Task 1: Types — sender, reply modes, and the instruction builder

**Files:**
- Modify: `src/lib/letters/types.ts`
- Create: `src/lib/letters/build-reply-instruction.test.ts`

**Interfaces:**
- Produces: `SenderInfo` type, extended `LetterAnalysis` (adds `sender`, `reply_subject`, `reply_closing`), `ReplyMode` (`"confirm" | "deny" | "ask_for_time" | "freeform"`), `ReplyRequest` (discriminated union), `REPLY_MODE_LABELS: Record<AppLanguage, Record<ReplyMode, string>>`, `buildReplyInstruction(request: ReplyRequest): string`. `ReplyTone`/`REPLY_TONE_LABELS`/`REPLY_TONE_INSTRUCTIONS` are removed — Task 7 is the only consumer of the old names and switches to the new ones in the same change set as this task lands, so both must be committed together (see Task 7's note).

- [ ] **Step 1: Write the failing test for `buildReplyInstruction`**

Create `src/lib/letters/build-reply-instruction.test.ts`:

```ts
import { buildReplyInstruction } from "./types";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

const confirmText = buildReplyInstruction({ mode: "confirm" });
assert(confirmText.toLowerCase().includes("confirm"), "confirm mode mentions confirming");

const denyText = buildReplyInstruction({ mode: "deny" });
assert(denyText.toLowerCase().includes("object") || denyText.toLowerCase().includes("dispute"), "deny mode mentions objecting/disputing");

const threeWeeks = buildReplyInstruction({ mode: "ask_for_time", weeks: 3 });
assert(threeWeeks.includes("3-week"), "ask_for_time embeds the exact week count");

const oneWeek = buildReplyInstruction({ mode: "ask_for_time", weeks: 1 });
assert(oneWeek.includes("1-week"), "ask_for_time works for a different week count too, not hardcoded to one value");

const freeform = buildReplyInstruction({ mode: "freeform", userText: "tell them I already paid last month" });
assert(freeform.includes("tell them I already paid last month"), "freeform embeds the user's exact text");
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd project && npx tsx src/lib/letters/build-reply-instruction.test.ts`
Expected: fails — `buildReplyInstruction` isn't exported from `types.ts` yet.

- [ ] **Step 3: Rewrite `types.ts`**

Replace the full contents of `src/lib/letters/types.ts`:

```ts
export type AppLanguage = "en" | "ar" | "tr";

export type SenderInfo = {
  name: string;
  organization: string | null;
  address: string | null;
  email: string | null;
};

export type LetterAnalysis = {
  summary: string;
  deadlines: { date: string; description: string }[];
  sender: SenderInfo;
  /** Always German — this is the text that actually gets sent to the German recipient. */
  reply_draft: string;
  /** The reply_draft's meaning, translated into the user's chosen language, so they know what they're sending. */
  reply_draft_translation: string;
  /** Always German, like reply_draft — part of the same outgoing letter. */
  reply_subject: string;
  /** Always German, like reply_draft. Contains the literal placeholder "[Your name]" — the app doesn't collect real names. */
  reply_closing: string;
  detected_language_confirmed: boolean;
  risk_flags: string[];
};

/**
 * Native self-names, not translations of the English word — "the reply is
 * translated into العربية" reads correctly in an Arabic sentence, "the reply
 * is translated into Arabic" (the English word, mid-Arabic-sentence) wouldn't.
 */
export const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  en: "English",
  ar: "العربية",
  tr: "Türkçe",
};

export type ReplyMode = "confirm" | "deny" | "ask_for_time" | "freeform";

export type ReplyRequest =
  | { mode: "confirm" }
  | { mode: "deny" }
  | { mode: "ask_for_time"; weeks: number }
  | { mode: "freeform"; userText: string };

export const REPLY_MODE_LABELS: Record<AppLanguage, Record<ReplyMode, string>> = {
  en: {
    confirm: "Confirm / accept",
    deny: "Deny / object",
    ask_for_time: "Ask for time",
    freeform: "Write your own",
  },
  ar: {
    confirm: "تأكيد / موافقة",
    deny: "رفض / اعتراض",
    ask_for_time: "طلب مزيد من الوقت",
    freeform: "اكتب ردك الخاص",
  },
  tr: {
    confirm: "Onayla / kabul et",
    deny: "Reddet / itiraz et",
    ask_for_time: "Daha fazla süre iste",
    freeform: "Kendi yanıtını yaz",
  },
};

/** Drives the Gemini prompt for a reply regeneration — not shown to the user directly, so this stays English-only regardless of UI language (Gemini itself is instructed elsewhere to write reply_draft in German). */
export function buildReplyInstruction(request: ReplyRequest): string {
  switch (request.mode) {
    case "confirm":
      return "Write a reply that confirms receipt and agrees to comply, pay, or accept what the letter asks, in a cooperative and formal tone.";
    case "deny":
      return "Write a reply that politely but firmly objects to or disputes the letter's claim, amount, or decision, and asks for reconsideration or a clearer explanation of its basis.";
    case "ask_for_time":
      return `Write a reply that politely requests a ${request.weeks}-week extension before acting on the letter, explicitly stating the ${request.weeks}-week duration, with a brief, reasonable justification.`;
    case "freeform":
      return `Write a formal, ready-to-send reply that reflects the following intent, described by the person in their own words (translate the intent, not necessarily the literal wording, into a properly-worded German reply): "${request.userText}"`;
  }
}
```

This removes `ReplyTone`, `REPLY_TONE_LABELS`, and `REPLY_TONE_INSTRUCTIONS` entirely — Task 7 updates their only two consumers (`reply-draft-card.tsx`, `analyze-letter.ts`) in this same change set, so the repo is never left in a state where those consumers reference a deleted export. Until Task 7 lands, `npx tsc --noEmit` **will** show errors in those two files — that's expected and resolves at the end of Task 7's Step 6, not this one.

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `cd project && npx tsx src/lib/letters/build-reply-instruction.test.ts`
Expected: five `PASS:` lines, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add project/src/lib/letters/types.ts project/src/lib/letters/build-reply-instruction.test.ts
git commit -m "feat: add SenderInfo/reply_subject/reply_closing types, ReplyMode + buildReplyInstruction

Replaces the old fixed ReplyTone enum (confirm/request_time/object/
clarify) with a discriminated ReplyRequest union so ask_for_time can
carry a week count and freeform can carry the user's own text. The two
files that used the old exports (analyze-letter.ts, reply-draft-card.tsx)
are updated in the next tasks of this plan, not here - tsc will show
errors in those two files until then, which is expected."
```

---

## Task 2: Gemini schema — extract sender/subject/closing, accept `ReplyRequest`

**Files:**
- Modify: `src/lib/gemini/analyze-letter.ts`

**Interfaces:**
- Consumes: `SenderInfo`, `LetterAnalysis`, `ReplyRequest`, `buildReplyInstruction` (Task 1).
- Produces: `analyzeDocument(...): Promise<Result<LetterAnalysis>>` (same signature, richer return shape). `regenerateReplyDraft(letter, request: ReplyRequest, language): Promise<Result<ReplyDraft>>` — second parameter's type changes from `ReplyTone` to `ReplyRequest`; `ReplyDraft`'s own shape (`{ reply_draft, reply_draft_translation }`) is unchanged. Task 7 (`regenerateReply` server action) is this function's only caller and is updated in this same task's commit.

- [ ] **Step 1: Update the imports**

Change:
```ts
import {
  LANGUAGE_NAMES,
  REPLY_TONE_INSTRUCTIONS,
  type AppLanguage,
  type LetterAnalysis,
  type ReplyTone,
} from "@/lib/letters/types";
```
to:
```ts
import {
  LANGUAGE_NAMES,
  buildReplyInstruction,
  type AppLanguage,
  type LetterAnalysis,
  type ReplyRequest,
} from "@/lib/letters/types";
```

- [ ] **Step 2: Extend `RESPONSE_SCHEMA`**

Add `sender`, `reply_subject`, `reply_closing` to the schema's `properties`. Insert `sender` right after `deadlines` and before `reply_draft`:

```ts
    sender: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "The sender's name or organization as printed on the letter." },
        organization: {
          type: Type.STRING,
          nullable: true,
          description: "The sending organization/company/authority, if distinct from name. Null if not applicable.",
        },
        address: {
          type: Type.STRING,
          nullable: true,
          description: "The sender's full postal address as printed on the letter, if present. Null if not shown.",
        },
        email: {
          type: Type.STRING,
          nullable: true,
          description:
            "A direct reply email address for the sender, if the letter shows one. Null if none is given - most official German mail expects a physical reply, not email, so null is a common and expected value here.",
        },
      },
      required: ["name", "organization", "address", "email"],
      propertyOrdering: ["name", "organization", "address", "email"],
    },
```

Insert `reply_subject` and `reply_closing` right after `reply_draft_translation` and before `detected_language_confirmed`:

```ts
    reply_subject: {
      type: Type.STRING,
      description: "A short subject line for the reply, written in GERMAN (e.g. referencing a case/customer number or the letter's topic).",
    },
    reply_closing: {
      type: Type.STRING,
      description:
        "The reply's closing/signature block, written in GERMAN, e.g. 'Mit freundlichen Grüßen,\\n[Your name]'. Always include the literal placeholder text \"[Your name]\" since the sender's real name is not known.",
    },
```

Update the schema's `required` and `propertyOrdering` arrays to include the three new keys in the same relative positions:

```ts
  required: [
    "summary",
    "deadlines",
    "sender",
    "reply_draft",
    "reply_draft_translation",
    "reply_subject",
    "reply_closing",
    "detected_language_confirmed",
    "risk_flags",
  ],
  propertyOrdering: [
    "summary",
    "deadlines",
    "sender",
    "reply_draft",
    "reply_draft_translation",
    "reply_subject",
    "reply_closing",
    "detected_language_confirmed",
    "risk_flags",
  ],
```

- [ ] **Step 3: Update `buildSystemInstruction`**

Add two new bullet points to the rules list in `buildSystemInstruction` (right after the `deadlines` bullet and right after the `reply_draft_translation` bullet, respectively):

```ts
- sender: extract the name/organization/address/email exactly as printed. organization, address, and email are frequently absent on official German mail (it expects a physical reply) - return null for any of them you don't find, never guess or fabricate one.
```

```ts
- reply_subject: a short subject line for the reply, written in GERMAN, like reply_draft.
- reply_closing: a closing/signature block for the reply, written in GERMAN, like reply_draft. Always end with the literal text "[Your name]" as a placeholder.
```

- [ ] **Step 4: Update `regenerateReplyDraft`'s signature and body**

Change the function signature from:
```ts
export async function regenerateReplyDraft(
  letter: { summary: string; deadlines: { date: string; description: string }[]; riskFlags: string[] },
  tone: ReplyTone,
  language: AppLanguage,
): Promise<Result<ReplyDraft>> {
```
to:
```ts
export async function regenerateReplyDraft(
  letter: { summary: string; deadlines: { date: string; description: string }[]; riskFlags: string[] },
  request: ReplyRequest,
  language: AppLanguage,
): Promise<Result<ReplyDraft>> {
```

Inside the function, change the one line that referenced `REPLY_TONE_INSTRUCTIONS[tone]`:
```ts
          `${context}\n\n${REPLY_TONE_INSTRUCTIONS[tone]}\n\nRespond ONLY with the JSON object matching the required schema.`,
```
to:
```ts
          `${context}\n\n${buildReplyInstruction(request)}\n\nRespond ONLY with the JSON object matching the required schema.`,
```

Also update the doc comment directly above `regenerateReplyDraft` (currently says "in a user-picked tone (confirm / request more time / object / ask for clarification first)") to match the new modes:

```ts
/**
 * Regenerates just the reply for a user-picked mode (confirm / deny / ask
 * for a specific number of weeks / a free-text description of their own
 * intent). Reuses the letter's already-extracted summary/deadlines/
 * risk_flags as context instead of re-sending the original image - cheaper
 * on Gemini's free-tier daily request quota, and the structured analysis
 * already captures everything a reply needs.
 */
```

- [ ] **Step 5: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: this file now typechecks cleanly. `letters/[id]/actions.ts` (which calls `regenerateReplyDraft`) and `upload/actions.ts` (which reads `analysis.sender`/`.reply_subject`/`.reply_closing` — not yet, that's Task 3) may still show errors until their own tasks land; that's expected at this point in the plan.

- [ ] **Step 6: Commit**

```bash
git add project/src/lib/gemini/analyze-letter.ts
git commit -m "feat: extract sender/reply_subject/reply_closing from Gemini, accept ReplyRequest"
```

---

## Task 3: Database migration + persist the new fields on upload

**Files:**
- Create: `supabase/migrations/0004_sender_and_reply_metadata.sql`
- Modify: `src/app/(app)/upload/actions.ts`

**Interfaces:**
- Consumes: `LetterAnalysis.sender`/`.reply_subject`/`.reply_closing` (Task 1/2).

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/0004_sender_and_reply_metadata.sql`:

```sql
-- Adds sender extraction (name/organization/address/email) and reply
-- subject/closing, both generated once at initial analysis time and shown
-- as separate "report bubble" cards / share fields on the letter detail
-- page. Existing rows get NULL for all three - the UI already treats a
-- missing sender as "omit the Sender card" and missing subject/closing as
-- blank share fields, so no backfill is needed.
alter table public.letters
  add column sender jsonb,
  add column reply_subject text,
  add column reply_closing text;
```

- [ ] **Step 2: Apply the migration**

Run: `cd project && npx supabase db push`
Expected: the migration applies cleanly against the linked project (no destructive changes — three nullable additive columns).

- [ ] **Step 3: Persist the new fields in `uploadLetter`**

In `src/app/(app)/upload/actions.ts`, find the `service.from("letters").insert({...})` call. Add three fields to the object, in the same relative position as the schema (`sender` after `deadlines`, `reply_subject`/`reply_closing` after `reply_draft_translation`):

```ts
  const { error: insertError } = await service.from("letters").insert({
    id: letterId,
    user_id: user.id,
    storage_path: storagePath,
    summary: analysis.summary,
    deadlines: analysis.deadlines,
    sender: analysis.sender,
    reply_draft: analysis.reply_draft,
    reply_draft_translation: analysis.reply_draft_translation,
    reply_subject: analysis.reply_subject,
    reply_closing: analysis.reply_closing,
    detected_language_confirmed: analysis.detected_language_confirmed,
    risk_flags: analysis.risk_flags,
    language,
  });
```

- [ ] **Step 4: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add project/supabase/migrations/0004_sender_and_reply_metadata.sql "project/src/app/(app)/upload/actions.ts"
git commit -m "feat: add sender/reply_subject/reply_closing columns, persist on upload"
```

---

## Task 4: Copy dictionary — sender card, weeks/freeform picker, share section

**Files:**
- Modify: `src/lib/i18n/copy.ts`

**Interfaces:**
- Produces: `APP_COPY[language].letters.{sender,weeksLabel,weeksOption,generateReply,freeformLabel,share:{heading,sendViaEmail,noRecipientHint,recipientLabel,subjectLabel,bodyLabel,closingLabel}}`. Tasks 6, 7, 8 consume these.

- [ ] **Step 1: Extend the `AppCopy["letters"]` type**

In `src/lib/i18n/copy.ts`, inside the `letters: { ... }` block of the `AppCopy` type, add these fields (anywhere inside that object; grouping them after `replyToneGroupLabel` keeps related fields together):

```ts
    replyToneGroupLabel: string;
    sender: string;
    weeksLabel: string;
    weeksOption: (weeks: number) => string;
    generateReply: string;
    freeformLabel: string;
    share: {
      heading: string;
      sendViaEmail: string;
      noRecipientHint: string;
      recipientLabel: string;
      subjectLabel: string;
      bodyLabel: string;
      closingLabel: string;
    };
```

- [ ] **Step 2: Add the English values**

Inside `en.letters`, add (anywhere in the object; after `replyToneGroupLabel: "Reply tone",` keeps it next to its type declaration):

```ts
      sender: "Sender",
      weeksLabel: "How many weeks?",
      weeksOption: (weeks) => (weeks === 1 ? "1 week" : `${weeks} weeks`),
      generateReply: "Generate reply",
      freeformLabel: "Describe your response in your own words",
      share: {
        heading: "Share",
        sendViaEmail: "Send via email",
        noRecipientHint: "No reply email was found on this letter — add one when your mail app opens.",
        recipientLabel: "Recipient",
        subjectLabel: "Subject",
        bodyLabel: "Body",
        closingLabel: "Closing",
      },
```

- [ ] **Step 3: Add the Arabic values**

Inside `ar.letters`:

```ts
      sender: "المرسل",
      weeksLabel: "كم أسبوعًا؟",
      weeksOption: (weeks) => `${weeks} ${weeks === 1 ? "أسبوع" : "أسابيع"}`,
      generateReply: "أنشئ الرد",
      freeformLabel: "صف ردك بكلماتك الخاصة",
      share: {
        heading: "مشاركة",
        sendViaEmail: "إرسال عبر البريد الإلكتروني",
        noRecipientHint: "لم يتم العثور على بريد إلكتروني للرد في هذا الخطاب — أضف واحدًا عند فتح تطبيق البريد.",
        recipientLabel: "المستلم",
        subjectLabel: "الموضوع",
        bodyLabel: "النص",
        closingLabel: "الختام",
      },
```

- [ ] **Step 4: Add the Turkish values**

Inside `tr.letters`:

```ts
      sender: "Gönderen",
      weeksLabel: "Kaç hafta?",
      weeksOption: (weeks) => `${weeks} hafta`,
      generateReply: "Yanıt oluştur",
      freeformLabel: "Yanıtınızı kendi kelimelerinizle tarif edin",
      share: {
        heading: "Paylaş",
        sendViaEmail: "E-posta ile gönder",
        noRecipientHint: "Bu mektupta bir yanıt e-postası bulunamadı — posta uygulamanız açıldığında bir tane ekleyin.",
        recipientLabel: "Alıcı",
        subjectLabel: "Konu",
        bodyLabel: "Metin",
        closingLabel: "Kapanış",
      },
```

- [ ] **Step 5: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: no errors related to `copy.ts` itself (other files referencing removed/renamed fields from earlier tasks may still show errors until their own tasks land — see each task's Verify step for what's expected at that point).

- [ ] **Step 6: Commit**

```bash
git add project/src/lib/i18n/copy.ts
git commit -m "feat: add sender/weeks/freeform/share copy across en/ar/tr"
```

---

## Task 5: `buildMailtoUrl` + generalize `CopyReplyButton` into `CopyField`

**Files:**
- Create: `src/lib/letters/build-mailto.ts`
- Create: `src/lib/letters/build-mailto.test.ts`
- Move: `src/app/(app)/letters/[id]/copy-reply-button.tsx` → `src/app/(app)/letters/[id]/copy-field.tsx`

**Interfaces:**
- Produces: `buildMailtoUrl(params: { to: string | null; subject: string; body: string }): string`. `CopyField({ text: string; label: string; copiedLabel: string; copiedToast: string; copyFailedToast: string })` — replaces `CopyReplyButton({ text, copy })`. Tasks 7 and 8 both consume `CopyField`.

- [ ] **Step 1: Write the failing test for `buildMailtoUrl`**

Create `src/lib/letters/build-mailto.test.ts`:

```ts
import { buildMailtoUrl } from "./build-mailto";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

const withRecipient = buildMailtoUrl({ to: "person@example.com", subject: "Re: Bill", body: "Hello\n\nBest," });
assert(withRecipient.startsWith("mailto:person@example.com?"), "recipient comes right after mailto: and before the query string");
assert(withRecipient.includes("subject=Re%3A+Bill"), "subject is present and URL-encoded");
assert(withRecipient.includes("body="), "body param is present");

const withoutRecipient = buildMailtoUrl({ to: null, subject: "Re: Bill", body: "Hello" });
assert(withoutRecipient.startsWith("mailto:?"), "a null recipient is omitted but the query string is kept");

const nothingToEncode = buildMailtoUrl({ to: null, subject: "", body: "" });
assert(nothingToEncode === "mailto:", "an empty subject/body with no recipient produces a bare mailto: with no trailing ?");
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd project && npx tsx src/lib/letters/build-mailto.test.ts`
Expected: fails — `build-mailto.ts` doesn't exist yet.

- [ ] **Step 3: Implement `buildMailtoUrl`**

Create `src/lib/letters/build-mailto.ts`:

```ts
/** Builds a mailto: URL, omitting the recipient (not the whole link) when it's unknown, and omitting an empty query string entirely when there's nothing to encode. */
export function buildMailtoUrl(params: { to: string | null; subject: string; body: string }): string {
  const query = new URLSearchParams();
  if (params.subject) query.set("subject", params.subject);
  if (params.body) query.set("body", params.body);
  const queryString = query.toString();
  const recipient = params.to ?? "";
  return `mailto:${recipient}${queryString ? `?${queryString}` : ""}`;
}
```

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `cd project && npx tsx src/lib/letters/build-mailto.test.ts`
Expected: five `PASS:` lines, exit code 0.

- [ ] **Step 5: Generalize `CopyReplyButton` into `CopyField`**

```bash
git mv "project/src/app/(app)/letters/[id]/copy-reply-button.tsx" "project/src/app/(app)/letters/[id]/copy-field.tsx"
```

Replace the full contents of `src/app/(app)/letters/[id]/copy-field.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyField({
  text,
  label,
  copiedLabel,
  copiedToast,
  copyFailedToast,
}: {
  text: string;
  label: string;
  copiedLabel: string;
  copiedToast: string;
  copyFailedToast: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(copiedToast);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(copyFailedToast);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleCopy}
      className="h-10 rounded-sm border-2 border-border text-sm font-bold"
    >
      {copied ? (
        <Check className="size-4" strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Copy className="size-4" strokeWidth={1.5} aria-hidden="true" />
      )}
      {copied ? copiedLabel : label}
    </Button>
  );
}
```

(This is the same component as before, just renamed and with `text`/`copy: AppCopy["letters"]` replaced by four explicit string props — so it no longer assumes it's always labeling "the reply," and can be reused for the four share fields in Task 8 too.)

- [ ] **Step 6: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: `reply-draft-card.tsx` (the only current importer of the old `CopyReplyButton`) now shows an error — expected, Task 7 updates it in the same commit set as this task's Step 7 below. If you're executing tasks strictly one-commit-at-a-time, make this task's commit include that one-line import/prop update too, since leaving it broken between commits fails "each task ends with an independently testable deliverable."

- [ ] **Step 7: Fix the one existing caller**

In `src/app/(app)/letters/[id]/reply-draft-card.tsx`, change:
```tsx
import { CopyReplyButton } from "./copy-reply-button";
```
to:
```tsx
import { CopyField } from "./copy-field";
```
and change:
```tsx
        <CopyReplyButton text={replyDraft} copy={copy} />
```
to:
```tsx
        <CopyField
          text={replyDraft}
          label={copy.copyReply}
          copiedLabel={copy.copied}
          copiedToast={copy.copiedToast}
          copyFailedToast={copy.copyFailedToast}
        />
```

- [ ] **Step 8: Verify again**

Run: `cd project && npx tsc --noEmit`
Expected: no errors in these two files. (`reply-draft-card.tsx` and `letters/[id]/actions.ts` still have errors from the `ReplyMode`/`ReplyRequest` rewrite in Tasks 1-2 — Task 7 resolves those; not this task's concern.)

- [ ] **Step 9: Commit**

```bash
git add project/src/lib/letters/build-mailto.ts project/src/lib/letters/build-mailto.test.ts "project/src/app/(app)/letters/[id]/copy-field.tsx" "project/src/app/(app)/letters/[id]/copy-reply-button.tsx" "project/src/app/(app)/letters/[id]/reply-draft-card.tsx"
git commit -m "feat: add buildMailtoUrl, generalize CopyReplyButton into reusable CopyField"
```

---

## Task 6: Sender report-bubble card

**Files:**
- Modify: `src/app/(app)/letters/[id]/page.tsx`

**Interfaces:**
- Consumes: `SenderInfo` (Task 1), `copy.sender` (Task 4).

- [ ] **Step 1: Select the new columns**

Change the `.select(...)` call from:
```tsx
  const { data: letter } = await supabase
    .from("letters")
    .select(
      "id, summary, deadlines, reply_draft, reply_draft_translation, detected_language_confirmed, risk_flags, language, created_at",
    )
```
to:
```tsx
  const { data: letter } = await supabase
    .from("letters")
    .select(
      "id, summary, deadlines, sender, reply_draft, reply_draft_translation, reply_subject, reply_closing, detected_language_confirmed, risk_flags, language, created_at",
    )
```

- [ ] **Step 2: Parse `sender` and add the `Building2` icon import**

Change the icon import line from:
```tsx
import { CalendarClock, TriangleAlert, ShieldAlert, FileText } from "lucide-react";
```
to:
```tsx
import { CalendarClock, TriangleAlert, ShieldAlert, FileText, Building2 } from "lucide-react";
```

Add a `SenderInfo` import and a parsed `sender` constant. Change:
```tsx
import { LANGUAGE_NAMES, type AppLanguage } from "@/lib/letters/types";
```
to:
```tsx
import { LANGUAGE_NAMES, type AppLanguage, type SenderInfo } from "@/lib/letters/types";
```

Right after the existing `const riskFlags = ...` line, add:
```tsx
  const sender = letter.sender as SenderInfo | null;
```

- [ ] **Step 3: Render the Sender card**

Insert this new `<section>` right after the low-confidence warning block and the "Analysis complete" badge block, and right before the existing Summary `<section>` — i.e. it's the first content card, ahead of Summary:

```tsx
          {sender?.name && (
            <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
              <h2 className="flex items-center gap-2 font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
                <Building2 className="size-5 text-primary" strokeWidth={1.5} aria-hidden="true" />
                {copy.sender}
              </h2>
              <div className="mt-3 grid gap-1">
                <p className="text-base font-bold text-foreground">{sender.name}</p>
                {sender.organization && <p className="text-sm text-foreground/80">{sender.organization}</p>}
                {sender.address && (
                  <p className="whitespace-pre-line text-sm text-foreground/70">{sender.address}</p>
                )}
                {sender.email && <p className="text-sm text-foreground/70">{sender.email}</p>}
              </div>
            </section>
          )}
```

`sender?.name` (rather than just `sender`) as the guard matches the spec's "if the whole sender object is unusably empty, the card itself is omitted" — a `sender` object with no `name` isn't useful to show at all, and existing letters (from before this migration) have `sender: null` entirely, which the optional-chain already handles.

- [ ] **Step 4: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: this file typechecks; `ReplyDraftCard`'s own remaining errors (from Tasks 1-2's type rewrite) are Task 7's concern, not this one's — but note this file also passes `translationLanguageLabel`/etc. to `ReplyDraftCard` unchanged, so nothing here is newly broken by this step specifically.

- [ ] **Step 5: Commit**

```bash
git add "project/src/app/(app)/letters/[id]/page.tsx"
git commit -m "feat: add Sender report-bubble card to the letter detail page"
```

---

## Task 7: Reply flow — Confirm / Deny / Ask for time / Write your own

**Files:**
- Modify: `src/app/(app)/letters/[id]/reply-draft-card.tsx`
- Modify: `src/app/(app)/letters/[id]/actions.ts`

**Interfaces:**
- Consumes: `ReplyMode`, `ReplyRequest`, `REPLY_MODE_LABELS`, `buildReplyInstruction` (Task 1), `regenerateReplyDraft(letter, request: ReplyRequest, language)` (Task 2), `CopyField` (Task 5), `copy.weeksLabel`/`.weeksOption`/`.generateReply`/`.freeformLabel` (Task 4).
- Produces: `ReplyDraftCard` gains one new prop, `onReplyChange?: (text: string) => void`, called every time the draft is successfully regenerated — Task 8's `ReplySection` wrapper uses this to keep the Share card's body in sync. `regenerateReply(letterId: string, request: ReplyRequest): Promise<Result<{ reply_draft: string; reply_draft_translation: string }>>` — second parameter's type changes from `ReplyTone` to `ReplyRequest`.

- [ ] **Step 1: Update `letters/[id]/actions.ts`**

Change the import:
```ts
import type { AppLanguage, ReplyTone } from "@/lib/letters/types";
```
to:
```ts
import type { AppLanguage, ReplyRequest } from "@/lib/letters/types";
```

Change the function signature and its one internal call site:
```ts
export async function regenerateReply(
  letterId: string,
  tone: ReplyTone,
): Promise<Result<{ reply_draft: string; reply_draft_translation: string }>> {
```
to:
```ts
export async function regenerateReply(
  letterId: string,
  request: ReplyRequest,
): Promise<Result<{ reply_draft: string; reply_draft_translation: string }>> {
```

and:
```ts
  const result = await regenerateReplyDraft(
    {
      summary: letter.summary ?? "",
      deadlines: (letter.deadlines ?? []) as Deadline[],
      riskFlags: (letter.risk_flags ?? []) as string[],
    },
    tone,
    language,
  );
```
to:
```ts
  const result = await regenerateReplyDraft(
    {
      summary: letter.summary ?? "",
      deadlines: (letter.deadlines ?? []) as Deadline[],
      riskFlags: (letter.risk_flags ?? []) as string[],
    },
    request,
    language,
  );
```

- [ ] **Step 2: Rewrite `reply-draft-card.tsx`**

Replace the full contents of `src/app/(app)/letters/[id]/reply-draft-card.tsx`:

```tsx
"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Languages } from "lucide-react";
import { REPLY_MODE_LABELS, type AppLanguage, type ReplyMode, type ReplyRequest } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { CopyField } from "./copy-field";
import { regenerateReply } from "./actions";

const MODES = Object.keys(REPLY_MODE_LABELS.en) as ReplyMode[];
const WEEKS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];
const EXPANDABLE_MODES = new Set<ReplyMode>(["ask_for_time", "freeform"]);

export function ReplyDraftCard({
  letterId,
  language,
  initialReplyDraft,
  initialTranslation,
  translationLanguageLabel,
  translationDir,
  onReplyChange,
}: {
  letterId: string;
  language: AppLanguage;
  initialReplyDraft: string;
  initialTranslation: string;
  translationLanguageLabel: string;
  translationDir: "ltr" | "rtl";
  onReplyChange?: (text: string) => void;
}) {
  const copy = APP_COPY[language].letters;
  const modeLabels = REPLY_MODE_LABELS[language];
  const [replyDraft, setReplyDraft] = useState(initialReplyDraft);
  const [translation, setTranslation] = useState(initialTranslation);
  const [activeMode, setActiveMode] = useState<ReplyMode | null>(null);
  const [expandedMode, setExpandedMode] = useState<ReplyMode | null>(null);
  const [weeks, setWeeks] = useState(1);
  const [freeformText, setFreeformText] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(request: ReplyRequest) {
    if (pending) return;
    startTransition(async () => {
      const result = await regenerateReply(letterId, request);
      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }
      setReplyDraft(result.data.reply_draft);
      setTranslation(result.data.reply_draft_translation);
      setActiveMode(request.mode);
      setExpandedMode(null);
      onReplyChange?.(result.data.reply_draft);
      toast.success(copy.replyRedraftedToast);
    });
  }

  function handleModeClick(mode: ReplyMode) {
    if (!EXPANDABLE_MODES.has(mode)) {
      submit({ mode: mode as "confirm" | "deny" });
      return;
    }
    setExpandedMode((current) => (current === mode ? null : mode));
  }

  return (
    <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
          {copy.yourReplyInGerman}
        </h2>
        <CopyField
          text={replyDraft}
          label={copy.copyReply}
          copiedLabel={copy.copied}
          copiedToast={copy.copiedToast}
          copyFailedToast={copy.copyFailedToast}
        />
      </div>
      <p className="mt-1 text-sm text-foreground/60">{copy.readyToSend}</p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={copy.replyToneGroupLabel}>
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            disabled={pending}
            onClick={() => handleModeClick(m)}
            aria-pressed={activeMode === m}
            aria-expanded={EXPANDABLE_MODES.has(m) ? expandedMode === m : undefined}
            className={`flex h-9 items-center rounded-full border-2 px-3 text-xs font-bold uppercase tracking-[0.04em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 ${
              activeMode === m || expandedMode === m
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      {expandedMode === "ask_for_time" && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-sm border-2 border-border bg-muted px-4 py-3">
          <label htmlFor="reply-weeks" className="text-sm font-medium text-foreground">
            {copy.weeksLabel}
          </label>
          <select
            id="reply-weeks"
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
            className="h-11 rounded-sm border-2 border-border bg-background px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {WEEKS_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {copy.weeksOption(w)}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={pending}
            onClick={() => submit({ mode: "ask_for_time", weeks })}
            className="ms-auto flex h-11 items-center rounded-sm border-2 border-border bg-primary px-4 text-sm font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            {copy.generateReply}
          </button>
        </div>
      )}

      {expandedMode === "freeform" && (
        <div className="mt-3 grid gap-3 rounded-sm border-2 border-border bg-muted px-4 py-3">
          <label htmlFor="reply-freeform" className="text-sm font-medium text-foreground">
            {copy.freeformLabel}
          </label>
          <textarea
            id="reply-freeform"
            value={freeformText}
            onChange={(e) => setFreeformText(e.target.value)}
            rows={3}
            className="w-full rounded-sm border-2 border-border bg-background px-3 py-2 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            disabled={pending || freeformText.trim().length === 0}
            onClick={() => submit({ mode: "freeform", userText: freeformText.trim() })}
            className="flex h-11 items-center justify-self-end rounded-sm border-2 border-border bg-primary px-4 text-sm font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          >
            {copy.generateReply}
          </button>
        </div>
      )}

      <p
        dir="ltr"
        aria-busy={pending}
        className={`mt-4 whitespace-pre-wrap text-left text-sm leading-relaxed text-foreground transition-opacity ${pending ? "opacity-50" : ""}`}
      >
        {pending ? copy.redrafting : replyDraft}
      </p>

      <button
        type="button"
        onClick={() => setShowTranslation((v) => !v)}
        aria-expanded={showTranslation}
        aria-controls="reply-translation"
        className="mt-5 flex h-11 items-center gap-2 rounded-sm border-2 border-border bg-muted px-4 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Languages className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {showTranslation
          ? copy.hideTranslation(translationLanguageLabel)
          : copy.showTranslation(translationLanguageLabel)}
      </button>

      {showTranslation && (
        <div
          id="reply-translation"
          dir={translationDir}
          className="mt-3 whitespace-pre-wrap rounded-sm border-2 border-border bg-muted px-4 py-3 text-sm leading-relaxed text-foreground/80"
        >
          {pending ? "…" : translation}
        </div>
      )}
    </section>
  );
}
```

Two notable changes from the previous version beyond the picker itself: the "Ask for time" confirm button uses `ms-auto` (logical margin-inline-start) instead of `ml-auto`, so it pushes to the trailing edge correctly in both LTR and RTL instead of always sticking to the physical left; and `onReplyChange?.(result.data.reply_draft)` fires on every successful regeneration so Task 8's wrapper can keep the Share card's body text current.

- [ ] **Step 3: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: no errors in `reply-draft-card.tsx` or `actions.ts`. `letters/[id]/page.tsx` still passes the old prop set to `ReplyDraftCard` directly (no `onReplyChange`, and it's still called `ReplyDraftCard` not through `ReplySection`) — that's fine, `onReplyChange` is optional, so this compiles; Task 8 is what actually swaps `page.tsx` over to rendering `ReplySection` instead.

- [ ] **Step 4: Manual smoke check (no live Gemini call needed for this step)**

Start the dev server, log in with any existing test account that has at least one letter, open that letter, and click through all four mode buttons without submitting: confirm "Ask for time" reveals the weeks dropdown with 8 options (1 week, 2 weeks, …), confirm "Write your own" reveals a textarea, and confirm clicking "Confirm" or "Deny" doesn't reveal anything (they submit immediately, as before, just under new labels) — don't actually submit yet, that's covered by Task 9's single real end-to-end pass, to avoid burning Gemini quota on a step that's really just a UI check.

- [ ] **Step 5: Commit**

```bash
git add "project/src/app/(app)/letters/[id]/reply-draft-card.tsx" "project/src/app/(app)/letters/[id]/actions.ts"
git commit -m "feat: replace fixed tone picker with confirm/deny/ask-for-time(weeks)/freeform"
```

---

## Task 8: `ReplySection` wrapper + `ShareCard`

**Files:**
- Create: `src/app/(app)/letters/[id]/share-card.tsx`
- Create: `src/app/(app)/letters/[id]/reply-section.tsx`
- Modify: `src/app/(app)/letters/[id]/page.tsx`

**Interfaces:**
- Consumes: `CopyField` (Task 5), `buildMailtoUrl` (Task 5), `ReplyDraftCard` with `onReplyChange` (Task 7), `copy.share.*` (Task 4).
- Produces: `ShareCard({ recipientEmail: string | null; subject: string; body: string; closing: string; copy: AppCopy["letters"] })`. `ReplySection({ letterId, language, initialReplyDraft, initialTranslation, translationLanguageLabel, translationDir, senderEmail, replySubject, replyClosing })` — this is what `page.tsx` renders now, replacing its direct `<ReplyDraftCard>` render.

`page.tsx` (a Server Component) can't hold the "what's the current reply draft" state that both the reply card and the share card need — `ReplySection` is a small client component that lifts that one piece of state up so both children can read the live value, not just whatever the initial server-rendered draft was.

- [ ] **Step 1: Build `ShareCard`**

Create `src/app/(app)/letters/[id]/share-card.tsx`:

```tsx
import { Mail } from "lucide-react";
import { CopyField } from "./copy-field";
import { buildMailtoUrl } from "@/lib/letters/build-mailto";
import type { AppCopy } from "@/lib/i18n/copy";

export function ShareCard({
  recipientEmail,
  subject,
  body,
  closing,
  copy,
}: {
  recipientEmail: string | null;
  subject: string;
  body: string;
  closing: string;
  copy: AppCopy["letters"];
}) {
  const mailtoUrl = buildMailtoUrl({
    to: recipientEmail,
    subject,
    body: [body, closing].filter(Boolean).join("\n\n"),
  });

  return (
    <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
      <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">{copy.share.heading}</h2>

      <a
        href={mailtoUrl}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-sm border-2 border-border bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Mail className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {copy.share.sendViaEmail}
      </a>
      {!recipientEmail && <p className="mt-2 text-xs text-foreground/60">{copy.share.noRecipientHint}</p>}

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <CopyField
          text={recipientEmail ?? ""}
          label={copy.share.recipientLabel}
          copiedLabel={copy.copied}
          copiedToast={copy.copiedToast}
          copyFailedToast={copy.copyFailedToast}
        />
        <CopyField
          text={subject}
          label={copy.share.subjectLabel}
          copiedLabel={copy.copied}
          copiedToast={copy.copiedToast}
          copyFailedToast={copy.copyFailedToast}
        />
        <CopyField
          text={body}
          label={copy.share.bodyLabel}
          copiedLabel={copy.copied}
          copiedToast={copy.copiedToast}
          copyFailedToast={copy.copyFailedToast}
        />
        <CopyField
          text={closing}
          label={copy.share.closingLabel}
          copiedLabel={copy.copied}
          copiedToast={copy.copiedToast}
          copyFailedToast={copy.copyFailedToast}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build `ReplySection`**

Create `src/app/(app)/letters/[id]/reply-section.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ReplyDraftCard } from "./reply-draft-card";
import { ShareCard } from "./share-card";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

export function ReplySection({
  letterId,
  language,
  initialReplyDraft,
  initialTranslation,
  translationLanguageLabel,
  translationDir,
  senderEmail,
  replySubject,
  replyClosing,
}: {
  letterId: string;
  language: AppLanguage;
  initialReplyDraft: string;
  initialTranslation: string;
  translationLanguageLabel: string;
  translationDir: "ltr" | "rtl";
  senderEmail: string | null;
  replySubject: string;
  replyClosing: string;
}) {
  const [replyDraft, setReplyDraft] = useState(initialReplyDraft);
  const copy = APP_COPY[language].letters;

  return (
    <>
      <ReplyDraftCard
        letterId={letterId}
        language={language}
        initialReplyDraft={initialReplyDraft}
        initialTranslation={initialTranslation}
        translationLanguageLabel={translationLanguageLabel}
        translationDir={translationDir}
        onReplyChange={setReplyDraft}
      />
      <ShareCard recipientEmail={senderEmail} subject={replySubject} body={replyDraft} closing={replyClosing} copy={copy} />
    </>
  );
}
```

- [ ] **Step 3: Wire it into `page.tsx`**

Change the import:
```tsx
import { ReplyDraftCard } from "./reply-draft-card";
```
to:
```tsx
import { ReplySection } from "./reply-section";
```

Change the final render call from:
```tsx
          <ReplyDraftCard
            letterId={letter.id}
            language={language}
            initialReplyDraft={letter.reply_draft ?? ""}
            initialTranslation={letter.reply_draft_translation ?? ""}
            translationLanguageLabel={LANGUAGE_NAMES[language]}
            translationDir={isRtl ? "rtl" : "ltr"}
          />
```
to:
```tsx
          <ReplySection
            letterId={letter.id}
            language={language}
            initialReplyDraft={letter.reply_draft ?? ""}
            initialTranslation={letter.reply_draft_translation ?? ""}
            translationLanguageLabel={LANGUAGE_NAMES[language]}
            translationDir={isRtl ? "rtl" : "ltr"}
            senderEmail={sender?.email ?? null}
            replySubject={letter.reply_subject ?? ""}
            replyClosing={letter.reply_closing ?? ""}
          />
```

- [ ] **Step 4: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: no errors anywhere in the `letters/[id]` directory.

Run: `cd project && npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add "project/src/app/(app)/letters/[id]/share-card.tsx" "project/src/app/(app)/letters/[id]/reply-section.tsx" "project/src/app/(app)/letters/[id]/page.tsx"
git commit -m "feat: add ShareCard (mailto + 4 copy fields) via a ReplySection wrapper

ReplySection lifts the current reply-draft text into a small client
component so the Share card's body always reflects the latest
regenerated draft, not just the one the page server-rendered."
```

---

## Task 9: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Typecheck and build**

Run: `cd project && npx tsc --noEmit && npm run build`
Expected: both succeed with zero errors.

- [ ] **Step 2: Run every pure-function test from this plan together**

Run:
```bash
cd project && npx tsx src/lib/letters/build-reply-instruction.test.ts && npx tsx src/lib/letters/build-mailto.test.ts
```
Expected: all `PASS:` lines, exit code 0.

- [ ] **Step 3: One real end-to-end pass (single Gemini call, not repeated)**

Using a throwaway test account (or an existing one with spare free-trial letters), upload one real letter image or PDF. Confirm:
- The Sender card appears with at least a name (address/email may legitimately be blank depending on the letter).
- Click "Ask for time," pick a specific week count (e.g. 3), click "Generate reply," and confirm the regenerated German reply text explicitly states that duration.
- Click "Write your own," type a short plain-language instruction, click "Generate reply," and confirm the regenerated reply reflects that intent.
- Click "Confirm" and "Deny" and confirm both still regenerate immediately (no extra UI) like the original four buttons did.
- In the Share card: click "Send via email" and confirm it opens the system's mail app/handler with subject and body pre-filled (recipient too, if the letter had one); click each of the four copy buttons and confirm each copies only its own field.
- Do **not** repeat this pass multiple times back-to-back — each regeneration and the initial analysis are separate Gemini calls, and the free tier caps at 20/day total across the whole app.

- [ ] **Step 4: Screenshot-verify at 375px and 1440px, in English, Arabic, and Turkish**

Cover: the Sender card, the reply picker in its idle state and with each of the two expandable panels (weeks selector, freeform textarea) open, and the Share card (both with and without a recipient email present, to confirm the "no recipient" hint text and the recipient-omitted `mailto:` behavior both look right). Confirm Arabic mirrors correctly — the "Ask for time" generate button in particular, since its `ms-auto` positioning is direction-aware. Save to `artifacts/review/` following this project's existing naming convention.

- [ ] **Step 5: Run `/design-review` on the redesigned letter detail page**

Fix any Blocker/High-Priority finding before considering this done; Medium/Nit may be logged and deferred.

- [ ] **Step 6: Confirm the existing Playwright spec that touches this page still holds**

`tests/upload-large-file.spec.ts` waits for `page.waitForURL(/\/letters\/[0-9a-f-]+$/)` or an "Analysis failed" message after upload — neither the URL pattern nor that error text changed in this plan, so it should still pass structurally. Read the file once more to confirm nothing else it checks for (e.g. specific button text) was renamed by this plan. Do not run it repeatedly for the same Gemini-quota reason as Step 3.

- [ ] **Step 7: Final commit**

If Steps 3-6 required any fixes, commit them now with a message describing what was found and fixed. If nothing needed fixing, this task produces no commit of its own.
