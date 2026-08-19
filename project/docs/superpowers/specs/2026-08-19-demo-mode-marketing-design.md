# Design: demo mode + pre-release marketing (Stage 2)

Redefines SPEC.md's Stage 2 (previously "Reply PDF + Sending", now pushed to Stage 5). Goal: turn off selling, turn on hype — accounts unlock a free 4-letter demo, capture emails for the real launch via a newsletter opt-in, and give people a reason to share.

## 1. The switch — `DEMO_MODE`

A single boolean in `src/lib/constants.ts`, next to `FREE_LETTER_LIMIT` — same "single source of truth" pattern already used there.

```ts
export const DEMO_MODE = true;
```

When `true`:
- The upload flow's `TRIAL_LIMIT_REACHED` error opens `DemoLimitModal` instead of `PaywallModal`.
- The landing page's pricing/offer/bonuses section is replaced by a demo pitch + signup counter.
- Settings' Subscription section is hidden, replaced by a one-line demo notice.
- `setLanguage()` (onboarding) redirects to `/welcome` instead of `/dashboard`.

Stripe checkout/webhook/portal routes, `PaywallModal`, `settings-upgrade-button.tsx`, and all Stripe env vars are **left completely untouched** — just unreachable from the UI while `DEMO_MODE` is `true`. Flipping back to selling later is changing this one constant to `false`; no rebuild.

The existing bypass for `has_active_subscription` in `upload/actions.ts` (`if (!profile.has_active_subscription && profile.trial_letters_used >= FREE_LETTER_LIMIT)`) is untouched — anyone who already has a real subscription (should be ~none pre-launch) is unaffected either way.

## 2. Signup — newsletter opt-in

`signup-form.tsx` gets one checkbox, unchecked by default (no dark pattern): *"Notify me when Papkram fully launches."*

`signup/actions.ts`: if checked, after the profile insert succeeds, calls a new `addToLaunchAudience(email)` helper (`src/lib/email/add-to-launch-audience.ts`) that POSTs to Resend's Audiences API (`resend.contacts.create({ email, audienceId: RESEND_LAUNCH_AUDIENCE_ID })`). New env var: `RESEND_LAUNCH_AUDIENCE_ID` — created once in the Resend dashboard, no schema change.

This call is fire-and-forget, same pattern as `sendWelcomeEmail`: wrapped in try/catch, failures log to Sentry, never block or fail the signup flow. No new DB column — the audience membership on Resend's side is the source of truth for who gets the launch email.

Posthog event: `newsletter_opted_in` (fired client-side on successful signup when the checkbox was checked).

## 3. Post-onboarding "you're in" screen

New route: `src/app/welcome/page.tsx` (+ `loading.tsx`, no `error.tsx` needed — it's static content, no data fetch that can fail).

`onboarding/actions.ts`'s `setLanguage()` redirect target changes from `/dashboard` to `/welcome` when `DEMO_MODE` is `true` (else unchanged, straight to `/dashboard` — zero behavior change once demo mode is off). This makes `/welcome` a one-time stop reached naturally in the linear signup → onboarding → welcome → dashboard flow; no new DB flag is needed to track "have they seen it" since nothing redirects back to it later. Its own CTA (*"Continue to dashboard"*) sends them on to `/dashboard`.

Content: *"You're in. We'll email you the moment Papkram fully launches."* + a share block: *"Know someone who gets confusing German mail?"* with three share actions — X/Twitter (pre-filled tweet text + landing page URL via `https://x.com/intent/tweet?text=...&url=...`), WhatsApp (`https://wa.me/?text=...`), and Copy link (clipboard write of the landing page URL, toast confirmation). Copy stays factual and reassuring — no exclamation-heavy hype language, consistent with the locked "calm and clinical, reassuring" brand voice.

Posthog event: `share_link_clicked` with a `platform: "twitter" | "whatsapp" | "copy_link"` property.

## 4. Landing page — social proof counter

New server-side helper `src/lib/profile/count-registered.ts` using the service-role client (RLS on `profiles` only allows `select own row`, so an aggregate count needs the service role, same pattern as other admin-style queries) — returns `count(*)` from `profiles`. No PII exposed, just a number.

Rendered on the landing page (Server Component, so it's always fresh per request — no caching needed at this traffic scale) as: *"347 people signed up for early access."* Shows the real, unpadded number always, even if small — matches the locked brand voice; no fake floor or hidden-until-threshold logic.

The count excludes the fixed seed/demo account (`demo@germanpostreader.app`, created by `lib/seed/seed.ts`) so internal testing doesn't inflate a number that's supposed to represent real signups.

## 5. Landing page — pricing section replaced

When `DEMO_MODE` is `true`, the existing pricing/value-stack/Founder's-Circle-bonuses section (from the "landing offer rewrite" work) is swapped for a simpler section: the counter from §4, a short demo pitch (*"Free demo, no card needed. Try 4 real letters. We're not selling yet — sign up and we'll email you the moment Papkram fully launches."*), and the same `/signup` CTA used elsewhere on the page. The old pricing section's JSX and copy are not deleted — gated behind `DEMO_MODE` the same way the rest of the UI is, so turning selling back on later restores it unchanged.

## 6. Hitting the 4-letter cap

New `src/components/DemoLimitModal.tsx` (mirrors `PaywallModal.tsx`'s dialog structure, one responsibility: explain the demo is used up). `upload-form.tsx` renders `DemoLimitModal` instead of `PaywallModal` on `TRIAL_LIMIT_REACHED` when `DEMO_MODE` is `true`. Content: *"You've used all 4 demo letters. That's the full experience — upload, plain-language summary, deadlines, ready-to-send reply. We'll email you at launch."* No second opt-in ask (already captured at signup). Single "Back to dashboard" action, no payment UI.

Dashboard's trial banner copy changes from "X OF 4 FREE LETTERS USED" to "X OF 4 DEMO LETTERS USED" when `DEMO_MODE` is `true`.

## 7. Settings

The Subscription section (plan toggle, Stripe checkout button, manage-subscription link) is hidden when `DEMO_MODE` is `true`, replaced by one line: *"Papkram is currently a free demo. You'll be notified by email when full access launches."* The section's existing JSX is gated, not deleted.

## 8. OG image + meta

`src/app/opengraph-image.tsx` copy updated to the demo/waitlist framing (gated on `DEMO_MODE` same as everything else) — this is exactly the image that renders when the `/welcome` share links get posted, so it needs to match.

## 9. Copy

New `APP_COPY` keys needed (EN/AR/TR, added during implementation): signup's opt-in checkbox label; `/welcome` page heading/body/share-button labels; `DemoLimitModal`'s heading/body/CTA; dashboard's demo-letters-used badge text; Settings' demo notice; landing page's demo-pitch heading/body and counter string (interpolating the live count).

## 10. What's explicitly out of scope (YAGNI)

- No referral tracking, referral codes, or waitlist position/queue — decided against in favor of the simpler share-buttons-only approach.
- No countdown timer to a launch date (no real date exists yet; a countdown with no real deadline would be dishonest, against the locked brand voice).
- No new DB tables or columns — the Resend Audience is the newsletter list, and `/welcome`'s one-time-ness comes from redirect flow, not stored state.
- No changes to `DAILY_LETTER_LIMIT` — irrelevant, since the demo cap of 4 total is already far below it.

## 11. SPEC.md changes

Stage 2 in `later_stages` is replaced with this design's scope, renamed **"Demo Mode + Pre-Release Marketing."** The previous Stage 2 ("Reply PDF + Sending") is preserved, renumbered as the new Stage 5, after "Team and Family Plan." Stages 3 and 4 (Deadline Calendar Sync, Team and Family Plan) are otherwise unchanged, just no longer immediately next.
