# Plan: auth flow implementation

Expands `docs/superpowers/specs/auth.md` into bite-sized steps.

1. **env access** — write `src/lib/env.ts`: zod schema validating `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` are present; export a parsed `env` object. Every later file reads env through this, never `process.env` directly.
2. **Supabase clients** — `src/lib/supabase/client.ts` (browser), `src/lib/supabase/server.ts` (RLS-scoped server client using `await cookies()`), `src/lib/supabase/service.ts` (service-role, no cookies).
3. **proxy** — `src/proxy.ts` with `export async function proxy(...)` and `export const config = { matcher: [...] }`, protecting `/dashboard` and `/upload`.
4. **error envelope type** — add `Result<T>` type to `src/lib/result.ts` per `lib/CLAUDE.md`.
5. **welcome email** — `src/emails/WelcomeEmail.tsx` (inline styles, `@react-email/components`), `src/lib/email/send-welcome-email.ts` wrapping the Resend call, swallowing (logging, not throwing) failures.
6. **signup** — `src/app/auth/signup/actions.ts`: validate input (zod), `supabase.auth.signUp`, insert `profiles` row via the service client, send welcome email, redirect to `/onboarding`. Map Supabase auth errors to `EMAIL_IN_USE` / `WEAK_PASSWORD` / `UNKNOWN`.
7. **signup UI** — `src/app/auth/signup/page.tsx`: email + password + confirm-password fields, submit button, inline error rendering, link to `/login`.
8. **login** — `src/app/auth/login/actions.ts`: `supabase.auth.signInWithPassword`, redirect to `/dashboard`. Map errors to `INVALID_CREDENTIALS` / `UNKNOWN`.
9. **login UI** — `src/app/auth/login/page.tsx`: mirrors signup form, link to `/signup`.
10. **onboarding** — `src/app/onboarding/actions.ts`: `setLanguage(language)` updates `profiles.language` via the RLS-scoped server client, redirects to `/dashboard`. `src/app/onboarding/page.tsx`: Server Component reads the current profile; if `language` already set, redirect to `/dashboard` immediately; otherwise render three language buttons.
11. **build check** — `npm run build` inside `project/`, fix any type errors.
12. **manual smoke test** — start the dev server, walk `/signup` → `/onboarding` → `/dashboard` (dashboard is a placeholder page until step 04) by hand via chrome-devtools screenshots.
13. **E2E test** — install Playwright (`npm i -D @playwright/test`, `npx playwright install`), write `tests/auth.spec.ts` covering the flow in SPEC.md's key user flow #1.
14. **commit** — `feat: auth flow (signup, login, onboarding, welcome email)`.

## self-review (spec coverage)

- Signup with email+password: step 6-7. ✓
- Post-signup redirect to onboarding: step 6. ✓
- Language picker persists to profile: step 10. ✓
- Redirect to dashboard after onboarding: step 10. ✓
- Login redirect to dashboard: step 8-9. ✓
- Protect `/dashboard`, `/upload`: step 3. ✓
- Welcome email via Resend: step 5, 6. ✓
- No placeholders, no TBDs. ✓
