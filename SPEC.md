# German Post Letter Reader

## what it is

Translates and analyzes German postal letters — uploaded as photos or PDFs — into plain-language summaries, deadline alerts, and ready-to-send reply drafts in English, Arabic, or Turkish.

## who it's for

Immigrants and expats living in Germany who receive official German-language letters (Behörde notices, bank mail, insurance, landlord) and cannot read them confidently.

## key user flows

1. User signs up, picks their language (English / Arabic / Turkish), and starts a free trial — no credit card required at signup.
2. User uploads a letter photo or PDF via the file picker; the app calls the Gemini analysis pipeline (native multimodal — reads images and PDFs directly, no separate OCR step) and shows a plain-language summary, deadline banner, and reply draft within 30 seconds.
3. User reads the analysis and copies the reply draft. (Formatted PDF export of the reply is a later-stages feature — see Stage 2 below, not yet shipped.)
4. User hits the free-trial letter limit and is prompted to subscribe; Stripe Checkout opens, user enters card, and access continues immediately on success.
5. User logs in later, sees their letter history dashboard, and can re-open any past analysis.

## mvp scope (v1 — what `/build-it` ships today)

**v1 size (USER-PICKED in the wizard — a hard scope contract):** launch-ready v1 (~3-4 weeks). chargeable from day one — everything in an MVP plus payments, analytics + error tracking, SEO/meta, and onboarding emails.
if a task appears mid-build that exceeds this size, STOP and move it to later_stages instead of growing v1 (`/scope-check` exists for exactly this).

- Email + password auth with a post-signup redirect to the onboarding language-picker page works.
- Letter upload via file picker (PDF or image) works. (Camera-capture upload was removed post-launch in favor of file-picker-only.)
- Gemini analysis pipeline (native multimodal — reads images and PDFs directly, no separate OCR step) returns summary, deadline detection, and reply draft in the user's chosen language within 30 seconds works.
- Language toggle (English, Arabic, Turkish) persists to the user's profile and re-renders the analysis output works.
- Free trial limit of 4 letters enforced; Stripe Checkout yearly subscription (€5.99/year) unlocks unlimited letters works.
- Letter history dashboard listing all past uploads with their summary previews works.
- Onboarding welcome email sent on signup via Resend works.
- Posthog analytics and Sentry error tracking instrumented works.

## quality commitments (USER-SET — non-negotiable)

set by the user in the wizard, NOT invented by claude. these are part of the contract; the `/design-review` gate enforces them.

**brand voice:** calm and clinical, reassuring

**bans — NEVER build these (each on screen is an automatic design-review blocker):**
- Inter as a heading font (body only)
- purple/blue hero gradients
- default shadcn gray as the whole palette
- testimonial carousels
- three-column link footers
- icon-grid "feature" sections

**state coverage:** every data view ships empty, loading, and error states. a page is not done until all three exist.

## design direction (LOCKED — picked by the user in the wizard)

**Playful** — Bold and loud on purpose. Saturated clashing colors, chunky radius, oversized headings, sticker accents.

> Bold and loud on purpose. Saturated, confident colors — sometimes clashing intentionally — chunky border radius, thick weights, oversized headings, maybe a hand-drawn or sticker-ish accent. Animation and motion are part of the identity, not garnish. This is the opposite of restraint. Great for consumer apps, games, creator tools, anything targeting a younger or more casual crowd. Wrong for anything that needs to feel safe or serious.

this is a USER CHOICE made before the kit was generated. it is the contract for the visual layer. do NOT default to "Inter + flat card grid + purple accent." build the project in THIS direction.

### tokens (paste these into design-system/MASTER.md verbatim)

```
fonts:
  heading: Bricolage Grotesque
  body:    Inter
  mono:    JetBrains Mono
  google_fonts_url: https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap

colors:
  background:         #fff7ed
  foreground:         #1a0a2e
  primary:            #7c3aed
  primary_foreground: #ffffff
  accent:             #fb923c
  muted:              #fef3c7
  muted_foreground:   #6b21a8
  border:             #fde68a

radius:
  sm: 14px
  md: 22px
  lg: 36px

density: comfortable

structure (the bones — non-color knobs that change the LOOK, not just the paint):
  shadow_style:  hard-offset
  border_style:  hard
  chip_style:    pill-uppercase
  heading_style: grotesque-bold
  column_layout: standard
  ornament:      sticker
```

how to translate structure tokens into code (these are LOAD-BEARING — they're what makes the aesthetic distinct from generic shadcn):

- **shadow_style = hard-offset** → hard offset shadow with NO blur (e.g. 4px 4px 0 #1a0a2e). always paired with a hard border.
- **border_style = hard** → visible 2px solid borders on cards and buttons. usually paired with hard-offset shadow.
- **chip_style = pill-uppercase** → rounded-full pill, UPPERCASE text with 0.06em letter-spacing, saturated accent bg, bold weight. loud.
- **heading_style = grotesque-bold** → use Bricolage Grotesque for headings; treat as a chunky grotesque — heavy weight (700-800), tight letter-spacing (-0.02em), oversized at hero.
- **column_layout = standard** → typical 1-fr layout. use shadcn-style cards or sections as needed.
- **ornament = sticker** → one element on the hero is a "sticker" — rotated 2-3 degrees, hard border, saturated accent. used sparingly, like a badge.

### lazyweb search keywords (LOCKED — use these in lazyweb MCP queries)

pair these with the project type when telling claude code to pull reference screens (e.g. `playful bold <project_type>`):

- `playful`
- `bold`
- `saturated`
- `chunky`
- `oversized`
- `sticker`
- `consumer`
- `creator-tools`
- `youth`

### reference products (real shipped products that exemplify this direction)

look at these by name when grounding layout choices — claude code can fetch their screens via lazyweb:

- Arc Browser
- Granola
- Cron (early)
- Loops.so
- Tella
- Riverside

### avoid (anti-patterns that break this aesthetic)

if claude code finds itself reaching for any of these, STOP and re-read this section:

- muted pastels (use saturated colors)
- serif typography
- small or zero radius (must be chunky)
- monochrome palettes
- tight grids

### what this means for the build

1. before any UI step, claude code reads this section and writes `design-system/MASTER.md` using these tokens (including the structure block) verbatim. no substitutions, no "close enough" font choices, no swapping shadow_style.
2. claude code calls the lazyweb MCP with the keywords above (combined with the project type) to fetch 3 real reference screens; saves them to `docs/design-refs/`.
3. claude code calls the frontend-design skill to commit to this aesthetic before writing JSX.
4. AFTER any UI step, claude code runs the web-design-guidelines skill for the correctness pass.

if any UI deviates from this direction, claude code rolls it back. the user picked this; the kit honors it.

## later stages (post-v1 roadmap)

each stage below is built incrementally via `/next-stage` after v1 ships and the user has validated it. stages are ordered highest priority to lowest. do NOT build them as part of v1.

### Stage 2 · Reply PDF + Sending

**goal:** Users can download a formatted reply letter as a PDF and optionally send it directly from the app.

scope:
- Formatted reply PDF export with user name and address pre-filled works.
- In-app email send of the reply draft (via Resend) to a user-specified recipient works.
- Reply sent confirmation logged to letter history works.

stage status: `not started` (change to `shipped` once `/next-stage` finishes stage 1)

### Stage 3 · Deadline Calendar Sync

**goal:** Detected deadlines are pushed to the user's calendar so nothing is missed.

scope:
- Google Calendar OAuth connection works.
- Detected deadline from any analyzed letter is saved as a calendar event with the letter summary as description works.
- User can disconnect calendar sync from settings works.

stage status: `not started` (change to `shipped` once `/next-stage` finishes stage 2)

### Stage 4 · Team and Family Plan

**goal:** One subscriber can invite family members or flatmates under a shared plan.

scope:
- Invite-by-email flow adds up to 5 seats to one subscription works.
- Each seat member sees only their own letters; plan owner sees all works.
- Per-seat billing via Stripe Billing quantity update works.

stage status: `not started` (change to `shipped` once `/next-stage` finishes stage 3)

## success metrics

- 30 paying subscribers within 6 weeks of launch.
- Subscription revenue covers Vercel + Supabase hosting costs within 8 weeks (Gemini's free tier covers the AI pipeline at v1 volume).
- Letter analysis pipeline returns a result in under 30 seconds for 95% of uploads.
- Free-trial to paid conversion rate reaches 15% within the first month.

## risks

- Image quality on low-resolution phone photos causes Gemini to misread the letter's text, making the AI summary wrong — user loses trust immediately.
- Gemini API latency or outage breaks the core flow; no fallback means the app is completely non-functional.
- Arabic and Turkish RTL layout bugs in the reply draft UI make those language modes unusable on launch day.
- German letter vocabulary is highly legal and bureaucratic — Gemini may hallucinate deadlines or misread amounts, causing real harm to users.
