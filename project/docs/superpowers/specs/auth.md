# Design: auth flow (signup, login, onboarding, welcome email)

Source: SPEC.md key user flow #1, mvp scope "email + password auth" + "onboarding language-picker". Implements BUILD_PROMPT.md step 02.

## flow

1. `/signup` — email + password form. Submits to a server action.
2. Server action calls `supabase.auth.signUp()`. On success, inserts a `profiles` row (`subscription_status: 'trialing'`, `trial_letters_used: 0`, `language: null`) using the **service role** client (bypasses RLS — no insert policy exists on `profiles` by design, see `plan/database.md`). Then fires the welcome email (fire-and-forget, does not block the redirect).
3. Redirect to `/onboarding`.
4. `/onboarding` — three large language buttons (English / Arabic / Turkish). Selecting one calls a server action that updates `profiles.language` for the current user (RLS-scoped client — the user updates their own row, which the "profiles: update own row" policy allows) and redirects to `/dashboard`.
5. `/login` — email + password form, server action calls `supabase.auth.signInWithPassword()`, redirects to `/dashboard`.
6. `proxy.ts` (Next.js 16's renamed `middleware.ts`) protects `/dashboard` and `/upload` — unauthenticated requests redirect to `/login`.

## why signup writes the profile row in the server action, not a DB trigger

A trigger (`on auth.users insert`) is the more common pattern, but it hides the welcome-email side effect and error handling behind a DB event the app code never sees fail. Keeping the profile insert and the welcome-email call in the same server action means: if the insert fails, we can retry/report inline; if the email fails, we log it but never block the redirect (a missed welcome email is not worth stalling onboarding over).

## files

| file | responsibility |
|---|---|
| `src/lib/supabase/client.ts` | browser client (`createBrowserClient`) — used by client components that need direct Supabase access (none yet in this step; kept for parity with the server helper). |
| `src/lib/supabase/server.ts` | server client (`createServerClient` + `next/headers` cookies) — used in Server Components and Server Actions where RLS should apply (reads/writes scoped to the signed-in user). |
| `src/lib/supabase/service.ts` | service-role client (`@supabase/supabase-js` directly, no cookies) — used only for the one insert that must bypass RLS (creating a profile row right after signup) and, later, the upload pipeline's trial-limit check. Never imported into a client component. |
| `src/proxy.ts` | Next.js 16 proxy (renamed from `middleware.ts`) — refreshes the session cookie on every request and redirects unauthenticated users away from `/dashboard` and `/upload`. |
| `src/app/auth/signup/actions.ts` | `signup(formData)` server action. |
| `src/app/auth/signup/page.tsx` | signup form UI. |
| `src/app/auth/login/actions.ts` | `login(formData)` server action. |
| `src/app/auth/login/page.tsx` | login form UI. |
| `src/app/onboarding/actions.ts` | `setLanguage(language)` server action. |
| `src/app/onboarding/page.tsx` | language-picker UI. |
| `src/emails/WelcomeEmail.tsx` | React Email template, inline styles only. |
| `src/lib/email/send-welcome-email.ts` | wraps the Resend call so the server action stays thin. |
| `src/lib/env.ts` | centralized, zod-validated env access (per `lib/CLAUDE.md`). |

## error handling

Server actions return the `lib/CLAUDE.md` error envelope: `{ ok: true, data } | { ok: false, error: { code, message, recovery } }`. The signup/login pages render `error.message` inline under the form (not a toast — this is the primary error UI for a one-shot form submit, not a confirmation of an async background action). Known error codes: `EMAIL_IN_USE`, `INVALID_CREDENTIALS`, `WEAK_PASSWORD`, `UNKNOWN`.

## redirect targets (the one genuinely ambiguous point SPEC.md left open)

SPEC.md says "post-signup redirect to the onboarding language-picker page" but doesn't say what happens if a user with `language` already set somehow lands on `/onboarding` again (e.g. browser back button), or what login redirects to for a user who never finished onboarding. Decision: `/onboarding` checks `profiles.language`; if already set, redirect straight to `/dashboard` (don't force re-onboarding). `/login`'s server action redirects to `/dashboard` unconditionally — `/dashboard` itself doesn't gate on `language` being set (later stages can add a nag banner if needed; v1 scope doesn't ask for it).

## RTL

Not applicable to this step — the auth/onboarding UI itself is always LTR chrome (buttons, forms); RTL only applies to rendered letter analysis content (step 03).
