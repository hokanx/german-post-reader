# CLAUDE.md

> base behavioral rules live in the andrej-karpathy-skills plugin (installed
> by `/setup` into your user-scope skills). claude code loads them
> automatically on every turn — you do NOT need to merge anything by hand.
> the rules below are project-specific overrides only.
>
> the universal core (superpowers, ui-ux-pro-max, shadcnblocks, planning-
> with-files + the 4 MCPs) is also installed by `/setup`. don't try to
> install anything yourself in CLAUDE.md.

## north star (read first)

**brand voice:** calm and clinical, reassuring. every button label, empty state, toast, and error message sounds like this — never generic AI copy.

**BANS — never build these. each one that appears on a page is an automatic `/design-review` blocker:**
- Inter as a heading font (body only)
- purple/blue hero gradients
- default shadcn gray as the whole palette
- testimonial carousels
- three-column link footers
- icon-grid "feature" sections

**golden example:** the first page taken all the way through the `/design-review` gate is locked as `artifacts/golden.png`. every later page must clear that same bar — open it and compare before calling a page done.

## layered memory (scoped CLAUDE.md files)

deeper rules live in scoped CLAUDE.md files that load automatically when you work inside those folders. they ship in `docs/claude/` — **right after you scaffold the app (step 01), move each into place** (use `src/` if the scaffold uses it, else the project root):
- `docs/claude/components.CLAUDE.md` → `<src>/components/CLAUDE.md` — the design-system coding rules
- `docs/claude/app.CLAUDE.md` → `<src>/app/CLAUDE.md` — routing + the required per-route loading/error/not-found
- `docs/claude/lib.CLAUDE.md` → `<src>/lib/CLAUDE.md` — data layer, where Faker seeds live, error-envelope shape

## stack

- Next.js (App Router): Full-stack framework: server components for data fetching, server actions for AI pipeline calls, API routes for Stripe webhooks.
- Supabase: Postgres database (users, letters, analyses), auth (email + password), and storage bucket for uploaded letter images and PDFs.
- Google Gemini (gemini-flash-latest): Vision + document model: reads letter images AND PDFs directly (native multimodal document understanding — no separate OCR step needed for either), returns structured JSON with summary, deadlines, and reply draft in the user's chosen language. Swapped in from the originally-planned OpenAI GPT-4o for its free tier — same role in the pipeline. Tesseract.js was dropped from the stack: it was originally scoped as the PDF-text-extraction step for the OpenAI pipeline, but Tesseract/Leptonica cannot decode PDF containers at all (image formats only), and Gemini's native PDF support makes that step unnecessary regardless.
- Stripe: Yearly subscription billing: Stripe Checkout (mode: subscription) for the €5.99/year unlimited unlock, a webhook (`customer.subscription.*`) to sync subscription state in Supabase, Customer Portal for self-service cancellation.
- Resend: Transactional email: welcome email on signup, trial-limit nudge email.
- Posthog: Product analytics: track letter uploads, language selections, trial conversions, subscription events.
- Sentry: Error tracking and performance monitoring for the AI pipeline and upload flow.
- Vercel: Deployment target: edge network, automatic preview deploys, environment variable management.
- Tailwind CSS + shadcn/ui: Utility styling and component primitives — overridden with the locked playful design system (saturated colors, chunky radius, grotesque-bold headings, hard-offset shadows).
- Framer Motion: Motion layer: springy entrances, stagger lists, upload progress animation, overlay transitions — gated behind prefers-reduced-motion.

## who is talking to you

the person on the other side of this chat is a NON-DEVELOPER. they have never typed an `npm` or `git` command and they should never have to. they are here to ship a product, not learn a terminal.

## terminal rule (non-negotiable)

NEVER instruct the user to run a terminal command. you have a Bash tool — YOU run the command, then report back. examples:

- bad: "now run `npm run dev` to start the dev server."
- good: "i'm going to start the dev server now." → [run `npm run dev` yourself via your Bash tool] → "the server is up at http://localhost:3000."

- bad: "do `git status` and tell me what you see."
- good: [run `git status` yourself, summarize the output] "looks like 3 modified files, no untracked. ok to commit?"

if you need explicit go-ahead before running something risky (long-running server, destructive command, anything that costs money), ASK first — "want me to start the dev server?" / "ok to run the migration?" — then YOU run it on yes. never make them type.

if you absolutely cannot run a command (e.g. it requires opening a browser or clicking something in a GUI), describe the click path step by step: "open the supabase dashboard tab. settings → api. copy the project URL." not "run X in your terminal."

## project-specific rules

## Project: German Post Reader

### Design direction — LOCKED, do not re-derive
The visual identity is PLAYFUL / BOLD. Tokens are in design-system/MASTER.md. Do not invent new palette colors, fonts, or border radii. Key invariants:
- Shadow style: hard-offset (never soft blur-only shadows)
- Border style: hard (visible 1.5-2px borders on cards and inputs)
- Chip style: pill-uppercase (status badges are all-caps pill shapes)
- Heading style: grotesque-bold (heavy weight, tight tracking, oversized)
- Ornament: sticker (hero and empty states use sticker-style accent graphics)
- Saturated clashing colors are intentional — do not mute them
- Border radius must be chunky (16px minimum on cards, 12px on inputs)
- Avoid: muted pastels, serif fonts, monochrome palettes, zero-radius components, tight grids

Reference products for visual bar: Arc Browser, Granola, Cron (early), Loops.so, Tella, Riverside.

### RTL layout rule
Arabic output must render in a right-to-left container (`dir="rtl"`). Any component that displays analysis text or reply drafts must check the user's selected language and set `dir` accordingly. Turkish and English are LTR. Test RTL on every UI step before marking done.

### AI pipeline rules
- The analysis server action MUST return structured JSON with these exact keys: `summary` (string), `deadlines` (array of {date, description}), `reply_draft` (string), `reply_draft_translation` (string), `detected_language_confirmed` (boolean), `risk_flags` (array of strings for ambiguous amounts or dates).
- `reply_draft` is ALWAYS written in German — it's the text that actually gets sent to the German recipient (Behörde, bank, insurer, landlord). `reply_draft_translation` is that same reply translated into the user's chosen language, so they know what they're sending before they send it. `summary`, `deadlines`, and `risk_flags` stay in the user's chosen language.
- Never surface raw OCR output to the user — always pass through the AI pipeline first.
- If the pipeline takes longer than 25 seconds, surface a loading state with progress copy — never a blank screen.
- Wrap every Gemini call in a try/catch; on failure, show an explicit "Analysis failed — try again" error state, log to Sentry, and do NOT show partial output.

### Stripe rules
- Access state is stored in Supabase on the `profiles` table as `has_active_subscription` (boolean) and `trial_letters_used` (integer).
- The free trial limit is 4 letters (`FREE_LETTER_LIMIT` in `src/lib/constants.ts` — the single source of truth; never hardcode the number elsewhere). Enforce server-side in the upload server action — never trust client-side counts.
- Unlocking unlimited letters is a €5.99/year subscription (`SUBSCRIPTION_PRICE_EUR` in the same constants file), billed via Stripe Checkout (mode: subscription).
- The Stripe webhook listens for `customer.subscription.created/updated/deleted` and sets `has_active_subscription` via the service role key, matched on `stripe_customer_id`.
- Customer Portal (`/api/stripe/portal`) lets a subscribed user cancel/manage billing self-service — linked from the dashboard's "Unlimited letters" banner.
- Stripe Checkout and Customer Portal URLs are generated server-side. Never pass the Stripe secret key to the client.

### Letter history
- Each uploaded letter and its analysis is stored in the `letters` table with RLS: users can SELECT/INSERT only their own rows.
- Letter image/PDF files are stored in a Supabase Storage bucket named `letters`, with a per-user folder path (`{user_id}/{letter_id}`).
- Anon users cannot access any letter data — all fetches go through authenticated server components or server actions.

### Email rules
- Resend emails use React Email components with inline `style={}` props — do NOT use plain Tailwind classes in email templates.
- The welcome email is sent from the `onAuthStateChange` server-side hook (or a Supabase auth webhook), not from the client.

### Analytics rules
- Posthog events to track: `letter_uploaded`, `analysis_completed`, `language_changed`, `trial_limit_reached`, `subscription_started`, `subscription_canceled`.
- Posthog is initialized client-side in a `<PosthogProvider>` wrapper — never import Posthog in server components.

### Scope guardrails
- v1 does NOT include PDF export of reply drafts, calendar sync, or team/family seats — redirect any such requests to the later_stages backlog.
- v1 does NOT include social auth (Google, Apple) — email + password only.


## UI rules (non-negotiable)

- the **design direction** in SPEC.md is the contract. its tokens (fonts, palette, radius, density) are USER-PICKED and LOCKED. you do NOT pick new fonts, swap the palette, round corners differently, or change density. `design-system/MASTER.md` is the verbatim copy of that token block.
- BEFORE writing any UI: read SPEC.md's "design direction" section, `design-system/MASTER.md`, AND `design-system/pages/<this-page>.md`. if any is missing, STOP and complete the DESIGN-FIRST step in BUILD_PROMPT.md (rule 3) first.
- GROUND layouts in real shipped apps: use the **lazyweb MCP** to fetch reference screens whose keywords match SPEC.md's keywords + the project type. save them to `docs/design-refs/`. NEVER pattern-match layouts from your training data when references exist.
- COMMIT the aesthetic via the **frontend-design** skill before writing JSX. it enforces the "no generic AI look" discipline — Inter + purple gradient + flat card grid is the default to avoid, not a fallback.
- AFTER writing any UI: screenshot via chrome-devtools-mcp at 375px and 1440px. compare to the design direction. then run the **web-design-guidelines** skill as the correctness pass (a11y, focus rings, tap targets, contrast). fix every CRITICAL finding before declaring done.
- always: no emoji icons (lucide only), touch targets >= 44pt on mobile, text contrast >= 4.5:1, focus-visible rings on every interactive element (2-4px, >=3:1 against bg), body text >= 16px on mobile, one primary CTA per screen, one icon set with one stroke width, **semantic color tokens ONLY** — never raw Tailwind color classes (`bg-blue-500`, `text-zinc-700`, gradients like `from-purple-500`) or raw hex inside components; every color resolves through the OKLCH tokens in `globals.css` (`bg-background`, `text-foreground`, `bg-primary`, `bg-muted`, `border-border`, focus-visible ring via `--ring`). raw color values live ONLY in the globals.css token definitions.

## design-review gate (the screenshot-artifact iron law — non-negotiable)

every page passes through the BLOCKING `/design-review` gate (BUILD_PROMPT.md UI quality gate, step i) before it is "done". the gate drives the LIVE page via the chrome-devtools MCP and reads the **accessibility tree** (`take_snapshot`) as its primary input.

THE IRON LAW: **you may NOT report a page's review as PASS unless a screenshot artifact physically exists at `artifacts/review/<page>.png`.** "looks great" / "the code looks correct" / "it should render fine" with no screenshot file on disk = AUTOMATIC FAIL. before any pass, run `ls -la artifacts/review/<page>.png` and confirm the file is there. this exists to guard the failure mode where the browser MCP silently disconnects and the agent passes off reading source code — a review without a rendered screenshot is not a review. no file, no pass.

the first page through the gate becomes `artifacts/golden.png` — the bar every later page is reviewed against.

## verification rule (non-negotiable)

(from the superpowers `verification-before-completion` skill, obra/superpowers)

never claim a step is done without running the verify command in *this* response and reading its output. "should work" / "looks correct" / "probably passes" are red flags. evidence before claims, always. for code changes, run the test or build and quote the actual exit code or pass/fail count. for UI changes, attach the screenshot.

## env vars

- `NEXT_PUBLIC_SUPABASE_URL` (Supabase)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase)
- `SUPABASE_SERVICE_ROLE_KEY` (Supabase)
- `GEMINI_API_KEY` (Google Gemini)
- `STRIPE_SECRET_KEY` (Stripe)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Stripe)
- `STRIPE_WEBHOOK_SECRET` (Stripe)
- `STRIPE_PRICE_ID` (Stripe)
- `RESEND_API_KEY` (Resend)
- `RESEND_FROM_EMAIL` (Resend)
- `NEXT_PUBLIC_POSTHOG_KEY` (Posthog)
- `NEXT_PUBLIC_POSTHOG_HOST` (Posthog)
- `SENTRY_DSN` (Sentry)
- `NEXT_PUBLIC_SENTRY_DSN` (Sentry)
- `SUPABASE_ACCESS_TOKEN` (Supabase (personal access token — for the supabase MCP))
- `VERCEL_TOKEN` (Vercel (access token — for one-shot deploys via /ship-it))

## last updated

2026-07-30
