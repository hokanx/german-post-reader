# Demo Mode + Pre-Release Marketing (Stage 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn off selling via a single `DEMO_MODE` flag (Stripe code untouched, just gated), capture pre-launch emails through a newsletter opt-in wired to a Resend Audience, and give people a reason to share — without building any real referral/attribution infrastructure.

**Architecture:** One boolean constant (`DEMO_MODE` in `constants.ts`) gates every UI branch point; every gated component/page keeps its non-demo code path fully intact so flipping the flag back to `false` restores real selling with no rebuild. Two small new library helpers (Resend Audience add, registered-user count) are unit-tested in isolation; everything else is UI/copy wiring around the existing `TRIAL_LIMIT_REACHED` error path, the existing onboarding redirect, and the existing landing-page section assembly.

**Tech Stack:** Next.js App Router (Server Components + Server Actions), Supabase (service-role client for the aggregate count), Resend (Audiences API), Posthog (client-side `trackEvent`), Framer Motion (existing landing-page animation conventions), the project's lightweight `assert()`-based test runner for pure functions.

## Global Constraints

- Every color resolves through the OKLCH semantic tokens in `globals.css` — never a raw Tailwind color class or hex.
- Lucide icons only, `strokeWidth={1.5}`, sizes `size-4`/`size-5` only.
- Every new user-facing string is added to `APP_COPY` (`src/lib/i18n/copy.ts`) or `MARKETING_COPY` (`src/components/landing/copy.ts`) for all three languages — `en`, `ar`, `tr` — never partial i18n.
- Data-access/server-action functions return the `Result<T>` envelope from `src/lib/result.ts` — never a raw throw to the UI.
- Non-blocking side effects (newsletter signup, analytics) are logged via `console.error("<context>", error)` on failure and never block the primary flow — this project's Sentry integration auto-captures server console errors (confirmed: no explicit `Sentry.captureException` calls exist outside `global-error.tsx`; `src/lib/email/send-welcome-email.ts` is the reference fire-and-forget pattern).
- Touch targets ≥ 44px on mobile, focus-visible rings on every interactive element.
- Brand voice is calm and clinical, reassuring — no hype language, no fabricated urgency, no fake countdown.
- Every gated UI branch preserves the non-`DEMO_MODE` code path unchanged and reachable — this is how flipping the flag back later works with zero rebuild.
- Verification-before-completion: every task's final step shows real command output, not an assumption.

---

## Task 1: SPEC.md — redefine Stage 2, add Stage 5

Records the already-approved redefinition (design doc: `project/docs/superpowers/specs/2026-08-19-demo-mode-marketing-design.md`) in `SPEC.md` itself, which still reads the old "Reply PDF + Sending" text. This is a pure content edit with no code dependency — it can and should land before the code that implements it, matching this project's established `spec → design → plan → feat` ordering (the spec/design/plan docs already exist; only the actual `SPEC.md` file update is outstanding).

**Files:**
- Modify: `SPEC.md` (repo root, not under `project/`)

**Interfaces:** None.

- [ ] **Step 1: Replace the Stage 2 section**

In `SPEC.md`, find:
```
### Stage 2 · Reply PDF + Sending

**goal:** Users can download a formatted reply letter as a PDF and optionally send it directly from the app.

scope:
- Formatted reply PDF export with user name and address pre-filled works.
- In-app email send of the reply draft (via Resend) to a user-specified recipient works.
- Reply sent confirmation logged to letter history works.

stage status: `not started` (change to `shipped` once `/next-stage` finishes stage 1)
```
Replace with:
```
### Stage 2 · Demo Mode + Pre-Release Marketing

**goal:** Turn off selling, turn on hype — accounts unlock a free 4-letter demo, capture emails for the real launch, and give people a reason to share.

scope:
- A `DEMO_MODE` flag hides the paywall and Stripe checkout from the UI (Stripe code itself stays intact, just unreachable) works.
- Newsletter opt-in at signup, wired to a Resend Audience, captures emails for the launch announcement works.
- A one-time post-onboarding `/welcome` screen offers X/Twitter, WhatsApp, and copy-link sharing works.
- The landing page shows an honest, unpadded signup counter and a demo pitch in place of the pricing table works.
- Hitting the 4-letter demo cap shows a "demo complete" message instead of a paywall works.

stage status: `shipped`
```

- [ ] **Step 2: Add the new Stage 5, renumber nothing else**

Find the end of Stage 4 (before `## success metrics`):
```
### Stage 4 · Team and Family Plan

**goal:** One subscriber can invite family members or flatmates under a shared plan.

scope:
- Invite-by-email flow adds up to 5 seats to one subscription works.
- Each seat member sees only their own letters; plan owner sees all works.
- Per-seat billing via Stripe Billing quantity update works.

stage status: `not started` (change to `shipped` once `/next-stage` finishes stage 3)

## success metrics
```
Insert a new Stage 5 between them (Stages 3 and 4 are otherwise untouched):
```
### Stage 4 · Team and Family Plan

**goal:** One subscriber can invite family members or flatmates under a shared plan.

scope:
- Invite-by-email flow adds up to 5 seats to one subscription works.
- Each seat member sees only their own letters; plan owner sees all works.
- Per-seat billing via Stripe Billing quantity update works.

stage status: `not started` (change to `shipped` once `/next-stage` finishes stage 3)

### Stage 5 · Reply PDF + Sending

**goal:** Users can download a formatted reply letter as a PDF and optionally send it directly from the app.

scope:
- Formatted reply PDF export with user name and address pre-filled works.
- In-app email send of the reply draft (via Resend) to a user-specified recipient works.
- Reply sent confirmation logged to letter history works.

stage status: `not started` (change to `shipped` once `/next-stage` finishes stage 4)

## success metrics
```

- [ ] **Step 3: Commit**

```bash
git add SPEC.md
git commit -m "spec: redefine stage 2 as demo mode + pre-release marketing"
```

---

## Task 2: `DEMO_MODE` flag + `RESEND_LAUNCH_AUDIENCE_ID` env var

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/lib/env.ts`

**Interfaces:**
- Produces: `DEMO_MODE: boolean` (from `@/lib/constants`) — consumed by every later task in this plan.
- Produces: `env.RESEND_LAUNCH_AUDIENCE_ID: string | undefined` (from `@/lib/env`) — consumed by Task 3.

- [ ] **Step 1: Add `DEMO_MODE` to constants.ts**

In `src/lib/constants.ts`, add after `FREE_LETTER_LIMIT`:
```ts
/**
 * Pre-launch switch: true hides the paywall and Stripe checkout from the
 * UI entirely (accounts unlock a free demo instead), false restores real
 * selling. Stripe's checkout/webhook/portal code, PaywallModal, and every
 * Stripe env var are left completely untouched either way — this flag only
 * changes which UI branch renders. Flip to false when ready to sell; no
 * rebuild needed.
 */
export const DEMO_MODE = true;
```

- [ ] **Step 2: Add the new env var**

In `src/lib/env.ts`, add to `envSchema` (after `RESEND_FROM_EMAIL`):
```ts
  RESEND_LAUNCH_AUDIENCE_ID: z.string().min(1).optional(),
```
And to the `env` export object (same position, after `RESEND_FROM_EMAIL`):
```ts
  RESEND_LAUNCH_AUDIENCE_ID: emptyToUndefined(process.env.RESEND_LAUNCH_AUDIENCE_ID),
```

- [ ] **Step 3: Typecheck**

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add project/src/lib/constants.ts project/src/lib/env.ts
git commit -m "feat: add DEMO_MODE flag and RESEND_LAUNCH_AUDIENCE_ID env var"
```

---

## Task 3: `addToLaunchAudience` helper

Mirrors `src/lib/email/send-welcome-email.ts`'s exact fire-and-forget pattern — this codebase doesn't unit-test its Resend-calling functions (none exist for `sendWelcomeEmail` either), so this follows that established precedent rather than introducing new test scaffolding for a network call.

**Files:**
- Create: `src/lib/email/add-to-launch-audience.ts`

**Interfaces:**
- Consumes: `env.RESEND_API_KEY`, `env.RESEND_LAUNCH_AUDIENCE_ID` from `@/lib/env` (Task 2).
- Produces: `addToLaunchAudience(email: string): Promise<void>` — consumed by Task 4's signup action.

- [ ] **Step 1: Write the helper**

Create `src/lib/email/add-to-launch-audience.ts`:
```ts
import { Resend } from "resend";
import { env } from "@/lib/env";

/**
 * Fire-and-forget: adds an email to the pre-launch Resend Audience so it
 * can be emailed once when Papkram fully launches. A missed add is never
 * worth blocking signup over — failures are logged, not thrown. Same
 * pattern as sendWelcomeEmail.
 */
export async function addToLaunchAudience(email: string): Promise<void> {
  if (!env.RESEND_API_KEY || !env.RESEND_LAUNCH_AUDIENCE_ID) {
    console.warn("addToLaunchAudience: RESEND_API_KEY/RESEND_LAUNCH_AUDIENCE_ID not configured, skipping");
    return;
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.contacts.create({ email, audienceId: env.RESEND_LAUNCH_AUDIENCE_ID });
  } catch (error) {
    console.error("addToLaunchAudience failed", error);
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `cd project && npx tsc --noEmit`
Expected: no errors. (This confirms `resend.contacts.create` and its argument shape actually exist on the installed `resend` package version — if this fails, check the installed `resend` SDK's actual `contacts.create` signature via `node_modules/resend/dist/**/*.d.ts` before adjusting.)

- [ ] **Step 3: Commit**

```bash
git add project/src/lib/email/add-to-launch-audience.ts
git commit -m "feat: add addToLaunchAudience Resend helper"
```

---

## Task 4: Signup — newsletter opt-in checkbox

**Files:**
- Modify: `src/lib/i18n/copy.ts` (type + EN/AR/TR content)
- Modify: `src/app/signup/signup-form.tsx`
- Modify: `src/app/signup/actions.ts`

**Interfaces:**
- Consumes: `addToLaunchAudience(email)` from Task 3; `DEMO_MODE` from Task 2.
- Produces: nothing new consumed by later tasks — this is a leaf feature.

- [ ] **Step 1: Add the copy key to the type**

In `src/lib/i18n/copy.ts`, find the `auth.signup` type block:
```ts
    signup: {
      heading: (freeLetterLimit: number) => string;
      subhead: string;
      submitting: string;
      submit: string;
      haveAccount: string;
      loginLink: string;
    };
```
Add `newsletterOptInLabel: string;` before the closing `};`:
```ts
    signup: {
      heading: (freeLetterLimit: number) => string;
      subhead: string;
      submitting: string;
      submit: string;
      haveAccount: string;
      loginLink: string;
      newsletterOptInLabel: string;
    };
```

- [ ] **Step 2: Add the EN/AR/TR content**

Find each language's `signup: { ... haveAccount: ..., loginLink: ..., }` content block (search for `haveAccount: "Already have an account?"` for EN, `haveAccount: "لديك حساب بالفعل؟"` for AR, `haveAccount: "Zaten bir hesabınız var mı?"` for TR) and add `newsletterOptInLabel` after `loginLink`:

EN:
```ts
        newsletterOptInLabel: "Notify me when Papkram fully launches.",
```
AR:
```ts
        newsletterOptInLabel: "أخبرني عندما يُطلق Papkram رسميًا.",
```
TR:
```ts
        newsletterOptInLabel: "Papkram tam olarak yayına girdiğinde bana haber ver.",
```

- [ ] **Step 3: Add the checkbox to the signup form**

In `src/app/signup/signup-form.tsx`, add the import:
```ts
import { DEMO_MODE } from "@/lib/constants";
```
Then insert a checkbox between the password field and the error block:
```tsx
      {DEMO_MODE && (
        <label className="flex items-start gap-2.5 text-sm text-foreground/80">
          <input
            type="checkbox"
            name="newsletterOptIn"
            className="mt-0.5 size-4 shrink-0 rounded-sm border-2 border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {copy.signup.newsletterOptInLabel}
        </label>
      )}
```
Place it right after the password field's closing `</div>` and before the `{error && (...)}` block. Note this checkbox is uncontrolled (no `useState`) — same as the email/password fields above it, which rely on the form's native `FormData` on submit, not React state.

- [ ] **Step 4: Wire the opt-in into the signup action**

In `src/app/signup/actions.ts`, add the import:
```ts
import { addToLaunchAudience } from "@/lib/email/add-to-launch-audience";
```
Then, after the `await sendWelcomeEmail(email, language);` line and before the `redirect("/onboarding");` line, add:
```ts
  if (formData.get("newsletterOptIn") === "on") {
    await addToLaunchAudience(email);
  }
```
(A checked native checkbox submits the literal string `"on"` for its value when no explicit `value` attribute is set — this matches the checkbox added in Step 3, which has no `value` attribute.)

- [ ] **Step 5: Add the Posthog event, client-side**

The signup action itself runs entirely server-side and redirects on success, so there's no client-side moment after a successful signup to fire a client `trackEvent` call from the current code (the browser navigates away via the server-issued `redirect()`, unmounting `SignupForm` before any callback could run). Rather than fighting that redirect, fire the event from the form right before submitting, keyed off the checkbox's checked state at submit time — this fires once per signup attempt with an opt-in checked, which is what "signup with opt-in" means for this event's purpose.

In `signup-form.tsx`, add the import:
```ts
import { trackEvent } from "@/lib/analytics/track-event";
```
In `handleSubmit`, before `startTransition`, read the checkbox state from `formData` and fire the event if checked:
```ts
  function handleSubmit(formData: FormData) {
    setError(null);
    if (formData.get("newsletterOptIn") === "on") {
      trackEvent("newsletter_opted_in");
    }
    startTransition(async () => {
      const result = await signup(formData, language);
      if (!result.ok) {
        setError({ message: result.error.message, recovery: result.error.recovery });
      }
    });
  }
```
This fires optimistically (before the server action confirms success) — acceptable here since `trackEvent` is a cheap, non-blocking client call and a failed signup after this point is rare and not worth the complexity of threading the event through the server action's `Result`.

- [ ] **Step 6: Typecheck and lint**

Run: `cd project && npx tsc --noEmit && npx eslint src/app/signup/signup-form.tsx src/app/signup/actions.ts src/lib/i18n/copy.ts`
Expected: no errors.

- [ ] **Step 7: Manual verification**

Start the dev server (check if one's already running on :3000 first), navigate to `/signup`, confirm the checkbox renders (unchecked by default) below the password field with the correct label text and a visible focus ring. Screenshot at 1440px to `artifacts/review/signup-newsletter-optin.png`.

- [ ] **Step 8: Commit**

```bash
git add project/src/lib/i18n/copy.ts project/src/app/signup/signup-form.tsx project/src/app/signup/actions.ts project/artifacts/review/signup-newsletter-optin.png
git commit -m "feat: add newsletter opt-in checkbox to signup"
```

---

## Task 5: `countRegisteredUsers` helper

**Files:**
- Create: `src/lib/profile/count-registered.ts`
- Test: `src/lib/profile/count-registered.test.ts`

**Interfaces:**
- Produces: `countRegisteredUsers(service: SupabaseClient): Promise<number>` — consumed by Task 8's landing page.

- [ ] **Step 1: Write the test**

Create `src/lib/profile/count-registered.test.ts`:
```ts
import type { SupabaseClient } from "@supabase/supabase-js";
import { countRegisteredUsers } from "./count-registered";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

async function run() {
  const fakeClient = {
    from: () => ({
      select: async () => ({ count: 348 }),
    }),
  } as unknown as SupabaseClient;

  const result = await countRegisteredUsers(fakeClient);
  assert(result === 347, "subtracts the fixed seed/demo account from the raw count");

  const emptyClient = {
    from: () => ({
      select: async () => ({ count: 0 }),
    }),
  } as unknown as SupabaseClient;

  const emptyResult = await countRegisteredUsers(emptyClient);
  assert(emptyResult === 0, "never returns negative when the raw count is 0 (floors at 0, not -1)");

  const nullClient = {
    from: () => ({
      select: async () => ({ count: null }),
    }),
  } as unknown as SupabaseClient;

  const nullResult = await countRegisteredUsers(nullClient);
  assert(nullResult === 0, "treats a null count (query failure) as 0, not a crash");
}

run();
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd project && npx tsx src/lib/profile/count-registered.test.ts`
Expected: fails with a module-not-found error for `./count-registered`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/profile/count-registered.ts`:
```ts
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Counts registered accounts for the landing page's social-proof counter,
 * minus the one fixed seed/demo account (`demo@germanpostreader.app`,
 * created by `lib/seed/seed.ts`) so internal testing never inflates a
 * number meant to represent real signups. The seed script's find-or-create
 * check guarantees at most one such account ever exists, so subtracting a
 * fixed 1 is exact — no per-request lookup needed.
 */
export async function countRegisteredUsers(service: SupabaseClient): Promise<number> {
  const { count } = await service.from("profiles").select("*", { count: "exact", head: true });
  return Math.max((count ?? 0) - 1, 0);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd project && npx tsx src/lib/profile/count-registered.test.ts`
Expected: three `PASS:` lines, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add project/src/lib/profile/count-registered.ts project/src/lib/profile/count-registered.test.ts
git commit -m "feat: add countRegisteredUsers helper for the landing page counter"
```

---

## Task 6: `/welcome` post-onboarding share screen

**Files:**
- Modify: `src/app/onboarding/actions.ts`
- Create: `src/app/welcome/page.tsx`
- Create: `src/app/welcome/loading.tsx`
- Create: `src/components/share-buttons.tsx`
- Modify: `src/lib/i18n/copy.ts` (new top-level `welcome` type + EN/AR/TR content)

**Interfaces:**
- Consumes: `DEMO_MODE` from Task 2.
- Produces: nothing new consumed by later tasks — this is a leaf route.

- [ ] **Step 1: Change the onboarding redirect**

In `src/app/onboarding/actions.ts`, add the import:
```ts
import { DEMO_MODE } from "@/lib/constants";
```
Change the final line from:
```ts
  redirect("/dashboard");
```
to:
```ts
  redirect(DEMO_MODE ? "/welcome" : "/dashboard");
```

- [ ] **Step 2: Add the `welcome` copy type**

In `src/lib/i18n/copy.ts`, find the closing of the top-level `AppCopy` type:
```ts
  cookieConsent: {
    ariaLabel: string;
    message: string;
    accept: string;
    decline: string;
  };
};
```
Insert a new `welcome` section before the final `};`:
```ts
  cookieConsent: {
    ariaLabel: string;
    message: string;
    accept: string;
    decline: string;
  };
  welcome: {
    heading: string;
    body: string;
    shareHeading: string;
    shareTwitter: string;
    shareWhatsapp: string;
    shareCopyLink: string;
    linkCopiedToast: string;
    shareTweetText: string;
    shareWhatsappText: string;
    continueButton: string;
  };
};
```

- [ ] **Step 3: Add the EN content**

Find the end of `APP_COPY.en`'s `cookieConsent` block (the last section before the closing `},` of the `en:` object) and add a `welcome` block as a sibling:
```ts
    welcome: {
      heading: "You're in.",
      body: "We'll email you the moment Papkram fully launches.",
      shareHeading: "Know someone who gets confusing German mail?",
      shareTwitter: "Share on X",
      shareWhatsapp: "Share on WhatsApp",
      shareCopyLink: "Copy link",
      linkCopiedToast: "Link copied.",
      shareTweetText: "Papkram translates confusing German mail into plain language, with deadlines and a ready-to-send reply.",
      shareWhatsappText: "I've been using Papkram to make sense of confusing German mail — worth a look:",
      continueButton: "Continue to dashboard",
    },
```

- [ ] **Step 4: Add the AR content**

```ts
    welcome: {
      heading: "أنت الآن ضمن القائمة.",
      body: "سنراسلك بالبريد الإلكتروني بمجرد إطلاق Papkram رسميًا.",
      shareHeading: "تعرف شخصًا يستلم بريدًا ألمانيًا مربكًا؟",
      shareTwitter: "شارك على X",
      shareWhatsapp: "شارك على واتساب",
      shareCopyLink: "نسخ الرابط",
      linkCopiedToast: "تم نسخ الرابط.",
      shareTweetText: "يترجم Papkram البريد الألماني المربك إلى لغة واضحة، مع المواعيد النهائية ورد جاهز للإرسال.",
      shareWhatsappText: "أستخدم Papkram لفهم البريد الألماني المربك — يستحق نظرة:",
      continueButton: "الانتقال إلى لوحة التحكم",
    },
```

- [ ] **Step 5: Add the TR content**

```ts
    welcome: {
      heading: "Kaydınız alındı.",
      body: "Papkram tam olarak yayına girer girmez size e-posta göndereceğiz.",
      shareHeading: "Kafa karıştırıcı Almanca mektuplar alan birini tanıyor musunuz?",
      shareTwitter: "X'te paylaş",
      shareWhatsapp: "WhatsApp'ta paylaş",
      shareCopyLink: "Bağlantıyı kopyala",
      linkCopiedToast: "Bağlantı kopyalandı.",
      shareTweetText: "Papkram, kafa karıştırıcı Almanca mektupları anlaşılır bir dile, son tarihlerle ve gönderime hazır bir yanıtla birlikte çeviriyor.",
      shareWhatsappText: "Kafa karıştırıcı Almanca mektupları anlamak için Papkram kullanıyorum — göz atmaya değer:",
      continueButton: "Panele devam et",
    },
```

- [ ] **Step 6: Write the ShareButtons component**

Create `src/components/share-buttons.tsx`:
```tsx
"use client";

import { toast } from "sonner";
import { Copy } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track-event";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

const X_LOGO_PATH =
  "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";

function shareUrl(base: string, via: "twitter" | "whatsapp" | "copy_link") {
  const url = new URL(base);
  url.searchParams.set("src", "share");
  url.searchParams.set("via", via);
  return url.toString();
}

export function ShareButtons({ language = "en" }: { language?: AppLanguage }) {
  const copy = APP_COPY[language].welcome;

  function landingUrl(via: "twitter" | "whatsapp" | "copy_link") {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://papkram.de";
    return shareUrl(origin, via);
  }

  function handleTwitterShare() {
    trackEvent("share_link_clicked", { platform: "twitter" });
    const url = new URL("https://x.com/intent/tweet");
    url.searchParams.set("text", copy.shareTweetText);
    url.searchParams.set("url", landingUrl("twitter"));
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  function handleWhatsappShare() {
    trackEvent("share_link_clicked", { platform: "whatsapp" });
    const url = new URL("https://wa.me/");
    url.searchParams.set("text", `${copy.shareWhatsappText} ${landingUrl("whatsapp")}`);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  }

  async function handleCopyLink() {
    trackEvent("share_link_clicked", { platform: "copy_link" });
    await navigator.clipboard.writeText(landingUrl("copy_link"));
    toast.success(copy.linkCopiedToast);
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={handleTwitterShare}
        className="flex h-11 items-center gap-2.5 rounded-sm border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={X_LOGO_PATH} />
        </svg>
        {copy.shareTwitter}
      </button>
      <button
        type="button"
        onClick={handleWhatsappShare}
        className="flex h-11 items-center gap-2.5 rounded-sm border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.004c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23a8.2 8.2 0 0 1-4.19-1.15l-.3-.17-3.12.82.83-3.04-.19-.32a8.18 8.18 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.24-8.24m-4.53 4.71c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35.99 2.51c.12.16 1.7 2.71 4.21 3.7 2.08.83 2.5.66 2.96.62.45-.04 1.45-.6 1.66-1.17.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.46-.28-.24-.12-1.45-.71-1.67-.8-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.96-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.36-.77-1.85-.2-.48-.4-.42-.55-.42z" />
        </svg>
        {copy.shareWhatsapp}
      </button>
      <button
        type="button"
        onClick={handleCopyLink}
        className="flex h-11 items-center gap-2.5 rounded-sm border-2 border-border bg-card px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Copy className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {copy.shareCopyLink}
      </button>
    </div>
  );
}
```

- [ ] **Step 7: Write the /welcome page**

Create `src/app/welcome/page.tsx`:
```tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { ShareButtons } from "@/components/share-buttons";
import { buttonVariants } from "@/components/ui/button";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

export const metadata = {
  title: "You're in — Papkram",
  robots: { index: false },
};

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("language").eq("id", user.id).single();

  const language = (profile?.language ?? "en") as AppLanguage;
  const copy = APP_COPY[language].welcome;
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <>
      <AppHeader language={language} />
      <main dir={dir} className="flex flex-1 flex-col bg-background">
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-md text-center">
            <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
              {copy.heading}
            </h1>
            <p className="mt-3 text-base text-foreground/80">{copy.body}</p>

            <div className="mt-10 rounded-md border-2 border-border bg-card p-6 text-start shadow-[4px_4px_0_0_var(--border)]">
              <p className="mb-4 text-center text-sm font-bold text-foreground">{copy.shareHeading}</p>
              <ShareButtons language={language} />
            </div>

            <Link
              href="/dashboard"
              className={buttonVariants({ className: "mt-8 h-12 w-full rounded-sm text-base font-bold" })}
            >
              {copy.continueButton}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 8: Write the loading skeleton**

Create `src/app/welcome/loading.tsx`:
```tsx
import { Skeleton } from "@/components/ui/skeleton";
import { AppHeader } from "@/components/app-header";

export default function WelcomeLoading() {
  return (
    <>
      <AppHeader />
      <main className="flex flex-1 flex-col bg-background">
        <div className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="w-full max-w-md text-center">
            <Skeleton className="mx-auto h-9 w-48" />
            <Skeleton className="mx-auto mt-3 h-5 w-64" />
            <Skeleton className="mx-auto mt-10 h-56 w-full rounded-md" />
            <Skeleton className="mx-auto mt-8 h-12 w-full rounded-sm" />
          </div>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 9: Typecheck and lint**

Run: `cd project && npx tsc --noEmit && npx eslint src/app/welcome src/components/share-buttons.tsx src/app/onboarding/actions.ts src/lib/i18n/copy.ts`
Expected: no errors.

- [ ] **Step 10: Manual verification**

Start the dev server, sign up a fresh throwaway account through the real UI (or navigate directly to `/welcome` while logged in as the seed demo account, since onboarding is a one-time flow), confirm the page renders, the three share buttons are present with 44px+ touch targets, clicking "Copy link" shows a toast, and the "Continue to dashboard" button navigates correctly. Screenshot at 1440px, 375px, and once in Arabic (RTL) to `artifacts/review/welcome-{1440,375,ar}.png`.

- [ ] **Step 11: Commit**

```bash
git add project/src/app/onboarding/actions.ts project/src/app/welcome project/src/components/share-buttons.tsx project/src/lib/i18n/copy.ts project/artifacts/review/welcome-*.png
git commit -m "feat: add post-onboarding /welcome share screen"
```

---

## Task 7: Welcome email — demo-mode rewrite

The existing signup welcome email (`WelcomeEmail.tsx`, sent immediately on signup via `sendWelcomeEmail()`) currently quotes the €29.99/year subscription price in its `priceNote` line — wrong messaging once nothing's actually for sale. This task gates that one line (plus the pill badge and heading, which reference "account" language) behind `DEMO_MODE`, leaving the original pricing-aware copy fully intact for when selling resumes — same discipline as every other gated surface in this plan. The three feature cards, the risk note, the CTA, and the footer are already accurate regardless of demo mode and stay untouched.

**Files:**
- Modify: `src/emails/copy.ts` (type + EN/AR/TR content)
- Modify: `src/emails/WelcomeEmail.tsx`
- Modify: `src/lib/email/send-welcome-email.ts`

**Interfaces:**
- Consumes: `DEMO_MODE` from Task 2.
- Produces: nothing new consumed by later tasks.

- [ ] **Step 1: Add the demo-mode fields to the type**

In `src/emails/copy.ts`, find the `WelcomeEmailCopy` type:
```ts
type WelcomeEmailCopy = {
  dir: "ltr" | "rtl";
  subject: (freeLetterLimit: number) => string;
  preview: (freeLetterLimit: number) => string;
  pill: string;
  heading: string;
  intro: (freeLetterLimit: number) => string;
  features: { label: string; text: string }[];
  riskNote: string;
  priceNote: (price: string) => string;
  cta: string;
  footer: string;
};
```
Add three fields after `priceNote`:
```ts
type WelcomeEmailCopy = {
  dir: "ltr" | "rtl";
  subject: (freeLetterLimit: number) => string;
  preview: (freeLetterLimit: number) => string;
  pill: string;
  heading: string;
  intro: (freeLetterLimit: number) => string;
  features: { label: string; text: string }[];
  riskNote: string;
  priceNote: (price: string) => string;
  pillDemo: string;
  headingDemo: string;
  demoNote: string;
  cta: string;
  footer: string;
};
```

- [ ] **Step 2: Add the EN content**

In `WELCOME_EMAIL_COPY.en`, find the `priceNote: (price) => ...` line and add the three new fields immediately after it:
```ts
    priceNote: (price) => `After your free letters, unlocking unlimited letters is ${price} per year.`,
    pillDemo: "Demo ready",
    headingDemo: "Your free demo is ready",
    demoNote: "We're not selling yet — once Papkram fully launches, we'll email you.",
```

- [ ] **Step 3: Add the AR content**

In `WELCOME_EMAIL_COPY.ar`, same insertion point:
```ts
    priceNote: (price) => `بعد خطاباتك المجانية، فتح خطابات غير محدودة يكلف ${price} سنويًا.`,
    pillDemo: "التجربة جاهزة",
    headingDemo: "تجربتك المجانية جاهزة الآن",
    demoNote: "لسنا نبيع بعد — بمجرد إطلاق Papkram رسميًا، سنراسلك بالبريد الإلكتروني.",
```

- [ ] **Step 4: Add the TR content**

In `WELCOME_EMAIL_COPY.tr`, same insertion point:
```ts
    priceNote: (price) => `Ücretsiz mektuplarınızdan sonra sınırsız mektubun kilidini açmak yılda ${price}.`,
    pillDemo: "Demo hazır",
    headingDemo: "Ücretsiz demonuz hazır",
    demoNote: "Henüz satış yapmıyoruz — Papkram tam olarak yayına girdiğinde size e-posta göndereceğiz.",
```

- [ ] **Step 5: Branch the rendered email on `DEMO_MODE`**

In `src/emails/WelcomeEmail.tsx`, add the import:
```ts
import { DEMO_MODE } from "@/lib/constants";
```
Change:
```tsx
            <span style={styles.pill}>{copy.pill}</span>
            <Heading style={{ ...styles.heading, textAlign: align }}>{copy.heading}</Heading>
            <Text style={{ ...styles.text, textAlign: align }}>
              {copy.intro(FREE_LETTER_LIMIT)}
            </Text>

            {copy.features.map((feature) => (
              <div key={feature.label} style={{ ...styles.featureCard, textAlign: align }}>
                <Text style={{ ...styles.featureLabel, textAlign: align }}>{feature.label}</Text>
                <Text style={{ ...styles.featureText, textAlign: align }}>{feature.text}</Text>
              </div>
            ))}

            <Text style={{ ...styles.muted, textAlign: align }}>{copy.riskNote}</Text>
            <Text style={{ ...styles.muted, textAlign: align }}>
              {copy.priceNote(formatEur(SUBSCRIPTION_PRICE_EUR))}
            </Text>
```
to:
```tsx
            <span style={styles.pill}>{DEMO_MODE ? copy.pillDemo : copy.pill}</span>
            <Heading style={{ ...styles.heading, textAlign: align }}>
              {DEMO_MODE ? copy.headingDemo : copy.heading}
            </Heading>
            <Text style={{ ...styles.text, textAlign: align }}>
              {copy.intro(FREE_LETTER_LIMIT)}
            </Text>

            {copy.features.map((feature) => (
              <div key={feature.label} style={{ ...styles.featureCard, textAlign: align }}>
                <Text style={{ ...styles.featureLabel, textAlign: align }}>{feature.label}</Text>
                <Text style={{ ...styles.featureText, textAlign: align }}>{feature.text}</Text>
              </div>
            ))}

            <Text style={{ ...styles.muted, textAlign: align }}>{copy.riskNote}</Text>
            <Text style={{ ...styles.muted, textAlign: align }}>
              {DEMO_MODE ? copy.demoNote : copy.priceNote(formatEur(SUBSCRIPTION_PRICE_EUR))}
            </Text>
```

- [ ] **Step 6: Branch the plain-text fallback the same way**

In `src/lib/email/send-welcome-email.ts`, add the import:
```ts
import { DEMO_MODE } from "@/lib/constants";
```
Change:
```ts
function plainTextBody(language: AppLanguage) {
  const copy = WELCOME_EMAIL_COPY[language];
  const lines = [
    copy.heading,
    "",
    copy.intro(FREE_LETTER_LIMIT),
    "",
    ...copy.features.map((f) => `${f.label}: ${f.text}`),
    "",
    copy.riskNote,
    copy.priceNote(formatEur(SUBSCRIPTION_PRICE_EUR)),
    "",
    `${copy.cta}: https://papkram.de/upload`,
    "",
    copy.footer,
  ];
  return lines.join("\n");
}
```
to:
```ts
function plainTextBody(language: AppLanguage) {
  const copy = WELCOME_EMAIL_COPY[language];
  const lines = [
    DEMO_MODE ? copy.headingDemo : copy.heading,
    "",
    copy.intro(FREE_LETTER_LIMIT),
    "",
    ...copy.features.map((f) => `${f.label}: ${f.text}`),
    "",
    copy.riskNote,
    DEMO_MODE ? copy.demoNote : copy.priceNote(formatEur(SUBSCRIPTION_PRICE_EUR)),
    "",
    `${copy.cta}: https://papkram.de/upload`,
    "",
    copy.footer,
  ];
  return lines.join("\n");
}
```

- [ ] **Step 7: Typecheck and lint**

Run: `cd project && npx tsc --noEmit && npx eslint src/emails/copy.ts src/emails/WelcomeEmail.tsx src/lib/email/send-welcome-email.ts`
Expected: no errors.

- [ ] **Step 8: Manual verification**

React Email templates render server-side only (via Resend's `react:` option), so there's no dev-server route to view this in a browser directly. Instead, temporarily add a throwaway preview route or use `@react-email/render`'s `render()` function in a quick one-off script to render `WelcomeEmail({ language: "en" })` to HTML and open the output file in a browser — confirm the pill reads "Demo ready", the heading reads "Your free demo is ready", and the price line is replaced by the demo note. Delete any throwaway script/route created for this check before committing. Screenshot the rendered HTML to `artifacts/review/welcome-email-demo.png`.

- [ ] **Step 9: Commit**

```bash
git add project/src/emails/copy.ts project/src/emails/WelcomeEmail.tsx project/src/lib/email/send-welcome-email.ts project/artifacts/review/welcome-email-demo.png
git commit -m "feat: rewrite welcome email for demo mode, drop price mention"
```

---

## Task 8: Landing page — signup counter + demo pitch section

**Files:**
- Modify: `src/components/landing/copy.ts` (type + EN/AR/TR content)
- Create: `src/components/landing/demo-pitch.tsx`
- Create: `src/components/landing/share-source-tracker.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `DEMO_MODE` from Task 2; `countRegisteredUsers(service)` from Task 5.
- Produces: nothing new consumed by later tasks.

**Note on the funnel property (deviation from the design doc, reasoned):** the design doc describes attaching `src`/`via` as properties on Posthog's auto-captured `$pageview` event. `PosthogProvider.tsx` uses `capture_pageview: true`, which fires that pageview synchronously inside `posthog.init()` — there's no reliable hook to attach extra properties to that specific auto-captured event without fighting posthog-js's own timing. Instead, `ShareSourceTracker` fires a small dedicated event (`demo_share_landing_view`) when `src=share` is present. This gives the same funnel visibility (`share_link_clicked` on `/welcome` → `demo_share_landing_view` on `/` → `signup`) without relying on undocumented pageview-property timing.

- [ ] **Step 1: Add the `demoPitch` copy type**

In `src/components/landing/copy.ts`, find the `MarketingCopy` type's `cta`/`footer` tail:
```ts
  cta: { badge: string; heading: string; button: string };
  footer: { privacy: string; terms: string; contact: string };
};
```
Insert `demoPitch` before it:
```ts
  demoPitch: {
    counter: (registeredCount: number) => string;
    heading: string;
    body: string;
    cta: string;
  };
  cta: { badge: string; heading: string; button: string };
  footer: { privacy: string; terms: string; contact: string };
};
```

- [ ] **Step 2: Add the EN content**

Find `MARKETING_COPY.en`'s `offer: { ... }` block (it directly precedes `bonuses: { ... }`) and insert a `demoPitch` sibling block anywhere after `trust` and before `cta` — the simplest anchor is immediately before the existing `offer: {` line:
```ts
    demoPitch: {
      counter: (registeredCount) => `${registeredCount} people signed up for early access`,
      heading: "Free demo, no card needed.",
      body: "Try 4 real letters. We're not selling yet — sign up and we'll email you the moment Papkram fully launches.",
      cta: "Start free demo",
    },
```

- [ ] **Step 3: Add the AR content**

Same insertion point in `MARKETING_COPY.ar`:
```ts
    demoPitch: {
      counter: (registeredCount) => `${registeredCount} شخصًا سجلوا للوصول المبكر`,
      heading: "تجربة مجانية، بدون بطاقة.",
      body: "جرّب 4 خطابات حقيقية. لسنا نبيع بعد — سجّل وسنراسلك بالبريد الإلكتروني بمجرد إطلاق Papkram رسميًا.",
      cta: "ابدأ التجربة المجانية",
    },
```

- [ ] **Step 4: Add the TR content**

Same insertion point in `MARKETING_COPY.tr`:
```ts
    demoPitch: {
      counter: (registeredCount) => `${registeredCount} kişi erken erişim için kaydoldu`,
      heading: "Ücretsiz demo, kart gerekmez.",
      body: "4 gerçek mektubu deneyin. Henüz satış yapmıyoruz — kaydolun, Papkram tam olarak yayına girer girmez size e-posta gönderelim.",
      cta: "Ücretsiz demoyu başlat",
    },
```

- [ ] **Step 5: Write the DemoPitch component**

Create `src/components/landing/demo-pitch.tsx`:
```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function DemoPitch({ registeredCount }: { registeredCount: number }) {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-lg border-2 border-border bg-card p-8 shadow-[6px_6px_0_0_var(--border)]"
        >
          <span className="rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
            {copy.demoPitch.counter(registeredCount)}
          </span>
          <h2 className="mt-4 font-heading text-2xl font-extrabold tracking-[-0.02em] text-foreground md:text-3xl">
            {copy.demoPitch.heading}
          </h2>
          <p className="mt-2 text-sm text-foreground/70">{copy.demoPitch.body}</p>
          <Link
            href="/signup"
            className={buttonVariants({ className: "mt-6 h-12 w-full rounded-sm text-base font-bold" })}
          >
            {copy.demoPitch.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Write the ShareSourceTracker component**

Create `src/components/landing/share-source-tracker.tsx`:
```tsx
"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track-event";

/** Fires once if the landing page was reached via a /welcome share link (`?src=share&via=...`) — the middle step of the share → landing → signup funnel. */
export function ShareSourceTracker({ src, via }: { src?: string; via?: string }) {
  useEffect(() => {
    if (src === "share") {
      trackEvent("demo_share_landing_view", { via });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
```

- [ ] **Step 7: Wire it all into the landing page**

Replace the full contents of `src/app/page.tsx`:
```tsx
import { LocaleProvider } from "@/components/landing/locale-context";
import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TrustCallout } from "@/components/landing/trust-callout";
import { ValueStack } from "@/components/landing/value-stack";
import { Bonuses } from "@/components/landing/bonuses";
import { DemoPitch } from "@/components/landing/demo-pitch";
import { ShareSourceTracker } from "@/components/landing/share-source-tracker";
import { CtaBand } from "@/components/landing/cta-band";
import { LandingFooter } from "@/components/landing/footer";
import { getPreAuthLanguage } from "@/lib/i18n/get-locale";
import { DEMO_MODE } from "@/lib/constants";
import { createServiceClient } from "@/lib/supabase/service";
import { countRegisteredUsers } from "@/lib/profile/count-registered";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ src?: string; via?: string }>;
}) {
  const language = await getPreAuthLanguage();
  const { src, via } = await searchParams;
  const registeredCount = DEMO_MODE ? await countRegisteredUsers(createServiceClient()) : 0;

  return (
    <LocaleProvider initialLocale={language}>
      <ShareSourceTracker src={src} via={via} />
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <TrustCallout />
        {DEMO_MODE ? (
          <DemoPitch registeredCount={registeredCount} />
        ) : (
          <>
            <ValueStack />
            <Bonuses />
          </>
        )}
        <CtaBand />
      </main>
      <LandingFooter />
    </LocaleProvider>
  );
}
```

- [ ] **Step 8: Typecheck and lint**

Run: `cd project && npx tsc --noEmit && npx eslint src/app/page.tsx src/components/landing/copy.ts src/components/landing/demo-pitch.tsx src/components/landing/share-source-tracker.tsx`
Expected: no errors.

- [ ] **Step 9: Manual verification**

Start the dev server, navigate to `/`, confirm the pricing/bonuses sections are gone and replaced by the counter + demo pitch card, with a real (non-zero, since the seed account plus any signups from earlier manual testing this session should exist) count. Screenshot at 1440px, 375px, and Arabic (RTL) to `artifacts/review/landing-demo-pitch-{1440,375,ar}.png`. Also navigate to `/?src=share&via=twitter` and confirm no visible UI change (the tracker is invisible) and no console errors.

- [ ] **Step 10: Commit**

```bash
git add project/src/components/landing/copy.ts project/src/components/landing/demo-pitch.tsx project/src/components/landing/share-source-tracker.tsx project/src/app/page.tsx project/artifacts/review/landing-demo-pitch-*.png
git commit -m "feat: replace landing pricing section with demo pitch + signup counter"
```

---

## Task 9: `DemoLimitModal` — the 4-letter cap experience

**Files:**
- Modify: `src/lib/i18n/copy.ts` (new top-level `demoLimit` type + EN/AR/TR content)
- Create: `src/components/DemoLimitModal.tsx`
- Modify: `src/app/(app)/upload/upload-form.tsx`

**Interfaces:**
- Consumes: `DEMO_MODE` from Task 2.
- Produces: nothing new consumed by later tasks.

- [ ] **Step 1: Add the `demoLimit` copy type**

In `src/lib/i18n/copy.ts`, find the `paywall` type block:
```ts
  paywall: {
    badge: string;
    heading: (limit: number) => string;
    description: (price: string, interval: "year" | "month") => string;
    planToggle: { yearly: string; monthly: string };
    redirecting: string;
    subscribe: (price: string, interval: "year" | "month") => string;
    checkoutError: string;
    earlyAccessConsent: string;
    earlyAccessConsentRequired: string;
  };
```
Add a `demoLimit` sibling immediately after it:
```ts
  demoLimit: {
    badge: string;
    heading: (limit: number) => string;
    body: string;
    backToDashboard: string;
  };
```

- [ ] **Step 2: Add the EN/AR/TR content**

Find each language's `paywall: { ... }` content block and add a `demoLimit` sibling immediately after it.

EN:
```ts
    demoLimit: {
      badge: "Demo complete",
      heading: (limit) => `You've used all ${limit} demo letters.`,
      body: "That's the full experience — upload, plain-language summary, deadlines, ready-to-send reply. We'll email you at launch.",
      backToDashboard: "Back to dashboard",
    },
```
AR:
```ts
    demoLimit: {
      badge: "اكتملت التجربة",
      heading: (limit) => `لقد استخدمت جميع الـ ${limit} خطابات التجريبية.`,
      body: "هذه هي التجربة الكاملة — الرفع، والملخص بلغة واضحة، والمواعيد النهائية، ورد جاهز للإرسال. سنراسلك بالبريد الإلكتروني عند الإطلاق.",
      backToDashboard: "العودة إلى لوحة التحكم",
    },
```
TR:
```ts
    demoLimit: {
      badge: "Demo tamamlandı",
      heading: (limit) => `${limit} demo mektubun tümünü kullandınız.`,
      body: "İşte tam deneyim — yükleme, sade bir özet, son tarihler, gönderime hazır bir yanıt. Yayına girdiğimizde size e-posta göndereceğiz.",
      backToDashboard: "Panele dön",
    },
```

- [ ] **Step 3: Write the DemoLimitModal component**

Create `src/components/DemoLimitModal.tsx`, mirroring `PaywallModal.tsx`'s dialog structure but with no plan toggle, no consent checkbox, no payment call:
```tsx
"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FREE_LETTER_LIMIT } from "@/lib/constants";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

export function DemoLimitModal({
  open,
  onOpenChange,
  language = "en",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language?: AppLanguage;
}) {
  const copy = APP_COPY[language].demoLimit;
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir={language === "ar" ? "rtl" : "ltr"}
        className="rounded-md border-2 border-border bg-card p-8 shadow-[6px_6px_0_0_var(--border)] sm:max-w-md"
      >
        <DialogHeader>
          <span className="w-fit rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
            {copy.badge}
          </span>
          <DialogTitle className="mt-3 font-heading text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            {copy.heading(FREE_LETTER_LIMIT)}
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground/70">{copy.body}</DialogDescription>
        </DialogHeader>

        <Button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="h-12 w-full rounded-sm text-base font-bold"
        >
          {copy.backToDashboard}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Wire it into upload-form.tsx**

In `src/app/(app)/upload/upload-form.tsx`, add the imports:
```ts
import { DemoLimitModal } from "@/components/DemoLimitModal";
import { DEMO_MODE } from "@/lib/constants";
```
Change:
```tsx
  if (trialLimitReached) {
    return <PaywallModal open={trialLimitReached} onOpenChange={setTrialLimitReached} language={language} />;
  }
```
to:
```tsx
  if (trialLimitReached) {
    return DEMO_MODE ? (
      <DemoLimitModal open={trialLimitReached} onOpenChange={setTrialLimitReached} language={language} />
    ) : (
      <PaywallModal open={trialLimitReached} onOpenChange={setTrialLimitReached} language={language} />
    );
  }
```

- [ ] **Step 5: Typecheck and lint**

Run: `cd project && npx tsc --noEmit && npx eslint src/components/DemoLimitModal.tsx "src/app/(app)/upload/upload-form.tsx" src/lib/i18n/copy.ts`
Expected: no errors.

- [ ] **Step 6: Manual verification**

Start the dev server, sign in as the seed demo account (or a fresh account with `trial_letters_used` already at 4 — check via the Supabase dashboard or just upload 4 letters through the real flow if starting fresh), trigger the upload flow a 5th time, and confirm `DemoLimitModal` renders instead of `PaywallModal` — no plan toggle, no consent checkbox, just the badge/heading/body/"Back to dashboard" button. Screenshot at 1440px to `artifacts/review/demo-limit-modal.png`.

- [ ] **Step 7: Commit**

```bash
git add project/src/lib/i18n/copy.ts project/src/components/DemoLimitModal.tsx "project/src/app/(app)/upload/upload-form.tsx" project/artifacts/review/demo-limit-modal.png
git commit -m "feat: add DemoLimitModal for the 4-letter demo cap"
```

---

## Task 10: Dashboard — demo-mode letter-count copy

**Files:**
- Modify: `src/lib/i18n/copy.ts` (new `lettersUsedDemo` key in the `dashboard` type + EN/AR/TR content)
- Modify: `src/app/(app)/dashboard/page.tsx`

**Interfaces:**
- Consumes: `DEMO_MODE` from Task 2.
- Produces: nothing new consumed by later tasks.

- [ ] **Step 1: Add the copy key to the type**

In `src/lib/i18n/copy.ts`, find:
```ts
    lettersUsed: (used: number, limit: number) => string;
    unlockCta: (price: string) => string;
```
Add `lettersUsedDemo` between them:
```ts
    lettersUsed: (used: number, limit: number) => string;
    lettersUsedDemo: (used: number, limit: number) => string;
    unlockCta: (price: string) => string;
```

- [ ] **Step 2: Add the EN/AR/TR content**

Find each language's `lettersUsed: (used, limit) => ...` content line and add `lettersUsedDemo` immediately after it.

EN (after `lettersUsed: (used, limit) => \`${used} of ${limit} free letters used\`,`):
```ts
      lettersUsedDemo: (used, limit) => `${used} of ${limit} demo letters used`,
```
AR (after `lettersUsed: (used, limit) => \`${used} من ${limit} خطابات مجانية مستخدمة\`,`):
```ts
      lettersUsedDemo: (used, limit) => `${used} من ${limit} خطابات تجريبية مستخدمة`,
```
TR (after `lettersUsed: (used, limit) => \`${limit} ücretsiz mektuptan ${used} tanesi kullanıldı\`,`):
```ts
      lettersUsedDemo: (used, limit) => `${limit} demo mektuptan ${used} tanesi kullanıldı`,
```

- [ ] **Step 3: Wire it into the dashboard page**

In `src/app/(app)/dashboard/page.tsx`, add the import:
```ts
import { DEMO_MODE, FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
```
(replacing the existing `import { FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";` line — just add `DEMO_MODE,` to the existing import, don't duplicate the import statement).

Change:
```tsx
              <span className="rounded-full border-2 border-border bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-foreground">
                {copy.dashboard.lettersUsed(trialUsed, FREE_LETTER_LIMIT)}
              </span>
              {lettersLeft === 0 && (
                <p className="text-sm font-medium text-accent-foreground">
                  {copy.dashboard.unlockCta(formatEur(SUBSCRIPTION_PRICE_EUR))}
                </p>
              )}
```
to:
```tsx
              <span className="rounded-full border-2 border-border bg-background px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-foreground">
                {DEMO_MODE
                  ? copy.dashboard.lettersUsedDemo(trialUsed, FREE_LETTER_LIMIT)
                  : copy.dashboard.lettersUsed(trialUsed, FREE_LETTER_LIMIT)}
              </span>
              {!DEMO_MODE && lettersLeft === 0 && (
                <p className="text-sm font-medium text-accent-foreground">
                  {copy.dashboard.unlockCta(formatEur(SUBSCRIPTION_PRICE_EUR))}
                </p>
              )}
```

- [ ] **Step 4: Typecheck and lint**

Run: `cd project && npx tsc --noEmit && npx eslint "src/app/(app)/dashboard/page.tsx" src/lib/i18n/copy.ts`
Expected: no errors.

- [ ] **Step 5: Manual verification**

Start the dev server, sign in as the seed demo account, navigate to `/dashboard`, confirm the badge reads "X OF 4 DEMO LETTERS USED" and no "unlock unlimited" upsell line appears. Screenshot at 1440px to `artifacts/review/dashboard-demo-badge.png`.

- [ ] **Step 6: Commit**

```bash
git add project/src/lib/i18n/copy.ts "project/src/app/(app)/dashboard/page.tsx" project/artifacts/review/dashboard-demo-badge.png
git commit -m "feat: reword dashboard letter count for demo mode"
```

---

## Task 11: Settings — hide Subscription section in demo mode

**Files:**
- Modify: `src/lib/i18n/copy.ts` (new `demoNotice` key in the `settings` type + EN/AR/TR content)
- Modify: `src/app/(app)/settings/page.tsx`

**Interfaces:**
- Consumes: `DEMO_MODE` from Task 2.
- Produces: nothing new consumed by later tasks.

- [ ] **Step 1: Add the copy key to the type**

In `src/lib/i18n/copy.ts`, find the `settings` type block's `subscriptionFree: string;` line and add `demoNotice` immediately after it:
```ts
    subscriptionActive: string;
    subscriptionFree: string;
    demoNotice: string;
    accountHeading: string;
```

- [ ] **Step 2: Add the EN/AR/TR content**

Find each language's `subscriptionFree: ...` content line and add `demoNotice` immediately after it.

EN:
```ts
      demoNotice: "Papkram is currently a free demo. You'll be notified by email when full access launches.",
```
AR:
```ts
      demoNotice: "Papkram حاليًا في وضع التجربة المجانية. سنُخطرك بالبريد الإلكتروني عند إطلاق الوصول الكامل.",
```
TR:
```ts
      demoNotice: "Papkram şu anda ücretsiz demo aşamasında. Tam erişim yayına girdiğinde size e-posta ile haber vereceğiz.",
```

- [ ] **Step 3: Gate the Subscription section**

In `src/app/(app)/settings/page.tsx`, add the import:
```ts
import { DEMO_MODE } from "@/lib/constants";
```
Change:
```tsx
        <section className="mb-6 rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {copy.subscriptionHeading}
          </h2>
          <p className="mt-1 text-sm text-foreground/70">
            {hasActiveSubscription ? copy.subscriptionActive : copy.subscriptionFree}
          </p>
          <div className="mt-4">
            {hasActiveSubscription ? (
              <ManageSubscriptionLink
                copy={{
                  manageSubscription: dashboardCopy.manageSubscription,
                  openingPortal: dashboardCopy.openingPortal,
                  portalError: dashboardCopy.portalError,
                }}
              />
            ) : (
              <SettingsUpgradeButton language={language} />
            )}
          </div>
        </section>
```
to:
```tsx
        <section className="mb-6 rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {copy.subscriptionHeading}
          </h2>
          {DEMO_MODE ? (
            <p className="mt-1 text-sm text-foreground/70">{copy.demoNotice}</p>
          ) : (
            <>
              <p className="mt-1 text-sm text-foreground/70">
                {hasActiveSubscription ? copy.subscriptionActive : copy.subscriptionFree}
              </p>
              <div className="mt-4">
                {hasActiveSubscription ? (
                  <ManageSubscriptionLink
                    copy={{
                      manageSubscription: dashboardCopy.manageSubscription,
                      openingPortal: dashboardCopy.openingPortal,
                      portalError: dashboardCopy.portalError,
                    }}
                  />
                ) : (
                  <SettingsUpgradeButton language={language} />
                )}
              </div>
            </>
          )}
        </section>
```

- [ ] **Step 4: Typecheck and lint**

Run: `cd project && npx tsc --noEmit && npx eslint "src/app/(app)/settings/page.tsx" src/lib/i18n/copy.ts`
Expected: no errors.

- [ ] **Step 5: Manual verification**

Start the dev server, sign in as the seed demo account, navigate to `/settings`, confirm the Subscription section shows only the one-line demo notice — no plan toggle, no Stripe checkout button, no manage-subscription link. Screenshot at 1440px to `artifacts/review/settings-demo-notice.png`.

- [ ] **Step 6: Commit**

```bash
git add project/src/lib/i18n/copy.ts "project/src/app/(app)/settings/page.tsx" project/artifacts/review/settings-demo-notice.png
git commit -m "feat: hide settings subscription section in demo mode"
```

---

## Task 12: OG image — demo/waitlist tagline

**Files:**
- Modify: `src/app/opengraph-image.tsx`

**Interfaces:**
- Consumes: `DEMO_MODE` from Task 2.
- Produces: nothing new consumed by later tasks.

- [ ] **Step 1: Gate the tagline**

In `src/app/opengraph-image.tsx`, add the import:
```ts
import { DEMO_MODE } from "@/lib/constants";
```
Change:
```tsx
        <span
          style={{
            marginTop: 40,
            fontSize: 32,
            color: "#1a0a2e",
            fontWeight: 500,
          }}
        >
          Plain-language summaries, deadlines, and reply drafts.
        </span>
```
to:
```tsx
        <span
          style={{
            marginTop: 40,
            fontSize: 32,
            color: "#1a0a2e",
            fontWeight: 500,
          }}
        >
          {DEMO_MODE
            ? "Free demo now. We'll email you when we fully launch."
            : "Plain-language summaries, deadlines, and reply drafts."}
        </span>
```

- [ ] **Step 2: Typecheck**

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual verification**

Start the dev server, navigate directly to `http://localhost:3000/opengraph-image` in the browser, confirm the generated image renders with the new demo tagline. Screenshot/save the rendered image to `artifacts/review/opengraph-image-demo.png` (a direct screenshot of the browser tab showing the generated PNG is sufficient — this route serves the image directly).

- [ ] **Step 4: Commit**

```bash
git add project/src/app/opengraph-image.tsx project/artifacts/review/opengraph-image-demo.png
git commit -m "feat: update OG image tagline for demo mode"
```

---

## Task 13: Final verification

**Files:** None — verification only.

- [ ] **Step 1: Full typecheck**

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Full lint**

Run: `cd project && npx eslint .`
Expected: no errors.

- [ ] **Step 3: Full e2e suite**

Run: `cd project && npx playwright test`
Expected: all pre-existing tests still pass. Pay particular attention to `tests/auth.spec.ts` (signup → onboarding → dashboard) — Task 6 changed the onboarding redirect target to `/welcome` when `DEMO_MODE` is `true` (which it now is by default per Task 2), so this test's final assertion (`await expect(page).toHaveURL(/\/dashboard$/)`) will very likely now fail, since the real flow lands on `/welcome` first. This is an EXPECTED consequence of shipping this plan, not a regression — if it fails for exactly this reason, update `tests/auth.spec.ts`'s final assertions to match the new demo-mode flow (assert `/welcome` instead of `/dashboard`, or click "Continue to dashboard" and then assert `/dashboard`) as part of this task, re-run, and note the change in the commit. If it fails for any OTHER reason, treat it as a real regression and do not paper over it.

- [ ] **Step 4: Verify no stray uncommitted files**

Run: `cd "c:\Users\Saeed\Desktop\german-post-reader" && git status --porcelain`
Expected: empty (every prior task committed its own artifacts). If anything remains, commit it now with a message describing what it is.

- [ ] **Step 5: Commit any final cleanup**

```bash
git add -A
git commit -m "test: update auth e2e test for the demo-mode onboarding redirect"
```
(Only if Step 3 required a test update. Skip this commit entirely if nothing changed.)
