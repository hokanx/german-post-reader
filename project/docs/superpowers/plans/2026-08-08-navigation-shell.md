# Navigation Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every authenticated page a persistent History/Upload/Deadlines/Settings navigation shell, add the two new pages it links to, and remove the "Take a photo" upload button.

**Architecture:** A new Next.js route group `src/app/(app)/` wraps `dashboard`, `upload`, and `letters` (moved as-is, URLs unchanged) plus two new routes (`deadlines`, `settings`) in one shared layout that does the auth check once, fetches the user's language once, and renders a simplified `AppHeader` (logo only) + page content + a new `AppNav` (bottom tab bar on mobile, sidebar on desktop) around every page. `AppNav`'s active-tab logic and the Deadlines page's cross-letter aggregation are both pure functions, tested directly with `tsx` (already a project devDependency — no new test framework needed; this repo's only test runner is Playwright, reserved for real browser flows).

**Tech Stack:** Next.js 16 App Router (Server Components + one route-group layout), Tailwind CSS + existing design-system tokens, `tsx` for running pure-function test files directly, Playwright for anything that needs a real browser (unaffected by this plan — see Task 8).

## Global Constraints

- Semantic color tokens only — never a raw Tailwind color class or hex in a component (`components/CLAUDE.md`).
- Lucide icons only, `strokeWidth={1.5}`, sizes `size-4`/`size-5` only (`components/CLAUDE.md`).
- Every interactive element styles hover/focus-visible/active/disabled; focus ring via `focus-visible:ring-2 focus-visible:ring-ring`; touch targets ≥44px on mobile (`components/CLAUDE.md`).
- Body text ≥16px on mobile — this doesn't apply to short UI-chrome labels (nav tab labels, badges/chips), which this codebase already sets in `text-xs` (12px) throughout; match that existing convention, don't invent a smaller arbitrary size.
- Every data-backed route ships `loading.tsx` (skeleton, not a bare spinner) and `error.tsx` (specific message + a retry button calling `reset()`, never "Something went wrong") (`app/CLAUDE.md`).
- Server Components by default; `"use client"` only for interactivity (`app/CLAUDE.md`).
- A route is not done until empty/loading/error states are each screenshotted by `/design-review` (`app/CLAUDE.md`, root `CLAUDE.md` design-review gate).
- Never instruct a human to run a terminal command — every command in this plan is run by whoever is executing it (root `CLAUDE.md` terminal rule; applies to the executing agent here too, there is no human expected to type anything).

---

## Task 1: Remove the "Take a photo" button

**Files:**
- Modify: `src/app/upload/upload-form.tsx`

**Interfaces:** none — this is a pure UI removal, no signature changes.

- [ ] **Step 1: Remove the button and its now-unused import**

In `src/app/upload/upload-form.tsx`, delete the `Camera` import and the entire "Take a photo" `<Button>` block, and drop the now-unnecessary two-column grid wrapper around the single remaining button:

Change the import line:
```tsx
import { Upload, FileText, Camera } from "lucide-react";
```
to:
```tsx
import { Upload, FileText } from "lucide-react";
```

Replace:
```tsx
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-sm border-2 border-border text-sm font-bold"
          onClick={() => {
            const cameraInput = document.createElement("input");
            cameraInput.type = "file";
            cameraInput.accept = "image/jpeg,image/png";
            cameraInput.capture = "environment";
            cameraInput.onchange = () => void handleFiles(cameraInput.files);
            cameraInput.click();
          }}
        >
          <Camera className="size-4" strokeWidth={1.5} aria-hidden="true" />
          {copy.takePhoto}
        </Button>
        <Button
          type="button"
          disabled={!file || preparing}
          className="h-12 rounded-sm text-sm font-bold"
          onClick={handleSubmit}
        >
          {copy.analyzeLetter}
        </Button>
      </div>
```
with:
```tsx
      <Button
        type="button"
        disabled={!file || preparing}
        className="h-12 w-full rounded-sm text-sm font-bold"
        onClick={handleSubmit}
      >
        {copy.analyzeLetter}
      </Button>
```

Leave `copy.takePhoto` in `src/lib/i18n/copy.ts` as unused dead data for now — Task 5 of this plan touches that file extensively; removing the now-orphaned key there too, in the same pass, avoids two separate diffs to the same object.

- [ ] **Step 2: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: no errors (confirms `Camera` removal didn't leave a dangling reference).

- [ ] **Step 3: Commit**

```bash
git add project/src/app/upload/upload-form.tsx
git commit -m "fix: remove Take a photo button from upload form

Photo capture already works through the regular file picker on any
phone (tapping the drop zone opens the OS's native
camera-or-library chooser) - the dedicated button was a second, redundant
path to the same result."
```

---

## Task 2: `nav`/`deadlines`/`settings` copy dictionary entries

**Files:**
- Modify: `src/lib/i18n/copy.ts`

**Interfaces:**
- Produces: `APP_COPY[language].nav.{history,upload,deadlines,settings,navLabel}`, `APP_COPY[language].deadlines.{heading,emptyTitle,emptyDescription,uploadCta}`, `APP_COPY[language].settings.{heading,languageHeading,languageDescription,subscriptionHeading,subscriptionActive,subscriptionFree,accountHeading}` — all `string`. Tasks 3, 6, 7 consume these.

- [ ] **Step 1: Extend the `AppCopy` type**

In `src/lib/i18n/copy.ts`, find the `AppCopy` type (starts `export type AppCopy = {`). Add three new top-level fields, in this position (right after the `header` field, before `auth`):

```ts
  header: {
    logo: string;
    backToDashboard: string;
  };
  nav: {
    navLabel: string;
    history: string;
    upload: string;
    deadlines: string;
    settings: string;
  };
  auth: {
```

Add two more top-level fields at the end of the type, right before the closing `};` of `AppCopy` (after `legal`):

```ts
  legal: {
    privacy: {
      title: string;
      sections: { heading: string; body: string }[];
    };
    terms: {
      title: string;
      sections: { heading: string; body: (freeLetterLimit: number, price: string) => string }[];
    };
  };
  deadlines: {
    heading: string;
    emptyTitle: string;
    emptyDescription: string;
    uploadCta: string;
  };
  settings: {
    heading: string;
    languageHeading: string;
    languageDescription: string;
    subscriptionHeading: string;
    subscriptionActive: string;
    subscriptionFree: string;
    accountHeading: string;
  };
};
```

- [ ] **Step 2: Remove the now-unused `upload.takePhoto` field**

Still in the `AppCopy` type, find:
```ts
    dropSubtitle: string;
    takePhoto: string;
    analyzeLetter: string;
```
and remove the `takePhoto: string;` line (Task 1 deleted its only consumer).

- [ ] **Step 3: Add the English (`en`) values**

Find `export const APP_COPY: Record<AppLanguage, AppCopy> = {` → `en: {`. Add `nav` right after `header`:

```ts
    header: {
      logo: "Papkram",
      backToDashboard: "Back to dashboard",
    },
    nav: {
      navLabel: "Main navigation",
      history: "History",
      upload: "Upload",
      deadlines: "Deadlines",
      settings: "Settings",
    },
```

In the `en.upload` block, delete the line `takePhoto: "Take a photo",`.

Add `deadlines` and `settings` at the end of the `en` object, right after `legal` and before the `en` object's closing `},`:

```ts
    deadlines: {
      heading: "Deadlines",
      emptyTitle: "No deadlines yet",
      emptyDescription: "Upload a letter and any deadlines it mentions will show up here, soonest first.",
      uploadCta: "Upload a letter",
    },
    settings: {
      heading: "Settings",
      languageHeading: "Language",
      languageDescription: "Every summary, deadline, and reply draft is written in this language.",
      subscriptionHeading: "Subscription",
      subscriptionActive: "You have unlimited letters.",
      subscriptionFree: "You're on the free trial.",
      accountHeading: "Account",
    },
```

- [ ] **Step 4: Add the Arabic (`ar`) values**

Same three insertions, in the `ar` object:

```ts
    header: {
      logo: "Papkram",
      backToDashboard: "العودة إلى لوحة التحكم",
    },
    nav: {
      navLabel: "التنقل الرئيسي",
      history: "السجل",
      upload: "رفع",
      deadlines: "المواعيد النهائية",
      settings: "الإعدادات",
    },
```

Delete `takePhoto: "التقط صورة",` from `ar.upload`.

```ts
    deadlines: {
      heading: "المواعيد النهائية",
      emptyTitle: "لا توجد مواعيد نهائية بعد",
      emptyDescription: "ارفع خطابًا وستظهر هنا أي مواعيد نهائية مذكورة فيه، الأقرب أولاً.",
      uploadCta: "ارفع خطابًا",
    },
    settings: {
      heading: "الإعدادات",
      languageHeading: "اللغة",
      languageDescription: "يُكتب كل ملخص وموعد نهائي ومسودة رد بهذه اللغة.",
      subscriptionHeading: "الاشتراك",
      subscriptionActive: "لديك خطابات غير محدودة.",
      subscriptionFree: "أنت في التجربة المجانية.",
      accountHeading: "الحساب",
    },
```

- [ ] **Step 5: Add the Turkish (`tr`) values**

Same three insertions, in the `tr` object:

```ts
    header: {
      logo: "Papkram",
      backToDashboard: "Panele dön",
    },
    nav: {
      navLabel: "Ana gezinme",
      history: "Geçmiş",
      upload: "Yükle",
      deadlines: "Son tarihler",
      settings: "Ayarlar",
    },
```

Delete `takePhoto: "Fotoğraf çek",` from `tr.upload`.

```ts
    deadlines: {
      heading: "Son tarihler",
      emptyTitle: "Henüz son tarih yok",
      emptyDescription: "Bir mektup yükleyin, içinde geçen son tarihler burada en yakın olandan başlayarak görünsün.",
      uploadCta: "Mektup yükle",
    },
    settings: {
      heading: "Ayarlar",
      languageHeading: "Dil",
      languageDescription: "Her özet, son tarih ve yanıt taslağı bu dilde yazılır.",
      subscriptionHeading: "Abonelik",
      subscriptionActive: "Sınırsız mektubunuz var.",
      subscriptionFree: "Ücretsiz denemedesiniz.",
      accountHeading: "Hesap",
    },
```

- [ ] **Step 6: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: no errors. (This confirms all three locale objects satisfy the extended `AppCopy` type — if any field were missed for any language, this fails immediately.)

- [ ] **Step 7: Commit**

```bash
git add project/src/lib/i18n/copy.ts
git commit -m "feat: add nav/deadlines/settings copy, drop unused takePhoto strings"
```

---

## Task 3: `AppNav` component

**Files:**
- Create: `src/lib/nav-active.ts`
- Create: `src/lib/nav-active.test.ts`
- Create: `src/components/app-nav.tsx`

**Interfaces:**
- Produces: `isNavItemActive(pathname: string, href: string): boolean` (from `nav-active.ts`) — used by `AppNav` internally, not consumed elsewhere. `AppNav({ language: AppLanguage }): JSX.Element` — consumed by Task 4's layout.
- Consumes: `APP_COPY[language].nav.*` (Task 2).

- [ ] **Step 1: Write the failing test for the active-tab logic**

Create `src/lib/nav-active.test.ts`:

```ts
import { isNavItemActive } from "./nav-active";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

assert(isNavItemActive("/dashboard", "/dashboard") === true, "exact match is active");
assert(isNavItemActive("/letters/abc-123", "/dashboard") === false, "unrelated path is not active");
assert(
  isNavItemActive("/letters/abc-123", "/letters") === false,
  "'/letters' tab (not currently a nav item, but the logic must not false-positive on prefix collisions like '/letters' vs '/letters-archive')",
);
assert(isNavItemActive("/settings", "/settings") === true, "exact match on settings is active");
assert(isNavItemActive("/upload", "/dashboard") === false, "sibling top-level route is not active");
assert(isNavItemActive("/dashboardextra", "/dashboard") === false, "must not match on unrelated string prefix");
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd project && npx tsx src/lib/nav-active.test.ts`
Expected: fails to run — `isNavItemActive` doesn't exist yet (`Cannot find module './nav-active'` or similar).

- [ ] **Step 3: Implement `isNavItemActive`**

Create `src/lib/nav-active.ts`:

```ts
/**
 * A nav item is active on an exact path match, or on any sub-path of it
 * (e.g. "/letters/abc-123" should highlight a "/letters" tab) - but never on
 * an unrelated path that merely shares a string prefix (e.g. "/dashboardextra"
 * must not match "/dashboard"), so sub-path matching requires the boundary
 * slash, not just startsWith.
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
```

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `cd project && npx tsx src/lib/nav-active.test.ts`
Expected: six `PASS:` lines, exit code 0.

- [ ] **Step 5: Build `AppNav`**

Create `src/components/app-nav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Upload, CalendarClock, Settings } from "lucide-react";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { isNavItemActive } from "@/lib/nav-active";

type NavItem = {
  href: string;
  label: string;
  icon: typeof History;
  emphasized?: boolean;
};

export function AppNav({ language }: { language: AppLanguage }) {
  const pathname = usePathname();
  const copy = APP_COPY[language].nav;
  const isRtl = language === "ar";

  const items: NavItem[] = [
    { href: "/dashboard", label: copy.history, icon: History },
    { href: "/upload", label: copy.upload, icon: Upload, emphasized: true },
    { href: "/deadlines", label: copy.deadlines, icon: CalendarClock },
    { href: "/settings", label: copy.settings, icon: Settings },
  ];

  return (
    <nav
      dir={isRtl ? "rtl" : "ltr"}
      aria-label={copy.navLabel}
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-background sm:sticky sm:inset-x-auto sm:bottom-auto sm:top-0 sm:h-screen sm:w-20 sm:shrink-0 sm:border-t-0 sm:border-e-2"
    >
      <ul className="flex items-center justify-around px-2 py-2 sm:h-full sm:flex-col sm:justify-start sm:gap-3 sm:py-6">
        {items.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-[0.02em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  item.emphasized
                    ? "-translate-y-3 border-2 border-border bg-primary text-primary-foreground shadow-[3px_3px_0_0_var(--border)] sm:translate-y-0"
                    : active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 6: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add project/src/lib/nav-active.ts project/src/lib/nav-active.test.ts project/src/components/app-nav.tsx
git commit -m "feat: add AppNav (bottom tab bar / sidebar) with tested active-tab logic"
```

---

## Task 4: Route group — move dashboard/upload/letters, add the shared layout

**Files:**
- Create: `src/app/(app)/layout.tsx`
- Move: `src/app/dashboard/**` → `src/app/(app)/dashboard/**`
- Move: `src/app/upload/**` → `src/app/(app)/upload/**`
- Move: `src/app/letters/**` → `src/app/(app)/letters/**`
- Modify: `src/app/(app)/dashboard/page.tsx` (post-move)
- Modify: `src/app/(app)/upload/page.tsx` (post-move)
- Modify: `src/app/(app)/letters/[id]/page.tsx` (post-move)

**Interfaces:**
- Consumes: `AppHeader` (current signature, unchanged in this task — Task 5 simplifies it), `AppNav({ language })` (Task 3).
- Produces: nothing new consumed by later tasks — Task 4 is a structural move + layout, Tasks 6/7 create sibling routes inside the same `(app)` group independently.

Route groups (a folder named in parens) are invisible to the URL — `src/app/(app)/dashboard/page.tsx` still serves `/dashboard`. This is a physical `mv`, not a rewrite: every file's own content stays almost the same (only the top-of-file `AppHeader` render is removed, since the new layout renders it once for all three routes).

- [ ] **Step 1: Move the three route directories**

```bash
mkdir -p project/src/app/\(app\)
git mv project/src/app/dashboard project/src/app/\(app\)/dashboard
git mv project/src/app/upload project/src/app/\(app\)/upload
git mv project/src/app/letters project/src/app/\(app\)/letters
```

- [ ] **Step 2: Create the shared layout**

Create `src/app/(app)/layout.tsx`:

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { AppNav } from "@/components/app-nav";
import type { AppLanguage } from "@/lib/letters/types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("language").eq("id", user.id).single();
  const language = (profile?.language ?? "en") as AppLanguage;

  return (
    <>
      <AppHeader language={language} />
      <div className="flex flex-1 flex-col pb-20 sm:flex-row sm:pb-0">
        <AppNav language={language} />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </>
  );
}
```

This centralizes the "redirect to /login if unauthenticated" check that `dashboard/page.tsx`, `upload/page.tsx`, and `letters/[id]/page.tsx` each currently do individually — Step 3 below removes the now-redundant copies from those three pages (each still fetches `user` again for its own data queries, since a layout can't pass props down to the page it wraps in the App Router; only the redirect-if-missing duplication goes away).

- [ ] **Step 3: Update `(app)/dashboard/page.tsx`**

Remove the `<AppHeader language={language} />` render and the outer `<>...</>` fragment it no longer needs (the layout now renders it). Change:

```tsx
  return (
    <>
      <AppHeader language={language} />
      <main dir={dir} className="flex-1 bg-background">
```
to:
```tsx
  return (
    <main dir={dir} className="flex-1 bg-background">
```

and change the matching closing tags at the bottom from:
```tsx
      </main>
    </>
  );
}
```
to:
```tsx
      </main>
  );
}
```

Remove the now-unused `AppHeader` import line (`import { AppHeader } from "@/components/app-header";`) and the `redirect`/auth-check block:
```tsx
  if (!user) {
    redirect("/login");
  }
```
Since the layout already redirects unauthenticated users before this page ever renders, keep the `const { data: { user } } = await supabase.auth.getUser();` call itself (the page still needs `user.id` for its own `letters`/`profiles` queries) but drop the `if (!user) redirect(...)` and the now-unused `redirect` import.

- [ ] **Step 4: Update `(app)/upload/page.tsx`**

Same two changes: drop the `<AppHeader language={language} backHref="/dashboard" />` render (and its now-unused `AppHeader` import), unwrap the `<>...</>` fragment, and drop the `if (!user) redirect("/login")` block + now-unused `redirect` import (keep the `getUser()` call itself).

Before:
```tsx
  return (
    <>
      <AppHeader language={language} backHref="/dashboard" />
      <main dir={dir} className="flex-1 bg-background">
```
After:
```tsx
  return (
    <main dir={dir} className="flex-1 bg-background">
```
(and the matching closing-tag unwrap at the bottom, same pattern as Step 3).

- [ ] **Step 5: Update `(app)/letters/[id]/page.tsx`**

Same pattern. Before:
```tsx
  return (
    <>
      <AppHeader language={language} backHref="/dashboard" />
      <main className="flex-1 bg-background">
```
After:
```tsx
  return (
    <main className="flex-1 bg-background">
```
Drop the `AppHeader` import, the matching `</>` at the bottom, and the `if (!user) redirect("/login")` block (keep `getUser()` itself — the page still needs `user.id`).

- [ ] **Step 6: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

Run: `cd project && npm run build`
Expected: build succeeds; the route list in the build output still shows `/dashboard`, `/upload`, `/letters/[id]` (route groups never appear in the URL or the build's route table).

- [ ] **Step 7: Commit**

```bash
git add -A project/src/app/\(app\) project/src/app/dashboard project/src/app/upload project/src/app/letters
git commit -m "refactor: move dashboard/upload/letters into an (app) route group

Adds one shared layout (auth check, language fetch, AppHeader, AppNav)
instead of each page composing AppHeader individually. URLs are
unchanged - route groups are invisible to routing."
```

---

## Task 5: Simplify `AppHeader`

**Files:**
- Modify: `src/components/app-header.tsx`

**Interfaces:**
- Produces: `AppHeader({ language?: AppLanguage })` — drops `backHref`, `backLabel`, and its internal `LanguageSwitcher`/`LogoutButton` rendering. Task 7 moves `LanguageSwitcher` and `LogoutButton` into the new Settings page instead.
- Consumes: nothing new.

By this point (after Task 4), nothing passes `backHref`/`backLabel` to `AppHeader` any more — `onboarding/page.tsx` is the only remaining caller, and it already calls `<AppHeader />` with no props.

- [ ] **Step 1: Rewrite the component**

Replace the full contents of `src/components/app-header.tsx`:

```tsx
import Link from "next/link";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

/** Shared top bar for every authenticated route, plus onboarding. Navigation (language switcher, logout, section links) lives in AppNav and /settings now - this is just branding. */
export function AppHeader({ language }: { language?: AppLanguage }) {
  const copy = APP_COPY[language ?? "en"].header;
  const isRtl = language === "ar";

  return (
    <header dir={isRtl ? "rtl" : "ltr"} className="border-b-2 border-border bg-background">
      <div className="mx-auto flex max-w-3xl items-center px-6 py-4">
        <Link
          href="/dashboard"
          className="rounded-sm font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copy.logo}
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: no errors (confirms no remaining caller still passes `backHref`/`backLabel`, and that `LanguageSwitcher`/`LogoutButton` aren't referenced from this file anymore without being unused elsewhere — Task 7 wires them into `/settings` in the same overall change set).

- [ ] **Step 3: Commit**

```bash
git add project/src/components/app-header.tsx
git commit -m "refactor: simplify AppHeader to just the logo

backHref/backLabel are redundant now that AppNav exists; the language
switcher and logout button move to the new /settings page (next task)."
```

---

## Task 6: Deadlines page

**Files:**
- Create: `src/lib/letters/flatten-deadlines.ts`
- Create: `src/lib/letters/flatten-deadlines.test.ts`
- Create: `src/app/(app)/deadlines/page.tsx`
- Create: `src/app/(app)/deadlines/loading.tsx`
- Create: `src/app/(app)/deadlines/error.tsx`

**Interfaces:**
- Produces: `flattenAndSortDeadlines(letters: { id: string; summary: string | null; deadlines: { date: string; description: string }[] | null }[]): FlatDeadline[]` where `FlatDeadline = { date: string; description: string; letterId: string; letterSummary: string }`. Used only within this task's page.
- Consumes: `APP_COPY[language].deadlines.*` (Task 2), `EmptyState` (existing, unchanged).

- [ ] **Step 1: Write the failing test**

Create `src/lib/letters/flatten-deadlines.test.ts`:

```ts
import { flattenAndSortDeadlines } from "./flatten-deadlines";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

const letters = [
  {
    id: "letter-a",
    summary: "Electricity bill",
    deadlines: [{ date: "2026-03-15", description: "Pay balance" }],
  },
  {
    id: "letter-b",
    summary: "Insurance renewal",
    deadlines: [
      { date: "2026-01-10", description: "Confirm renewal" },
      { date: "2026-06-01", description: "Submit form" },
    ],
  },
  {
    id: "letter-c",
    summary: "No deadlines here",
    deadlines: [],
  },
  {
    id: "letter-d",
    summary: null,
    deadlines: null,
  },
];

const result = flattenAndSortDeadlines(letters);

assert(result.length === 3, "flattens 3 total deadlines across letters (empty/null letters contribute none)");
assert(result[0].date === "2026-01-10", "sorted soonest first");
assert(result[0].letterId === "letter-b", "carries the source letter id");
assert(result[1].date === "2026-03-15", "second-soonest is next");
assert(result[2].date === "2026-06-01", "latest is last");
assert(result[0].letterSummary === "Insurance renewal", "carries the source letter's summary");
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `cd project && npx tsx src/lib/letters/flatten-deadlines.test.ts`
Expected: fails — `flattenAndSortDeadlines` doesn't exist yet.

- [ ] **Step 3: Implement it**

Create `src/lib/letters/flatten-deadlines.ts`:

```ts
export type FlatDeadline = {
  date: string;
  description: string;
  letterId: string;
  letterSummary: string;
};

type LetterWithDeadlines = {
  id: string;
  summary: string | null;
  deadlines: { date: string; description: string }[] | null;
};

/** Pulls every deadline out of every letter into one flat, date-ascending list, each still pointing back at its source letter. */
export function flattenAndSortDeadlines(letters: LetterWithDeadlines[]): FlatDeadline[] {
  const flat: FlatDeadline[] = [];
  for (const letter of letters) {
    for (const deadline of letter.deadlines ?? []) {
      flat.push({
        date: deadline.date,
        description: deadline.description,
        letterId: letter.id,
        letterSummary: letter.summary ?? "",
      });
    }
  }
  return flat.sort((a, b) => a.date.localeCompare(b.date));
}
```

- [ ] **Step 4: Run the test again to confirm it passes**

Run: `cd project && npx tsx src/lib/letters/flatten-deadlines.test.ts`
Expected: six `PASS:` lines, exit code 0.

- [ ] **Step 5: Build the page**

Create `src/app/(app)/deadlines/page.tsx`:

```tsx
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/empty-state";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import { flattenAndSortDeadlines } from "@/lib/letters/flatten-deadlines";

export const metadata = {
  title: "Deadlines — Papkram",
  robots: { index: false },
};

export default async function DeadlinesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: letters }] = await Promise.all([
    supabase.from("profiles").select("language").eq("id", user!.id).single(),
    supabase.from("letters").select("id, summary, deadlines").eq("user_id", user!.id),
  ]);

  const language = (profile?.language ?? "en") as AppLanguage;
  const copy = APP_COPY[language].deadlines;
  const dir = language === "ar" ? "rtl" : "ltr";
  const deadlines = flattenAndSortDeadlines(letters ?? []);

  return (
    <main dir={dir} className="flex-1 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-4 text-xl font-extrabold tracking-[-0.02em] text-foreground">{copy.heading}</h1>
        {deadlines.length > 0 ? (
          <ul className="grid gap-3">
            {deadlines.map((d, i) => (
              <li key={`${d.letterId}-${i}`}>
                <Link
                  href={`/letters/${d.letterId}#deadlines`}
                  className="flex flex-col gap-2 rounded-md border-2 border-border bg-card px-5 py-4 shadow-[3px_3px_0_0_var(--border)] transition-shadow hover:shadow-[5px_5px_0_0_var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-foreground">{d.description}</p>
                    <p className="mt-0.5 truncate text-xs text-foreground/60">{d.letterSummary}</p>
                  </div>
                  <span className="shrink-0 rounded-full border-2 border-border bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
                    {d.date}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={CalendarClock}
            title={copy.emptyTitle}
            description={copy.emptyDescription}
            action={{ label: copy.uploadCta, href: "/upload" }}
          />
        )}
      </div>
    </main>
  );
}
```

`user!` is safe here — the `(app)/layout.tsx` from Task 4 already redirects unauthenticated requests before this page can render.

- [ ] **Step 6: Add the loading skeleton**

Create `src/app/(app)/deadlines/loading.tsx`:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function DeadlinesLoading() {
  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Skeleton className="mb-4 h-7 w-40" />
        <div className="grid gap-3">
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Add the error boundary**

Create `src/app/(app)/deadlines/error.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function DeadlinesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Deadlines page error", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl flex-1 bg-background px-6 py-16">
      <h1 className="sr-only">Deadlines</h1>
      <ErrorState
        message="Couldn't load your deadlines"
        recovery="This is usually temporary. Try again in a moment."
        onRetry={reset}
      />
    </main>
  );
}
```

- [ ] **Step 8: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

Run: `cd project && npm run build`
Expected: build succeeds; `/deadlines` appears in the route list as `ƒ /deadlines` (dynamic, same as `/dashboard`).

- [ ] **Step 9: Commit**

```bash
git add project/src/lib/letters/flatten-deadlines.ts project/src/lib/letters/flatten-deadlines.test.ts project/src/app/\(app\)/deadlines
git commit -m "feat: add /deadlines - cross-letter deadline list, soonest first"
```

---

## Task 7: Settings page

**Files:**
- Move: `src/app/(app)/dashboard/manage-subscription-link.tsx` → `src/components/manage-subscription-link.tsx`
- Modify: `src/app/(app)/dashboard/page.tsx` (update the one import this move affects)
- Create: `src/app/(app)/settings/page.tsx`
- Create: `src/app/(app)/settings/loading.tsx`
- Create: `src/app/(app)/settings/error.tsx`

**Interfaces:**
- Consumes: `LanguageSwitcher({ current: AppLanguage })` (existing, unchanged), `LogoutButton({ language?: AppLanguage })` (existing, unchanged), `ManageSubscriptionLink({ copy: AppCopy["dashboard"] })` (existing signature, unchanged — only its file location moves), `APP_COPY[language].settings.*` (Task 2).

`ManageSubscriptionLink` currently lives inside the `dashboard` route folder but is about to be used by two different routes (`/dashboard` and `/settings`) - it moves to `src/components/` since it's now genuinely shared, rather than one route importing another route's internal file.

- [ ] **Step 1: Move `ManageSubscriptionLink`**

```bash
git mv "project/src/app/(app)/dashboard/manage-subscription-link.tsx" project/src/components/manage-subscription-link.tsx
```

- [ ] **Step 2: Update the import in `(app)/dashboard/page.tsx`**

Change:
```tsx
import { ManageSubscriptionLink } from "./manage-subscription-link";
```
to:
```tsx
import { ManageSubscriptionLink } from "@/components/manage-subscription-link";
```

- [ ] **Step 3: Build the Settings page**

Create `src/app/(app)/settings/page.tsx`:

```tsx
import { createClient } from "@/lib/supabase/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoutButton } from "@/components/logout-button";
import { ManageSubscriptionLink } from "@/components/manage-subscription-link";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";

export const metadata = {
  title: "Settings — Papkram",
  robots: { index: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("language, has_active_subscription")
    .eq("id", user!.id)
    .single();

  const language = (profile?.language ?? "en") as AppLanguage;
  const hasActiveSubscription = profile?.has_active_subscription ?? false;
  const copy = APP_COPY[language].settings;
  const dashboardCopy = APP_COPY[language].dashboard;
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <main dir={dir} className="flex-1 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-6 text-xl font-extrabold tracking-[-0.02em] text-foreground">{copy.heading}</h1>

        <section className="mb-6 rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {copy.languageHeading}
          </h2>
          <p className="mt-1 text-sm text-foreground/70">{copy.languageDescription}</p>
          <div className="mt-4">
            <LanguageSwitcher current={language} />
          </div>
        </section>

        <section className="mb-6 rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {copy.subscriptionHeading}
          </h2>
          <p className="mt-1 text-sm text-foreground/70">
            {hasActiveSubscription ? copy.subscriptionActive : copy.subscriptionFree}
          </p>
          {hasActiveSubscription && (
            <div className="mt-4">
              <ManageSubscriptionLink copy={dashboardCopy} />
            </div>
          )}
        </section>

        <section className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-foreground">
            {copy.accountHeading}
          </h2>
          <div className="mt-4">
            <LogoutButton language={language} />
          </div>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Add the loading skeleton**

Create `src/app/(app)/settings/loading.tsx`:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <main className="flex-1 bg-background">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Skeleton className="mb-6 h-7 w-32" />
        <div className="grid gap-6">
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-28 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Add the error boundary**

Create `src/app/(app)/settings/error.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Settings page error", error);
  }, [error]);

  return (
    <main className="mx-auto max-w-3xl flex-1 bg-background px-6 py-16">
      <h1 className="sr-only">Settings</h1>
      <ErrorState
        message="Couldn't load your settings"
        recovery="This is usually temporary. Try again in a moment."
        onRetry={reset}
      />
    </main>
  );
}
```

- [ ] **Step 6: Remove the subscription banner's "Manage subscription" duplication from the dashboard (optional consolidation)**

Leave `(app)/dashboard/page.tsx`'s existing subscription banner exactly as it is — it still shows the "Unlimited letters" badge for at-a-glance status, which is useful right where letters are listed. Only the deeper account controls consolidate into Settings. No change needed here beyond the import path fixed in Step 2.

- [ ] **Step 7: Verify**

Run: `cd project && npx tsc --noEmit`
Expected: no errors.

Run: `cd project && npm run build`
Expected: build succeeds; `/settings` appears in the route list as `ƒ /settings`.

- [ ] **Step 8: Commit**

```bash
git add -A project/src/components/manage-subscription-link.tsx "project/src/app/(app)/dashboard/page.tsx" "project/src/app/(app)/dashboard/manage-subscription-link.tsx" "project/src/app/(app)/settings"
git commit -m "feat: add /settings - language, subscription, log out

Moves ManageSubscriptionLink to components/ since it's now shared
between /dashboard and /settings."
```

---

## Task 8: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Typecheck and build**

Run: `cd project && npx tsc --noEmit && npm run build`
Expected: both succeed with zero errors. Confirm the build's route list includes `/dashboard`, `/upload`, `/letters/[id]`, `/deadlines`, `/settings` and does **not** show any `(app)` segment (route groups never appear in output).

- [ ] **Step 2: Run the two pure-function tests together**

Run: `cd project && npx tsx src/lib/nav-active.test.ts && npx tsx src/lib/letters/flatten-deadlines.test.ts`
Expected: all `PASS:` lines, exit code 0.

- [ ] **Step 3: Start the dev server and screenshot every state**

Start the dev server in the background, then use the chrome-devtools MCP to screenshot, at 375px and 1440px, in English, Arabic, and Turkish:
- `/dashboard` (History) — nav visible, correct active tab highlighted
- `/upload` — nav visible, no "Take a photo" button, single full-width "Analyze letter" button
- `/deadlines` — both empty (a throwaway test account with zero letters) and populated (seed or insert a letter with a real `deadlines` array) states
- `/settings` — language switcher present and functional, subscription section reflects both `has_active_subscription: true` and `false` test-account states, log out present
- Confirm Arabic renders the whole nav mirrored (sidebar/tab bar on the correct side, icons/labels right-to-left) and that the emphasized Upload tab still reads clearly against the accent background in both themes the app supports.

Save every screenshot to `artifacts/review/` following this project's existing naming convention (`<page>.png`, `<page>-mobile.png`, `<page>-ar.png`, etc., matching prior sessions' pattern in that folder).

- [ ] **Step 4: Run `/design-review` on the two new pages**

Follow the project's `design-review` skill (chrome-devtools MCP against the live dev server, accessibility-tree-first, screenshot artifact required) on `/deadlines` and `/settings`. Fix any Blocker/High-Priority finding before proceeding; Medium/Nit may be logged and deferred.

- [ ] **Step 5: Confirm the existing Playwright specs still pass structurally**

`tests/auth.spec.ts` and `tests/upload-large-file.spec.ts` both assert `await expect(page).toHaveURL(/\/dashboard$/)` after login/onboarding — this still holds since `/dashboard`'s URL is unchanged. Read both files once more after this plan's changes and confirm neither references anything this plan removed (the "Take a photo" button, `AppHeader`'s old `backHref` link text, etc.) — neither did as of this plan's writing, so this should be a read-only confirmation, not an edit. Do **not** run `upload-large-file.spec.ts` repeatedly during this verification — it calls the real Gemini API and this project's free tier is capped at 20 requests/day; one confirmation run (if any) is enough.

- [ ] **Step 6: Final commit**

If Steps 3-5 required any fixes, commit them now with a message describing what was found and fixed. If nothing needed fixing, this task produces no commit of its own — Tasks 1-7 already captured all the real changes.

---

## Handoff to the reply-redesign plan

This plan's Task 6 (Deadlines) links to `/letters/{id}#deadlines`, and the new Settings/History/Deadlines pages don't depend on anything from the structured-reply-redesign plan (sender/subject/closing fields, the new reply flow, the share section) — that plan can be executed independently, before or after this one, in either order.
