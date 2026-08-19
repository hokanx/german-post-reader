# Privacy Compliance + Landing Trust + Self-Service Deletion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the privacy-policy content gaps that don't require the operator's personal identity, add a data-handling trust card to the landing page, and ship self-service account deletion.

**Architecture:** Content-only edits to `src/lib/i18n/copy.ts` and `src/components/landing/copy.ts` for the policy/trust text; two small, independently-testable helper functions (Stripe subscription cancellation, Supabase Storage cleanup) composed into one new server action; one new client dialog component wired into the existing Settings page.

**Tech Stack:** Next.js App Router server actions, Supabase (`@supabase/supabase-js` service-role client, `@supabase/ssr` browser client), Stripe SDK, Playwright for e2e, the project's lightweight `assert()`-based test runner for pure functions (see `src/lib/letters/build-calendar-weeks.test.ts` for the pattern).

## Global Constraints

- Every color resolves through the OKLCH semantic tokens in `globals.css` (`bg-destructive`, `text-destructive`, `border-border`, etc.) — never a raw Tailwind color class or hex.
- Lucide icons only, `strokeWidth={1.5}`, sizes `size-4` or `size-5` only. Icon-only buttons need `aria-label`.
- Every new user-facing string is added to `APP_COPY` (or `MARKETING_COPY`) for all three languages: `en`, `ar`, `tr` — never hardcoded, never partially translated.
- Data-access/server-action functions return the `Result<T>` envelope from `src/lib/result.ts` (`{ ok: true; data: T } | { ok: false; error: { code, message, recovery? } }`) — never a raw throw to the UI.
- Non-blocking side effects that fail (analytics, third-party cleanup calls) are logged via `console.error("<context>", error)` — this project's Sentry integration auto-captures server console errors, so no explicit `Sentry.captureException` call is needed (confirmed: no such calls exist outside `global-error.tsx`, and `src/lib/email/send-welcome-email.ts` is the reference pattern for this).
- Touch targets ≥ 44px on mobile, focus-visible rings (`focus-visible:ring-2 focus-visible:ring-ring`) on every interactive element.
- Brand voice is calm and clinical, reassuring — no hype language, no fabricated urgency.
- Verification-before-completion: every task's final step must show real command output (typecheck, lint, or test run), not an assumption.

---

## Task 1: Contact email swap

Replaces the placeholder/old contact email with the confirmed real address across the footer, privacy page, and Terms' operator-email placeholders (leaving `[Operator legal name]` / `[Operator address]` / VAT placeholders untouched — those still need the operator's real identity).

**Files:**
- Modify: `src/components/landing/footer.tsx`
- Modify: `src/app/privacy/page.tsx`
- Modify: `src/lib/i18n/copy.ts` (EN lines ~537, ~542, ~547; AR lines ~861, ~866, ~871; TR lines ~1187, ~1192, ~1197 — line numbers approximate, match by content)

**Interfaces:** None — pure content edit, no new exports.

- [ ] **Step 1: Update the footer mailto link**

In `src/components/landing/footer.tsx`, find:
```tsx
href="mailto:hello@germanpostreader.app"
```
Replace with:
```tsx
href="mailto:hello@papkram.de"
```

- [ ] **Step 2: Update the privacy page mailto link**

In `src/app/privacy/page.tsx`, find:
```tsx
<a href="mailto:hello@germanpostreader.app" className="text-primary underline underline-offset-4">
  hello@germanpostreader.app
</a>
```
Replace with:
```tsx
<a href="mailto:hello@papkram.de" className="text-primary underline underline-offset-4">
  hello@papkram.de
</a>
```

- [ ] **Step 3: Replace the EN Terms operator-email placeholders**

In `src/lib/i18n/copy.ts`, within `APP_COPY.en.legal.terms.sections`, make these three surgical replacements (only the email fragment — leave `[Operator legal name]` / `[Operator address]` untouched):

Line ~537, in the "Right of withdrawal" section body, change:
```
Email [operator email] with a clear, dated statement
```
to:
```
Email hello@papkram.de with a clear, dated statement
```

Line ~542, in the "Model withdrawal form" section body, change:
```
To: [Operator legal name], [Operator address], [Operator email]\n
```
to:
```
To: [Operator legal name], [Operator address], hello@papkram.de\n
```

Line ~547, in the "Account termination" section body, change:
```
You can request account deletion at any time by emailing [operator email].
```
to:
```
You can request account deletion at any time by emailing hello@papkram.de, or delete it yourself any time from Settings.
```

- [ ] **Step 4: Replace the AR Terms operator-email placeholders**

Within `APP_COPY.ar.legal.terms.sections` (~lines 858-884), same three edits:

"حق الانسحاب" body: change `[البريد الإلكتروني للمشغّل]` (the standalone occurrence in the withdrawal-rights sentence, not the one inside the three-item list) to `hello@papkram.de`.

"النموذج المعياري للانسحاب" body: change `[الاسم القانوني للمشغّل]، [عنوان المشغّل]، [البريد الإلكتروني للمشغّل]` to `[الاسم القانوني للمشغّل]، [عنوان المشغّل]، hello@papkram.de`.

"إنهاء الحساب" body: change
```
يمكنك طلب حذف حسابك في أي وقت عبر إرسال بريد إلكتروني إلى [البريد الإلكتروني للمشغّل]. قد نعلّق الحسابات التي تُستخدم لإساءة استخدام الخدمة (مثل رفع محتوى ليس خطابات على نطاق واسع).
```
to:
```
يمكنك طلب حذف حسابك في أي وقت عبر إرسال بريد إلكتروني إلى hello@papkram.de، أو حذفه بنفسك في أي وقت من الإعدادات. قد نعلّق الحسابات التي تُستخدم لإساءة استخدام الخدمة (مثل رفع محتوى ليس خطابات على نطاق واسع).
```

- [ ] **Step 5: Replace the TR Terms operator-email placeholders**

Within `APP_COPY.tr.legal.terms.sections` (~lines 1183-1209), same three edits:

"Cayma hakkı" body: change the standalone `[operatör e-postası]` to `hello@papkram.de`.

"Örnek cayma formu" body: change `[Operatörün yasal adı], [Operatörün adresi], [Operatörün e-postası]` to `[Operatörün yasal adı], [Operatörün adresi], hello@papkram.de`.

"Hesap sonlandırma" body: change
```
[operatör e-postası] adresine e-posta göndererek hesabınızın silinmesini istediğiniz zaman talep edebilirsiniz. Hizmeti kötüye kullanmak için kullanılan hesapları askıya alabiliriz (örneğin, büyük ölçekte mektup olmayan içerik yükleme).
```
to:
```
hello@papkram.de adresine e-posta göndererek ya da istediğiniz zaman Ayarlar'dan kendiniz hesabınızın silinmesini talep edebilirsiniz. Hizmeti kötüye kullanmak için kullanılan hesapları askıya alabiliriz (örneğin, büyük ölçekte mektup olmayan içerik yükleme).
```

- [ ] **Step 6: Verify no old email references remain in source, and typecheck**

Run: `cd project && grep -rn "germanpostreader.app" src --include="*.ts" --include="*.tsx"`
Expected: only `src/lib/seed/seed.ts`'s `DEMO_EMAIL` constant remains (that's the seed account's login credential, unrelated to the contact address — leave it).

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add project/src/components/landing/footer.tsx project/src/app/privacy/page.tsx project/src/lib/i18n/copy.ts
git commit -m "fix: replace placeholder contact email with hello@papkram.de"
```

---

## Task 2: `cancelActiveSubscriptions` Stripe helper

**Files:**
- Create: `src/lib/stripe-cancel-subscriptions.ts`
- Test: `src/lib/stripe-cancel-subscriptions.test.ts`

**Interfaces:**
- Produces: `cancelActiveSubscriptions(stripe: Stripe, customerId: string): Promise<void>` — lists a customer's active subscriptions and cancels each immediately (not at period end). Used by Task 4's `deleteAccount` action.

- [ ] **Step 1: Write the test**

Create `src/lib/stripe-cancel-subscriptions.test.ts`:
```ts
import type Stripe from "stripe";
import { cancelActiveSubscriptions } from "./stripe-cancel-subscriptions";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

async function run() {
  const canceledIds: string[] = [];
  const fakeStripe = {
    subscriptions: {
      list: async () => ({
        data: [{ id: "sub_1" }, { id: "sub_2" }],
      }),
      cancel: async (id: string) => {
        canceledIds.push(id);
      },
    },
  } as unknown as Stripe;

  await cancelActiveSubscriptions(fakeStripe, "cus_test");

  assert(canceledIds.length === 2, "cancels every active subscription returned by list()");
  assert(canceledIds.includes("sub_1") && canceledIds.includes("sub_2"), "cancels the correct subscription ids");

  const noSubsStripe = {
    subscriptions: {
      list: async () => ({ data: [] }),
      cancel: async () => {
        throw new Error("should not be called when there are no active subscriptions");
      },
    },
  } as unknown as Stripe;

  await cancelActiveSubscriptions(noSubsStripe, "cus_none");
  assert(true, "does nothing (no throw) when the customer has no active subscriptions");
}

run();
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd project && npx tsx src/lib/stripe-cancel-subscriptions.test.ts`
Expected: fails with a module-not-found error for `./stripe-cancel-subscriptions` (the implementation doesn't exist yet).

- [ ] **Step 3: Write the implementation**

Create `src/lib/stripe-cancel-subscriptions.ts`:
```ts
import type Stripe from "stripe";

/**
 * Cancels every currently-active subscription for a Stripe customer,
 * immediately (not at period end) — used when deleting an account, where
 * there's no "let it run out" grace period to honor.
 */
export async function cancelActiveSubscriptions(stripe: Stripe, customerId: string): Promise<void> {
  const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: "active" });
  await Promise.all(subscriptions.data.map((subscription) => stripe.subscriptions.cancel(subscription.id)));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd project && npx tsx src/lib/stripe-cancel-subscriptions.test.ts`
Expected: three `PASS:` lines, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add project/src/lib/stripe-cancel-subscriptions.ts project/src/lib/stripe-cancel-subscriptions.test.ts
git commit -m "feat: add cancelActiveSubscriptions Stripe helper"
```

---

## Task 3: `deleteUserLetterFiles` storage helper

**Files:**
- Create: `src/lib/supabase/delete-user-storage.ts`
- Test: `src/lib/supabase/delete-user-storage.test.ts`

**Interfaces:**
- Produces: `deleteUserLetterFiles(service: SupabaseClient, userId: string): Promise<void>` — lists and removes every object under `letters/{userId}/` in Supabase Storage. Used by Task 4's `deleteAccount` action.

- [ ] **Step 1: Write the test**

Create `src/lib/supabase/delete-user-storage.test.ts`:
```ts
import type { SupabaseClient } from "@supabase/supabase-js";
import { deleteUserLetterFiles } from "./delete-user-storage";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

async function run() {
  const removedPaths: string[] = [];
  const fakeClient = {
    storage: {
      from: () => ({
        list: async () => ({ data: [{ name: "letter-1.jpg" }, { name: "letter-2.pdf" }] }),
        remove: async (paths: string[]) => {
          removedPaths.push(...paths);
        },
      }),
    },
  } as unknown as SupabaseClient;

  await deleteUserLetterFiles(fakeClient, "user-123");

  assert(removedPaths.length === 2, "removes every file returned by list()");
  assert(
    removedPaths.includes("user-123/letter-1.jpg") && removedPaths.includes("user-123/letter-2.pdf"),
    "builds the correct {userId}/{filename} paths",
  );

  const emptyClient = {
    storage: {
      from: () => ({
        list: async () => ({ data: [] }),
        remove: async () => {
          throw new Error("should not be called when the user has no files");
        },
      }),
    },
  } as unknown as SupabaseClient;

  await deleteUserLetterFiles(emptyClient, "user-456");
  assert(true, "does nothing (no throw) when the user has no stored files");
}

run();
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd project && npx tsx src/lib/supabase/delete-user-storage.test.ts`
Expected: fails with a module-not-found error for `./delete-user-storage`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/supabase/delete-user-storage.ts`:
```ts
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Removes every object under `letters/{userId}/` in Supabase Storage. Not
 * covered by the `profiles`/`letters` table cascade delete — storage objects
 * live outside Postgres, so this has to be done explicitly before (or
 * alongside) deleting the account's rows.
 */
export async function deleteUserLetterFiles(service: SupabaseClient, userId: string): Promise<void> {
  const { data: files } = await service.storage.from("letters").list(userId);
  if (!files || files.length === 0) return;

  const paths = files.map((file) => `${userId}/${file.name}`);
  await service.storage.from("letters").remove(paths);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd project && npx tsx src/lib/supabase/delete-user-storage.test.ts`
Expected: three `PASS:` lines, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add project/src/lib/supabase/delete-user-storage.ts project/src/lib/supabase/delete-user-storage.test.ts
git commit -m "feat: add deleteUserLetterFiles storage cleanup helper"
```

---

## Task 4: `deleteAccount` server action + Settings copy

**Files:**
- Create: `src/app/(app)/settings/delete-account-action.ts`
- Modify: `src/lib/i18n/copy.ts` (add keys to the `settings` type at line ~263, and content to `en`/`ar`/`tr` `settings` blocks after `senderInfoSaveFailedRecovery` at lines ~590, ~914, ~1240)

**Interfaces:**
- Consumes: `cancelActiveSubscriptions(stripe, customerId)` from Task 2; `deleteUserLetterFiles(service, userId)` from Task 3; `createClient()` from `@/lib/supabase/server`; `createServiceClient()` from `@/lib/supabase/service`; `createStripeClient()` from `@/lib/stripe`; `trackServerEvent(distinctId, event)` from `@/lib/analytics/track-server-event`.
- Produces: `deleteAccount(language: AppLanguage): Promise<Result<null>>` — used by Task 5's `DeleteAccountDialog`.

- [ ] **Step 1: Add the new copy keys to the `settings` type**

In `src/lib/i18n/copy.ts`, find the `settings` type block (line ~246-263) and add these five keys right before the closing `};` (after `senderInfoSaveFailedRecovery: string;`):
```ts
    deleteAccountButton: string;
    deleteAccountTitle: string;
    deleteAccountWarning: string;
    deleteAccountConfirmLabel: string;
    deleteAccountConfirmCta: string;
    deleteAccountDeleting: string;
    deleteAccountSuccessToast: string;
    deleteAccountFailed: string;
    deleteAccountFailedRecovery: string;
    deleteAccountUnauthenticated: string;
```

- [ ] **Step 2: Add the EN content**

In `APP_COPY.en.settings`, right after the `senderInfoSaveFailedRecovery: "Try again.",` line (~590), add:
```ts
      deleteAccountButton: "Delete account",
      deleteAccountTitle: "Delete your account?",
      deleteAccountWarning:
        "This permanently deletes all your letters, reply drafts, and uploaded files, and cancels any active subscription immediately. This cannot be undone.",
      deleteAccountConfirmLabel: "Type DELETE to confirm",
      deleteAccountConfirmCta: "Delete my account",
      deleteAccountDeleting: "Deleting…",
      deleteAccountSuccessToast: "Your account and all associated data have been deleted.",
      deleteAccountFailed: "Couldn't delete your account.",
      deleteAccountFailedRecovery: "Try again in a moment, or email hello@papkram.de.",
      deleteAccountUnauthenticated: "You need to be logged in to delete your account.",
```

- [ ] **Step 3: Add the AR content**

In `APP_COPY.ar.settings`, right after the `senderInfoSaveFailedRecovery: "حاول مرة أخرى.",` line (~914), add:
```ts
      deleteAccountButton: "حذف الحساب",
      deleteAccountTitle: "هل تريد حذف حسابك؟",
      deleteAccountWarning:
        "سيؤدي هذا إلى حذف جميع خطاباتك ومسودات الرد والملفات المرفوعة نهائيًا، وإلغاء أي اشتراك نشط فورًا. لا يمكن التراجع عن هذا الإجراء.",
      deleteAccountConfirmLabel: "اكتب DELETE للتأكيد",
      deleteAccountConfirmCta: "احذف حسابي",
      deleteAccountDeleting: "جارٍ الحذف…",
      deleteAccountSuccessToast: "تم حذف حسابك وجميع البيانات المرتبطة به.",
      deleteAccountFailed: "تعذر حذف حسابك.",
      deleteAccountFailedRecovery: "حاول مرة أخرى بعد قليل، أو راسلنا على hello@papkram.de.",
      deleteAccountUnauthenticated: "يجب تسجيل الدخول لحذف حسابك.",
```

- [ ] **Step 4: Add the TR content**

In `APP_COPY.tr.settings`, right after the `senderInfoSaveFailedRecovery: "Tekrar deneyin.",` line (~1240), add:
```ts
      deleteAccountButton: "Hesabı sil",
      deleteAccountTitle: "Hesabınızı silmek istiyor musunuz?",
      deleteAccountWarning:
        "Bu işlem tüm mektuplarınızı, yanıt taslaklarınızı ve yüklediğiniz dosyaları kalıcı olarak siler, aktif bir aboneliği varsa hemen iptal eder. Bu işlem geri alınamaz.",
      deleteAccountConfirmLabel: "Onaylamak için DELETE yazın",
      deleteAccountConfirmCta: "Hesabımı sil",
      deleteAccountDeleting: "Siliniyor…",
      deleteAccountSuccessToast: "Hesabınız ve ilişkili tüm verileriniz silindi.",
      deleteAccountFailed: "Hesabınız silinemedi.",
      deleteAccountFailedRecovery: "Birazdan tekrar deneyin veya hello@papkram.de adresine e-posta gönderin.",
      deleteAccountUnauthenticated: "Hesabınızı silmek için giriş yapmış olmanız gerekir.",
```

- [ ] **Step 5: Run typecheck to confirm the copy object satisfies the type**

Run: `cd project && npx tsc --noEmit`
Expected: no errors (all three language objects now satisfy the extended `settings` type).

- [ ] **Step 6: Write the server action**

Create `src/app/(app)/settings/delete-account-action.ts`:
```ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createStripeClient } from "@/lib/stripe";
import { cancelActiveSubscriptions } from "@/lib/stripe-cancel-subscriptions";
import { deleteUserLetterFiles } from "@/lib/supabase/delete-user-storage";
import { trackServerEvent } from "@/lib/analytics/track-server-event";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import type { Result } from "@/lib/result";

export async function deleteAccount(language: AppLanguage = "en"): Promise<Result<null>> {
  const copy = APP_COPY[language].settings;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: copy.deleteAccountUnauthenticated } };
  }

  const service = createServiceClient();

  try {
    await deleteUserLetterFiles(service, user.id);
  } catch (error) {
    console.error("deleteAccount: storage cleanup failed", error);
  }

  const { data: profile } = await service
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (profile?.stripe_customer_id) {
    try {
      const stripe = createStripeClient();
      await cancelActiveSubscriptions(stripe, profile.stripe_customer_id);
    } catch (error) {
      console.error("deleteAccount: stripe cancellation failed", error);
    }
  }

  try {
    await trackServerEvent(user.id, "account_deleted");
  } catch (error) {
    console.error("deleteAccount: analytics tracking failed", error);
  }

  const { error: deleteError } = await service.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error("deleteAccount: auth.admin.deleteUser failed", deleteError);
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: copy.deleteAccountFailed,
        recovery: copy.deleteAccountFailedRecovery,
      },
    };
  }

  return { ok: true, data: null };
}
```

- [ ] **Step 7: Typecheck**

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add project/src/app/\(app\)/settings/delete-account-action.ts project/src/lib/i18n/copy.ts
git commit -m "feat: add deleteAccount server action and its copy"
```

---

## Task 5: `DeleteAccountDialog` component

**Files:**
- Create: `src/components/delete-account-dialog.tsx`
- Modify: `src/app/(app)/settings/page.tsx`

**Interfaces:**
- Consumes: `deleteAccount(language)` from Task 4; `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription` from `@/components/ui/dialog`; `Button`, `buttonVariants` from `@/components/ui/button`; `Input` from `@/components/ui/input`; `createClient()` from `@/lib/supabase/client` (browser client, for the post-delete `signOut()`); `toast` from `sonner`.
- Produces: `DeleteAccountDialog({ language }: { language?: AppLanguage })` — rendered in `settings/page.tsx`'s Account section, next to `LogoutButton`.

- [ ] **Step 1: Write the component**

Create `src/components/delete-account-dialog.tsx`:
```tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { cn } from "@/lib/utils";
import { deleteAccount } from "@/app/(app)/settings/delete-account-action";

const CONFIRM_WORD = "DELETE";

export function DeleteAccountDialog({ language = "en" }: { language?: AppLanguage }) {
  const copy = APP_COPY[language].settings;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<{ message: string; recovery?: string } | null>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setConfirmText("");
      setError(null);
    }
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteAccount(language);
      if (!result.ok) {
        setError({ message: result.error.message, recovery: result.error.recovery });
        return;
      }
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success(copy.deleteAccountSuccessToast);
      router.push("/");
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "destructive" }),
          "h-11 gap-2 rounded-sm border-2 border-destructive/40 px-4 text-sm font-medium",
        )}
      >
        <Trash2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {copy.deleteAccountButton}
      </DialogTrigger>
      <DialogContent
        dir={language === "ar" ? "rtl" : "ltr"}
        className="rounded-md border-2 border-border bg-card p-8 shadow-[6px_6px_0_0_var(--border)] sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-extrabold tracking-[-0.02em] text-foreground">
            {copy.deleteAccountTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground/70">{copy.deleteAccountWarning}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <label htmlFor="confirm-delete" className="text-sm font-medium text-foreground">
            {copy.deleteAccountConfirmLabel}
          </label>
          <Input
            id="confirm-delete"
            value={confirmText}
            onChange={(event) => setConfirmText(event.target.value)}
            autoComplete="off"
            className="h-12 rounded-sm border-2 border-border text-base"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {error.message}
            {error.recovery && ` ${error.recovery}`}
          </p>
        )}

        <Button
          type="button"
          disabled={pending || confirmText !== CONFIRM_WORD}
          onClick={handleDelete}
          variant="destructive"
          className="h-12 w-full rounded-sm text-base font-bold"
        >
          {pending ? copy.deleteAccountDeleting : copy.deleteAccountConfirmCta}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Wire it into the Settings page**

In `src/app/(app)/settings/page.tsx`, add the import:
```ts
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
```

Then find the Account section:
```tsx
        <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {copy.accountHeading}
          </h2>
          <div className="mt-4">
            <LogoutButton language={language} />
          </div>
        </section>
```
Replace with:
```tsx
        <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {copy.accountHeading}
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <LogoutButton language={language} />
            <DeleteAccountDialog language={language} />
          </div>
        </section>
```

- [ ] **Step 3: Typecheck and lint**

Run: `cd project && npx tsc --noEmit && npx eslint src/components/delete-account-dialog.tsx "src/app/(app)/settings/page.tsx"`
Expected: no errors.

- [ ] **Step 4: Manual verification — start the dev server and exercise the dialog**

Run the dev server (`cd project && npm run dev`), sign in as the seed demo account, navigate to `/settings`, and confirm via chrome-devtools:
- The "Delete account" button renders next to "Log out" with destructive styling and a 44px+ touch target.
- Opening it shows the dialog with the warning text and a disabled "Delete my account" button.
- Typing anything other than `DELETE` keeps the button disabled; typing exactly `DELETE` enables it.
- Screenshot the open dialog at 1440px and 375px, and once in Arabic (RTL) via the language switcher, to `artifacts/review/delete-account-dialog-*.png`.

Do **not** actually click through the delete on this manual pass — that's covered by the automated e2e test in Task 6, which creates and tears down its own throwaway account.

- [ ] **Step 5: Commit**

```bash
git add project/src/components/delete-account-dialog.tsx "project/src/app/(app)/settings/page.tsx" project/artifacts/review/delete-account-dialog-*.png
git commit -m "feat: add self-service account deletion UI"
```

---

## Task 6: E2E test for the full deletion flow

**Files:**
- Create: `tests/delete-account.spec.ts`

**Interfaces:**
- Consumes: the live `deleteAccount` action via the real UI (this is a black-box e2e test, not a unit test) — no new exports.

- [ ] **Step 1: Write the test**

Create `tests/delete-account.spec.ts`, following the exact throwaway-user + admin-cleanup pattern from `tests/auth.spec.ts`:
```ts
import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

test.describe("self-service account deletion", () => {
  const email = `e2e-delete-${Date.now()}@example.com`;
  const password = "TestPassword123";
  let userId: string;

  test.afterAll(async () => {
    // Only relevant if the deletion itself failed and left the user behind —
    // a successful run has already deleted this user, so this is a safety net.
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data } = await admin.auth.admin.listUsers();
    const leftover = data.users.find((u) => u.email === email);
    if (leftover) {
      await admin.auth.admin.deleteUser(leftover.id);
    }
  });

  test("deletes the account, its storage files, and signs the user out", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Start free trial" }).click();
    await expect(page).toHaveURL(/\/onboarding$/);
    await page.getByRole("button", { name: /English/ }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: listData } = await admin.auth.admin.listUsers();
    const user = listData.users.find((u) => u.email === email);
    if (!user) throw new Error("signed-up user not found via admin client");
    userId = user.id;

    // Seed a fake storage object directly (bypassing the real upload/Gemini
    // pipeline, which is slow and rate-limited) so storage cleanup has
    // something real to verify.
    await admin.storage.from("letters").upload(`${userId}/fake-letter.txt`, new Blob(["test content"]));

    await page.goto("/settings");
    await page.getByRole("button", { name: "Delete account" }).click();
    await page.getByLabel("Type DELETE to confirm").fill("DELETE");
    await page.getByRole("button", { name: "Delete my account" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("Your account and all associated data have been deleted.")).toBeVisible();

    const { data: afterDelete } = await admin.auth.admin.listUsers();
    const stillExists = afterDelete.users.some((u) => u.email === email);
    expect(stillExists).toBe(false);

    const { data: remainingFiles } = await admin.storage.from("letters").list(userId);
    expect(remainingFiles?.length ?? 0).toBe(0);
  });
});
```

- [ ] **Step 2: Run it**

Run: `cd project && npx playwright test tests/delete-account.spec.ts`
Expected: 1 passed. If it fails, read the actual Playwright error output before changing anything — common causes are a mismatched button/label text (compare against the exact copy strings from Task 4/5) or the dev server not yet warm on the first request (Playwright's webServer config should already handle this, matching how the other specs run).

- [ ] **Step 3: Run the full e2e suite to confirm nothing else broke**

Run: `cd project && npx playwright test`
Expected: all tests pass (6 total: the 5 pre-existing plus this new one).

- [ ] **Step 4: Commit**

```bash
git add project/tests/delete-account.spec.ts
git commit -m "test: add e2e coverage for self-service account deletion"
```

---

## Task 7: Privacy policy content updates

**Files:**
- Modify: `src/lib/i18n/copy.ts` (`APP_COPY.en/ar/tr.legal.privacy.sections`, ~lines 495-515 EN, ~819-839 AR, ~1145-1165 TR)

**Interfaces:** None — pure content edit, `sections` is already `{ heading: string; body: string }[]`, no type change needed.

- [ ] **Step 1: Update the EN privacy sections**

In `APP_COPY.en.legal.privacy.sections` (~line 495), replace the full array with:
```ts
        sections: [
          {
            heading: "What we store",
            body: "When you upload a letter, we store the original image or PDF, the analysis we generate from it (summary, deadlines, reply draft, risk flags), and the language you chose. This is stored in a private storage bucket and database rows tied to your account — only you can access your own letters.",
          },
          {
            heading: "How your letter is processed",
            body: "The contents of an uploaded letter are sent to Google's Gemini API to generate the analysis. Google participates in the EU-US Data Privacy Framework, which is the legal basis for this transfer. We do not use your letters to train any model. We never display the raw extracted text back to you or anyone else — only the structured summary, deadlines, and reply draft.",
          },
          {
            heading: "Who else handles your data",
            body: "A few specialized providers process data on our behalf, each for one specific purpose: Supabase (database and file storage), Resend (sending emails), PostHog (product analytics, only if you accepted the cookie banner), Sentry (error tracking), and Vercel (hosting). None of them can use your data for anything beyond providing their service to us.",
          },
          {
            heading: "Payments",
            body: "Subscription billing is handled by Stripe. We never see or store your card details — Stripe processes and stores that directly.",
          },
          {
            heading: "How long we keep your data",
            body: "We keep your account and letters until you delete your account (instantly, from Settings) or ask us to delete it by email. There's currently no automatic deletion after a period of inactivity.",
          },
          {
            heading: "Your rights",
            body: "You can delete your account and all associated letters any time from Settings — this is immediate and cannot be undone. If you'd rather not do it yourself, or have any other question about your data, email us at",
          },
        ],
```

- [ ] **Step 2: Update the AR privacy sections**

In `APP_COPY.ar.legal.privacy.sections` (~line 819), replace the full array with:
```ts
        sections: [
          {
            heading: "ما الذي نخزنه",
            body: "عند رفع خطاب، نخزّن الصورة الأصلية أو ملف PDF، والتحليل الذي ننتجه منه (الملخص، المواعيد النهائية، مسودة الرد، علامات الخطر)، واللغة التي اخترتها. يُخزَّن هذا في مساحة تخزين خاصة وسجلات قاعدة بيانات مرتبطة بحسابك — أنت وحدك من يمكنه الوصول إلى خطاباتك.",
          },
          {
            heading: "كيف تتم معالجة خطابك",
            body: "تُرسَل محتويات الخطاب المرفوع إلى واجهة Gemini من Google لإنشاء التحليل. تشارك Google في إطار خصوصية البيانات بين الاتحاد الأوروبي والولايات المتحدة (EU-US Data Privacy Framework)، وهو الأساس القانوني لهذا النقل. لا نستخدم خطاباتك لتدريب أي نموذج. لا نعرض أبدًا النص المستخرج الخام لك أو لأي شخص آخر — فقط الملخص المنظم والمواعيد النهائية ومسودة الرد.",
          },
          {
            heading: "من غيرنا يتعامل مع بياناتك",
            body: "يعالج عدد قليل من مزوّدي الخدمات المتخصصين بياناتك نيابةً عنا، كل منهم لغرض محدد واحد: Supabase (قاعدة البيانات وتخزين الملفات)، Resend (إرسال الرسائل الإلكترونية)، PostHog (تحليلات المنتج، فقط إذا وافقت على شريط ملفات تعريف الارتباط)، Sentry (تتبع الأخطاء)، وVercel (الاستضافة). لا يمكن لأي منهم استخدام بياناتك لأي غرض يتجاوز تقديم خدمته لنا.",
          },
          {
            heading: "المدفوعات",
            body: "تُدار فوترة الاشتراك عبر Stripe. لا نرى أو نخزّن أبدًا تفاصيل بطاقتك — تُعالجها Stripe وتخزّنها مباشرةً.",
          },
          {
            heading: "المدة التي نحتفظ فيها ببياناتك",
            body: "نحتفظ بحسابك وخطاباتك حتى تحذف حسابك (فورًا، من الإعدادات) أو تطلب منا حذفه عبر البريد الإلكتروني. لا يوجد حاليًا حذف تلقائي بعد فترة من عدم النشاط.",
          },
          {
            heading: "حقوقك",
            body: "يمكنك حذف حسابك وجميع الخطابات المرتبطة به في أي وقت من الإعدادات — هذا فوري ولا يمكن التراجع عنه. إذا كنت تفضل عدم القيام بذلك بنفسك، أو لديك أي سؤال آخر بشأن بياناتك، راسلنا على",
          },
        ],
```

- [ ] **Step 3: Update the TR privacy sections**

In `APP_COPY.tr.legal.privacy.sections` (~line 1145), replace the full array with:
```ts
        sections: [
          {
            heading: "Ne saklıyoruz",
            body: "Bir mektup yüklediğinizde, orijinal görüntüyü veya PDF'i, ondan oluşturduğumuz analizi (özet, son tarihler, yanıt taslağı, risk işaretleri) ve seçtiğiniz dili saklarız. Bu, hesabınıza bağlı özel bir depolama alanında ve veritabanı satırlarında saklanır — mektuplarınıza yalnızca siz erişebilirsiniz.",
          },
          {
            heading: "Mektubunuz nasıl işlenir",
            body: "Yüklenen bir mektubun içeriği, analizi oluşturmak için Google'ın Gemini API'sine gönderilir. Google, AB-ABD Veri Gizliliği Çerçevesi'ne (EU-US Data Privacy Framework) katılmaktadır; bu, bu aktarımın yasal dayanağıdır. Mektuplarınızı herhangi bir modeli eğitmek için kullanmayız. Ham çıkarılan metni asla size veya başka birine göstermeyiz — yalnızca yapılandırılmış özeti, son tarihleri ve yanıt taslağını gösteririz.",
          },
          {
            heading: "Verilerinizle başka kimler ilgileniyor",
            body: "Birkaç uzman sağlayıcı, bizim adımıza, her biri tek bir amaç için veri işler: Supabase (veritabanı ve dosya depolama), Resend (e-posta gönderimi), PostHog (ürün analitiği, yalnızca çerez bildirimini kabul ettiyseniz), Sentry (hata izleme) ve Vercel (barındırma). Hiçbiri verilerinizi bize hizmet sağlamanın ötesinde bir amaçla kullanamaz.",
          },
          {
            heading: "Ödemeler",
            body: "Abonelik faturalandırması Stripe tarafından yönetilir. Kart bilgilerinizi asla görmez veya saklamayız — Stripe bunu doğrudan işler ve saklar.",
          },
          {
            heading: "Verilerinizi ne kadar süre saklıyoruz",
            body: "Hesabınızı silene kadar (Ayarlar'dan anında) veya e-posta ile silmemizi isteyene kadar hesabınızı ve mektuplarınızı saklarız. Şu anda hareketsizlik süresinden sonra otomatik silme bulunmamaktadır.",
          },
          {
            heading: "Haklarınız",
            body: "Hesabınızı ve ilişkili tüm mektupları istediğiniz zaman Ayarlar'dan silebilirsiniz — bu anında gerçekleşir ve geri alınamaz. Bunu kendiniz yapmak istemiyorsanız veya verileriniz hakkında başka bir sorunuz varsa, bize şu adresten ulaşın:",
          },
        ],
```

- [ ] **Step 4: Typecheck**

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Manual verification — screenshot the privacy page**

Start the dev server if not already running, navigate to `/privacy` in EN, AR (RTL), and TR, and screenshot each to `artifacts/review/privacy-page-{en,ar,tr}.png`. Confirm the new "Who else handles your data" and "How long we keep your data" sections render, and that "Your rights" now leads with the self-service path.

- [ ] **Step 6: Commit**

```bash
git add project/src/lib/i18n/copy.ts project/artifacts/review/privacy-page-*.png
git commit -m "docs: fill privacy-policy gaps — sub-processors, transfer basis, retention, self-service rights"
```

---

## Task 8: Landing page trust callout — second card

**Files:**
- Modify: `src/components/landing/copy.ts` (type at line ~33, EN content ~94-97, AR content ~218-221, TR content ~342-345)
- Modify: `src/components/landing/trust-callout.tsx`

**Interfaces:**
- Produces: `MarketingCopy.trust` changes shape from `{ heading: string; body: string }` to `{ heading: string; body: string }[]` — this is a breaking change to the type, so every language object and the component must be updated together in this one task.

- [ ] **Step 1: Change the `trust` type to an array**

In `src/components/landing/copy.ts`, find:
```ts
  trust: { heading: string; body: string };
```
Replace with:
```ts
  trust: { heading: string; body: string }[];
```

- [ ] **Step 2: Update the EN content to a two-item array**

Find (~line 94):
```ts
    trust: {
      heading: "We tell you when we're not sure",
      body: "German bureaucratic letters are dense — amounts and dates matter. If anything in a letter is ambiguous, we flag it plainly instead of guessing. Never a silent guess on a number that could cost you.",
    },
```
Replace with:
```ts
    trust: [
      {
        heading: "We tell you when we're not sure",
        body: "German bureaucratic letters are dense — amounts and dates matter. If anything in a letter is ambiguous, we flag it plainly instead of guessing. Never a silent guess on a number that could cost you.",
      },
      {
        heading: "Your letters stay private",
        body: "Uploaded letters are processed only to generate your summary and reply draft — never used to train any AI model. Delete your data any time from your account settings.",
      },
    ],
```

- [ ] **Step 3: Update the AR content**

Find (~line 218):
```ts
    trust: {
      heading: "نخبرك عندما لا نكون متأكدين",
      body: "الخطابات الألمانية الرسمية معقدة — المبالغ والتواريخ مهمة. إذا كان أي شيء في الخطاب غامضًا، نشير إليه بوضوح بدلاً من التخمين. لا تخمين صامت لرقم قد يكلفك المال.",
    },
```
Replace with:
```ts
    trust: [
      {
        heading: "نخبرك عندما لا نكون متأكدين",
        body: "الخطابات الألمانية الرسمية معقدة — المبالغ والتواريخ مهمة. إذا كان أي شيء في الخطاب غامضًا، نشير إليه بوضوح بدلاً من التخمين. لا تخمين صامت لرقم قد يكلفك المال.",
      },
      {
        heading: "خطاباتك تبقى خاصة",
        body: "تُعالَج الخطابات المرفوعة فقط لإنشاء ملخصك ومسودة ردك — ولا تُستخدم أبدًا لتدريب أي نموذج ذكاء اصطناعي. احذف بياناتك في أي وقت من إعدادات حسابك.",
      },
    ],
```

- [ ] **Step 4: Update the TR content**

Find (~line 342):
```ts
    trust: {
      heading: "Emin olmadığımızda size söyleriz",
      body: "Alman resmi mektupları yoğun içeriklidir — tutarlar ve tarihler önemlidir. Bir mektupta belirsiz bir şey varsa, tahmin etmek yerine açıkça belirtiriz. Size zarar verebilecek bir rakamda asla sessizce tahmin yürütmeyiz.",
    },
```
Replace with:
```ts
    trust: [
      {
        heading: "Emin olmadığımızda size söyleriz",
        body: "Alman resmi mektupları yoğun içeriklidir — tutarlar ve tarihler önemlidir. Bir mektupta belirsiz bir şey varsa, tahmin etmek yerine açıkça belirtiriz. Size zarar verebilecek bir rakamda asla sessizce tahmin yürütmeyiz.",
      },
      {
        heading: "Mektuplarınız gizli kalır",
        body: "Yüklenen mektuplar yalnızca özetinizi ve yanıt taslağınızı oluşturmak için işlenir — hiçbir yapay zeka modelini eğitmek için kullanılmaz. Verilerinizi istediğiniz zaman hesap ayarlarınızdan silebilirsiniz.",
      },
    ],
```

- [ ] **Step 5: Update the `TrustCallout` component to render the array**

Replace the full contents of `src/components/landing/trust-callout.tsx`:
```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldAlert, Lock } from "lucide-react";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

const ICONS = [ShieldAlert, Lock];

export function TrustCallout() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <section dir={copy.dir} className="mx-auto grid max-w-6xl gap-4 px-6 py-10">
      {copy.trust.map((item, index) => {
        const Icon = ICONS[index] ?? ShieldAlert;
        return (
          <motion.div
            key={item.heading}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : index * 0.1 }}
            className="flex flex-col items-start gap-4 rounded-md border-2 border-border bg-muted p-8 md:flex-row md:items-center"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background">
              <Icon className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-extrabold tracking-[-0.02em] text-foreground">
                {item.heading}
              </h2>
              <p className="mt-1 text-sm text-foreground/70">{item.body}</p>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
```

- [ ] **Step 6: Typecheck and lint**

Run: `cd project && npx tsc --noEmit && npx eslint src/components/landing/copy.ts src/components/landing/trust-callout.tsx`
Expected: no errors.

- [ ] **Step 7: Manual verification — screenshot the landing page trust section**

Start the dev server, navigate to `/`, and screenshot the trust section (both cards) at 375px, 1440px, and in Arabic (RTL) to `artifacts/review/landing-trust-{375,1440,ar}.png`. Confirm both cards render with the correct icons, stagger-animate in correctly, and RTL flips the icon/text order as expected.

- [ ] **Step 8: Commit**

```bash
git add project/src/components/landing/copy.ts project/src/components/landing/trust-callout.tsx project/artifacts/review/landing-trust-*.png
git commit -m "feat: add data-privacy trust card to the landing page"
```

---

## Task 9: Final verification

**Files:** None — verification only.

- [ ] **Step 1: Full typecheck**

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 2: Full lint**

Run: `cd project && npx eslint .`
Expected: no errors.

- [ ] **Step 3: Full e2e suite**

Run: `cd project && npx playwright test`
Expected: all 6 tests pass (5 pre-existing + `delete-account.spec.ts`).

- [ ] **Step 4: Verify no leftover placeholder strings from this work**

Run: `cd project && grep -n "operator email\|Operator email\|البريد الإلكتروني للمشغّل\|operatör e-postası" src/lib/i18n/copy.ts`
Expected: no matches (all nine occurrences were replaced in Task 1). Note this intentionally does NOT check for `[Operator legal name]` / `[Operator address]` / VAT placeholders — those remain, by design, until the operator's real identity is available.

- [ ] **Step 5: Commit the final state**

```bash
git add -A
git status --porcelain
```
If anything is still unstaged from the manual-verification screenshot steps in Tasks 5, 7, and 8, commit it now:
```bash
git commit -m "chore: final verification screenshots for privacy/trust/deletion work"
```
(Skip this commit if `git status --porcelain` is already empty — everything was committed in its own task.)
