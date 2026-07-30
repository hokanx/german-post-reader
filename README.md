# german-post-reader

## install (one step)

1. open this folder in Cursor / Claude Code (file → open folder) and trust the workspace.
2. open the claude code panel and run `/setup` — it installs every skill + MCP this kit needs (~2 minutes), then tells you to reload.

no terminal, no scripts. once setup finishes and you reload, run `/build-it`.

## what this is

your starter kit.

## stack

- Next.js (App Router) (Full-stack framework: server components for data fetching, server actions for AI pipeline calls, API routes for Stripe webhooks.)
- Supabase (Postgres database (users, letters, analyses), auth (email + password), and storage bucket for uploaded letter images and PDFs.)
- OpenAI GPT-4o (Vision + text model: reads OCR'd letter text (or raw image bytes), returns structured JSON with summary, deadlines, and reply draft in the user's chosen language.)
- Tesseract.js (fallback OCR) (Client-side OCR for image uploads when a direct image pass to GPT-4o is not viable; extracts raw German text before sending to the AI pipeline.)
- Stripe (Monthly subscription billing: Stripe Checkout for signup, Customer Portal for cancellation, webhooks to sync subscription state to Supabase.)
- Resend (Transactional email: welcome email on signup, trial-limit nudge email.)
- Posthog (Product analytics: track letter uploads, language selections, trial conversions, subscription events.)
- Sentry (Error tracking and performance monitoring for the AI pipeline and upload flow.)
- Vercel (Deployment target: edge network, automatic preview deploys, environment variable management.)
- Tailwind CSS + shadcn/ui (Utility styling and component primitives — overridden with the locked playful design system (saturated colors, chunky radius, grotesque-bold headings, hard-offset shadows).)
- Framer Motion (Motion layer: springy entrances, stagger lists, upload progress animation, overlay transitions — gated behind prefers-reduced-motion.)

## add-ons to install (in addition to the universal core)

- claude-seo: Generates meta titles, descriptions, and Open Graph tags for the landing page — important for organic discovery by immigrants searching 'translate German letter' in English, Arabic, and Turkish.
  ```
  claude mcp add claude-seo -- npx -y @anthropic-ai/claude-seo-mcp
  ```

## env vars to set in .env.local

- `NEXT_PUBLIC_SUPABASE_URL` from Supabase. signup: https://supabase.com/dashboard
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase. signup: https://supabase.com/dashboard
- `SUPABASE_SERVICE_ROLE_KEY` from Supabase. signup: https://supabase.com/dashboard
- `OPENAI_API_KEY` from OpenAI. signup: https://platform.openai.com/signup
- `STRIPE_SECRET_KEY` from Stripe. signup: https://dashboard.stripe.com/register
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` from Stripe. signup: https://dashboard.stripe.com/register
- `STRIPE_WEBHOOK_SECRET` from Stripe. signup: https://dashboard.stripe.com/webhooks
- `STRIPE_PRICE_ID` from Stripe. signup: https://dashboard.stripe.com/products
- `RESEND_API_KEY` from Resend. signup: https://resend.com/signup
- `RESEND_FROM_EMAIL` from Resend. signup: https://resend.com/domains
- `NEXT_PUBLIC_POSTHOG_KEY` from Posthog. signup: https://app.posthog.com/signup
- `NEXT_PUBLIC_POSTHOG_HOST` from Posthog. signup: https://app.posthog.com/signup
- `SENTRY_DSN` from Sentry. signup: https://sentry.io/signup/
- `NEXT_PUBLIC_SENTRY_DSN` from Sentry. signup: https://sentry.io/signup/
- `SUPABASE_ACCESS_TOKEN` from Supabase (personal access token — for the supabase MCP). signup: https://supabase.com/dashboard/account/tokens
- `VERCEL_TOKEN` from Vercel (access token — for one-shot deploys via /ship-it). signup: https://vercel.com/account/settings/tokens

## next — no terminal required

1. `.env.local` is already in this folder — you pre-filled it from the kit page. open it in cursor and verify (any blanks claude will ask for during /build-it).
2. open this folder in cursor (file → open folder). trust the workspace when prompted.
3. open the claude code panel. type `/setup` — claude installs every skill and mcp for you (~2 minutes). reload cursor when it tells you to.
4. type `/build-it` — claude reads `BUILD_PROMPT.md` and starts the build. it asks before running anything that would block your screen (dev servers, migrations, etc.).
5. (optional) instead of `/build-it`, paste individual prompts from the "first steps" section below if you'd rather drive each step yourself.

### slash commands shipped in this kit

every command lives in `.claude/commands/` — type `/` in the claude code panel to see them. **the three you'll actually use:**

- `/setup` — first-run install of every skill + mcp this kit needs. run once.
- `/build-it` — load `BUILD_PROMPT.md` and build + ship v1. the main event.
- `/ship-it` — ship + deploy to vercel preview, return a live URL.

supporting commands (use as needed):

- `/next-stage` — after v1, build the next planned stage from `SPEC.md`.
- `/add-feature` — add a single feature (v1 inclusion or a new stage).
- `/screenshot-fix` — visual review loop on a page (anti-slop, three states).
- `/design-review` — blocking design-review gate on a live page.
- `/status` — where am i? progress, uncommitted work, next move.
- `/why-broken` — diagnose the current error (3 ranked hypotheses, no code changes).
- `/scope-check` — flag scope creep against `SPEC.md`.
- `/push` — commit + push to GitHub (creates the repo if needed).
- `/track-it` — wire posthog + sentry + vercel analytics.
- `/revert-checkpoint` — roll back to a checkpoint commit (asks twice).

## first steps (paste these into claude code in order)

### 01. Scaffold, design system, and database schema

claude code prompt:

```
Do the following in order, stopping to fix any error before moving to the next sub-step.

1. Delete `project/README.md` and `project/.gitkeep`, then scaffold a new Next.js project into `project/` using `create-next-app@latest` with these flags: `--typescript --tailwind --eslint --app --src-dir --import-alias '@/*'`. After scaffolding, run `npx shadcn@latest init` inside `project/` accepting all defaults (style: default, base color: neutral, CSS variables: yes).

2. Install additional dependencies inside `project/`: `framer-motion`, `@supabase/ssr`, `@supabase/supabase-js`, `tesseract.js`, `openai`, `@sentry/nextjs`, `posthog-js`.

3. Create `project/design-system/MASTER.md`. Do NOT invoke ui-ux-pro-max to pick a palette — the direction is already locked. Read SPEC.md's design direction section and paste the following token block verbatim into MASTER.md:
   - Visual direction: Playful / Bold
   - Shadow style: hard-offset
   - Border style: hard (1.5-2px solid borders on all cards and inputs)
   - Chip style: pill-uppercase
   - Heading style: grotesque-bold (Inter Black or equivalent heavy grotesque, tight tracking, oversized)
   - Column layout: standard
   - Ornament: sticker (hero and empty states use sticker-style SVG accents)
   - Border radius: chunky — 16px minimum on cards, 12px on inputs, 8px on buttons
   - Colors: saturated, intentionally clashing — do not mute. Primary: electric yellow (#F5E642). Accent: hot coral (#FF4D4D). Surface: off-white (#FAFAFA). Text: near-black (#111111).
   - Anti-patterns (never do): muted pastels, serif fonts, zero-radius components, monochrome palettes, tight grids.
   - Reference products: Arc Browser, Granola, Cron (early), Loops.so, Tella, Riverside.
   Then extend `project/src/app/globals.css` to expose these as CSS custom properties and override shadcn's default radius and color variables.

4. Use planning-with-files to write `project/plan/database.md` covering the following Supabase schema for v1:
   - `profiles` table: id (uuid, FK to auth.users), language (enum: en, ar, tr), subscription_status (enum: trialing, active, canceled), trial_letters_used (int default 0), stripe_customer_id (text nullable), created_at.
   - `letters` table: id (uuid), user_id (uuid, FK to profiles), storage_path (text), raw_ocr_text (text), summary (text), deadlines (jsonb), reply_draft (text), risk_flags (jsonb), language (enum: en, ar, tr), created_at.
   - RLS rules: profiles — users can SELECT and UPDATE only their own row. letters — users can SELECT and INSERT only rows where user_id = auth.uid().
   - Supabase Storage bucket named `letters` (private, authenticated access only).

5. Use supabase-mcp to:
   a. Link to the hosted Supabase project using `supabase link --project-ref <ref>` (read the project ref from the NEXT_PUBLIC_SUPABASE_URL in .env.local).
   b. Apply the schema from plan/database.md — create both tables, the enums, and RLS policies.
   c. Create the `letters` storage bucket with authenticated-only access.
   d. Confirm all 2 tables and 1 bucket exist before moving on.

6. Create `project/.env.local` pre-filled with all env var names from SPEC.md's env_vars section (leave values as placeholder comments for the user to fill in). Do NOT hardcode any secrets.
```

### 02. Auth flow: signup, login, language onboarding, and welcome email

claude code prompt:

```
Read SPEC.md and plan/database.md. Then write an implementation design for the auth flow to `project/docs/superpowers/specs/auth.md`. Cover:
- Email + password signup via Supabase Auth (@supabase/ssr server client)
- Post-signup redirect to `/onboarding` (language picker page — English, Arabic, Turkish)
- On language save, write `language` to the `profiles` table and redirect to `/dashboard`
- Login page at `/login` with redirect to `/dashboard` on success
- Middleware at `project/src/middleware.ts` protecting `/dashboard` and `/upload` routes (redirect unauthenticated users to `/login`)
- Welcome email sent server-side on first profile creation using Resend + React Email

Then use planning-with-files to expand the design into `project/plan/auth.md` as a step-by-step TDD plan.

Then implement:
1. Supabase server client helper at `project/src/lib/supabase/server.ts` and browser client at `project/src/lib/supabase/client.ts` using `@supabase/ssr`. Use context7 to get the current @supabase/ssr API for the version installed in this project.
2. Middleware at `project/src/middleware.ts` protecting `/dashboard` and `/upload`.
3. Sign up server action at `project/src/app/auth/signup/actions.ts` — creates auth user, inserts a profiles row with `subscription_status: trialing` and `trial_letters_used: 0`, then triggers the welcome email.
4. Login server action at `project/src/app/auth/login/actions.ts`.
5. `/onboarding` page with three large language-choice buttons (English, Arabic, Turkish). On selection, update the profiles row and redirect to `/dashboard`.
6. Welcome email template at `project/src/emails/WelcomeEmail.tsx` using `@react-email/components` (Section, Text, Container) with inline `style={}` props — do NOT use Tailwind classes in the email template. Send via Resend using RESEND_API_KEY and RESEND_FROM_EMAIL.
7. Signup page at `/signup` and login page at `/login`.

After implementing, use playwright to write an E2E test at `project/tests/auth.spec.ts` covering: visit `/signup`, fill email + password, submit, land on `/onboarding`, pick English, land on `/dashboard`. Install Playwright first: run `npm i -D @playwright/test` and `npx playwright install` inside `project/`.
```

### 03. AI analysis pipeline: upload, OCR, GPT-4o, and results page

claude code prompt:

```
Read SPEC.md, plan/database.md, and docs/superpowers/specs/auth.md. Write an implementation design for the letter upload and analysis pipeline to `project/docs/superpowers/specs/pipeline.md`. Cover:
- File input accepting JPEG/PNG (camera or file picker) and PDF
- For image uploads: pass the image bytes directly to GPT-4o vision API (model: gpt-4o) with a system prompt instructing it to: extract the German text, then return structured JSON with keys `summary` (plain language in the user's language), `deadlines` (array of {date, description}), `reply_draft` (ready-to-send reply in the user's language), `detected_language_confirmed` (boolean), `risk_flags` (array of strings for ambiguous amounts or dates)
- For PDF uploads: use Tesseract.js to extract text first, then send the text to GPT-4o (text-only prompt)
- The server action must enforce the trial letter limit (read `trial_letters_used` and `subscription_status` from profiles using the service role key — never trust client counts)
- On success: insert a row into the `letters` table; upload the file to Supabase Storage at `{user_id}/{letter_id}`; increment `trial_letters_used` on profiles
- If trial_letters_used >= 3 and subscription_status = trialing, return a `TRIAL_LIMIT_REACHED` error code
- Wrap every OpenAI call in try/catch; on failure log to Sentry and return an explicit error — never show partial output
- Fire a Posthog `letter_uploaded` event and `analysis_completed` event (client-side, after success)

Then use planning-with-files to expand into `project/plan/pipeline.md`.

Then implement:
1. Upload server action at `project/src/app/upload/actions.ts` with all the logic above. Use context7 to get the current openai npm package API for the installed version.
2. Upload page UI at `project/src/app/upload/page.tsx` — a drag-drop + camera-capture zone.
3. Analysis results page at `project/src/app/letters/[id]/page.tsx` — fetches the letter row server-side (authenticated server component, service role key for the fetch), and renders summary, deadline badges, reply draft, and risk flags.
4. RTL handling: if the letter row's `language` is `ar`, wrap the output container in `dir="rtl"`. Test Arabic RTL rendering before marking done.
5. Loading state: if the pipeline takes longer than 3 seconds, show a branded loading animation with copy ('Reading your letter...' in the user's language). Use Framer Motion for the loading state animation — spring transition, gated behind `prefers-reduced-motion: reduce`.
```

### 04. Landing page and dashboard with playful design system

claude code prompt:

```
Read design-system/MASTER.md and SPEC.md. This step builds the public landing page and the authenticated dashboard shell. The visual direction is LOCKED (playful, bold, saturated, chunky — see MASTER.md). Do NOT re-derive fonts or palette.

Step A — Landing page layout brief:
Invoke ui-ux-pro-max with `--page "landing" --persist` to write `project/design-system/pages/landing.md`. Instruct it to:
- Honor the locked structure tokens from MASTER.md (hard-offset shadow, hard border, pill-uppercase chips, grotesque-bold headings, sticker ornament)
- Pick a layout pattern and section order for a consumer SaaS landing page targeting immigrants
- Reference the lazyweb keywords: playful, bold, saturated, chunky, oversized, sticker, consumer, creator-tools, youth
- Name specific shadcnblocks-skill blocks to use for hero, features, and pricing sections
- Specify at least one sticker-ornament hero treatment (NOT a flat shadcn hero)

Step B — Dashboard layout brief:
Invoke ui-ux-pro-max with `--page "dashboard" --persist` to write `project/design-system/pages/dashboard.md` covering the letter history list, upload CTA card, and trial status banner.

Step C — Pull shadcn blocks:
Use shadcnblocks-skill to fetch the specific blocks named in landing.md and dashboard.md.

Step D — Implement landing page:
Build `project/src/app/page.tsx` composing the fetched blocks per landing.md's section order. Include:
- Hero with a sticker-style SVG accent (hand-drawn arrow or badge shape, inline SVG, not an image file)
- Feature cards with hard-offset shadows and 16px+ border radius
- Pricing section showing the monthly plan with a trial callout chip (pill-uppercase style)
- CTA buttons using the electric yellow + coral palette from MASTER.md
- Language selector in the nav (English, Arabic, Turkish) — updates a cookie for the marketing page locale; does not require auth

Step E — Implement dashboard shell:
Build `project/src/app/dashboard/page.tsx` showing:
- Trial status banner (chunky pill badge showing letters remaining: '2 of 3 free letters used')
- Letter history list (each card shows upload date, first line of summary, a colored deadline chip if a deadline exists)
- Prominent 'Upload a Letter' button linking to `/upload`

Step F — Motion layer:
Add Framer Motion entrances to both pages. On the landing page: staggered feature cards (staggerChildren: 0.08s, y: 24 -> 0, opacity 0 -> 1, spring stiffness 300). On the dashboard: letter history cards stagger in on mount. All motion wrapped in a `useReducedMotion` check from Framer Motion — if true, skip all animations.

Step G — Screenshot review:
Use chrome-devtools-mcp to screenshot the landing page at 375px and 1440px, then re-invoke ui-ux-pro-max in review mode on both screenshots. Fix every CRITICAL finding before marking this step done. Explicitly verify: no muted pastels, no serif fonts, border radius >= 16px on cards, hard-offset shadows visible, at least one sticker ornament present in the hero.
```

### 05. Stripe subscription: checkout, webhook, and paywall enforcement

claude code prompt:

```
Read SPEC.md, plan/database.md, and docs/superpowers/specs/pipeline.md. Write an implementation design for the Stripe billing integration to `project/docs/superpowers/specs/billing.md`. Cover:
- Stripe Checkout (hosted page) for the monthly plan using STRIPE_PRICE_ID
- A `/api/stripe/checkout` server action (POST) that creates a Stripe Customer if none exists (store stripe_customer_id on profiles), then creates a Checkout Session with success_url `/dashboard?subscribed=true` and cancel_url `/dashboard`
- Stripe Customer Portal link generation at `/api/stripe/portal` for managing/canceling the subscription
- Webhook handler at `/api/stripe/webhook` verifying the STRIPE_WEBHOOK_SECRET signature, handling `customer.subscription.updated` and `customer.subscription.deleted` events — update `subscription_status` on the profiles table using the service role key
- Paywall component: when `subscription_status = trialing` and `trial_letters_used >= 3`, the upload page shows a 'You have used all 3 free letters' modal with a 'Subscribe Now' button that calls the checkout server action
- Posthog events: `trial_limit_reached` (fired when the paywall modal opens), `subscription_started` (fired on Stripe webhook success), `subscription_canceled` (fired on subscription.deleted webhook)

Then use planning-with-files to expand into `project/plan/billing.md`.

Then implement:
1. Stripe server helper at `project/src/lib/stripe.ts` (initializes stripe-node with STRIPE_SECRET_KEY — server-only, never imported in client components).
2. `/api/stripe/checkout/route.ts` — POST handler, server-side only, returns `{url}` for the Checkout Session.
3. `/api/stripe/portal/route.ts` — POST handler returning Customer Portal URL.
4. `/api/stripe/webhook/route.ts` — webhook handler with signature verification. Use context7 to get the current stripe-node webhook verification API for the installed version.
5. Paywall modal component at `project/src/components/PaywallModal.tsx` — rendered on the upload page when the server action returns TRIAL_LIMIT_REACHED. Styled per MASTER.md (chunky card, hard border, coral accent button, pill-uppercase 'FREE TRIAL ENDED' chip).
6. Trial nudge email: when `trial_letters_used` hits 3, send a Resend email using the React Email WelcomeEmail pattern (inline styles) with subject 'You have used your 3 free letters — subscribe to keep going'. Use RESEND_API_KEY and RESEND_FROM_EMAIL.

After implementing, use playwright to write an E2E test at `project/tests/billing.spec.ts` that: logs in as a trialing user with `trial_letters_used = 3`, navigates to `/upload`, confirms the PaywallModal is visible, and clicks 'Subscribe Now' — assert the page redirects to a Stripe Checkout URL.
```

### 06. SEO, meta, Sentry, Posthog, and production readiness

claude code prompt:

```
Read SPEC.md and design-system/MASTER.md. This step wires the analytics, error tracking, SEO, and verifies the full app is production-ready before the first deploy.

1. Sentry: initialize Sentry for Next.js using NEXT_PUBLIC_SENTRY_DSN and SENTRY_DSN. Run `npx @sentry/wizard@latest -i nextjs` inside `project/` accepting defaults. Confirm the Sentry config files (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`) are generated in `project/src/`. Add a Sentry error boundary wrapping the root layout.

2. Posthog: create `project/src/components/PosthogProvider.tsx` — a client component that initializes Posthog with NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST. Wrap the root layout in PosthogProvider. Do NOT import Posthog in any server component. Confirm the following events fire in the right places (read the existing code and add the calls where missing): `letter_uploaded`, `analysis_completed`, `language_changed`, `trial_limit_reached`, `subscription_started`, `subscription_canceled`.

3. SEO + Open Graph: use claude-seo to generate meta titles, descriptions, and Open Graph tags for:
   - `/` (landing page) — target keywords: 'translate German letter', 'read German mail for expats', in English. Also generate Arabic and Turkish variants for the `lang` attribute.
   - `/dashboard` — title only (noindex)
   Write the generated tags into `project/src/app/layout.tsx` using Next.js Metadata API. Add a `manifest.json` and a placeholder `opengraph-image.png` (1200x630, solid electric yellow background with the app name in grotesque-bold — generate via canvas or use a placeholder SVG).

4. Robots and sitemap: create `project/src/app/robots.ts` (allow all, disallow `/dashboard`, `/upload`, `/api`) and `project/src/app/sitemap.ts` (include `/` and `/signup` only).

5. Deployment readiness check:
   a. Confirm `project/.env.local` has all required env vars documented (values can be placeholders but names must all be present).
   b. Use chrome-devtools-mcp to do a final screenshot pass on `/`, `/signup`, `/onboarding` (mock state), and `/dashboard` (mock letter data) at 375px and 1440px.
   c. Check for any console errors in the screenshots and fix them.
   d. Ask the user: 'Ready to deploy to Vercel? I will push to GitHub and connect Vercel now.' On yes, use github-mcp to create a new GitHub repository named `german-post-reader`, commit all files, and push. Then provide instructions (in plain text, no terminal commands for the user) on how to connect the repo to Vercel via the Vercel dashboard and paste in the env vars.
```
