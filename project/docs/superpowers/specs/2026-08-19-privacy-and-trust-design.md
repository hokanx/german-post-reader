# Design: privacy compliance fixes + landing-page trust messaging + self-service deletion

Fixes what can be fixed now without the operator's personal identity (name/address/VAT status), which stays parked as a pre-launch checklist item — see §5. Also adds the data-handling trust messaging the user asked to have publicly visible on the landing page, and self-service account deletion, which strengthens both the privacy page and the landing trust copy by making "delete any time" literally true.

## 1. Contact email swap

`hello@germanpostreader.app` → `hello@papkram.de` (confirmed live/checked) in:
- `src/components/landing/footer.tsx` (mailto link)
- `src/app/privacy/page.tsx`'s mailto link
- `APP_COPY[*].legal.terms` sections in `src/lib/i18n/copy.ts` — the `[operator email]` placeholders in "Right of withdrawal (Widerrufsrecht)", "Model withdrawal form", and "Account termination", across EN/AR/TR.

`seed.ts`'s `DEMO_EMAIL` (`demo@germanpostreader.app`) is unrelated — it's the seed account's login credential, not a contact address — left untouched. The Impressum's placeholders (name, street address, VAT, register entry) stay untouched — that needs the operator's real identity, explicitly parked per §5.

## 2. Privacy policy updates

`APP_COPY[*].legal.privacy.sections` in `copy.ts`, EN/AR/TR:

- **New section, "Who else handles your data"**: names Supabase (database + file storage), Resend (email delivery), PostHog (product analytics — only if cookie consent was granted), Sentry (error tracking), Vercel (hosting). These are already-in-use tools; this section just discloses them, no new integration.
- **"How your letter is processed"** gets one added sentence: Google (Gemini) participates in the EU-US Data Privacy Framework, which is the transfer basis for sending letter content to a US-based processor.
- **New sentence on retention**: data is kept until the user deletes their account (self-service, per §4) or requests deletion by email; there's no automatic deletion after inactivity. This documents actual behavior — no new retention automation is being built.
- **"Your rights"** section is rewritten to lead with the new self-service path (§4) instead of "email us" as the only option — email stays as a fallback for anyone who can't access their account.
- **Not added**: newsletter/Resend-Audience language. That's not live code yet (Stage 2 hasn't been built). Adding policy text for a feature that doesn't exist would be inaccurate. This is now a required task inside Stage 2's own implementation plan instead.

## 3. Landing page — privacy trust callout

`TrustCallout` (`src/components/landing/trust-callout.tsx`) currently renders one `{heading, body}` card. Its prop/copy shape changes from a single object to an array, and the component maps over it rendering the same card markup for each — same visual pattern (icon + heading + body in a muted bordered card), no new section, not an icon-grid (still one full-width stacked column, not a multi-column grid).

New second card, after the existing "We tell you when we're not sure" card:
- Icon: `Lock` (lucide, same 1.5px stroke convention as the rest of the app)
- Heading: *"Your letters stay private"*
- Body: *"Uploaded letters are processed only to generate your summary and reply draft — never used to train any AI model. Delete your data any time from your account settings."*

`copy.trust: { heading, body }` in `src/components/landing/copy.ts` becomes `trust: { heading: string; body: string }[]`, EN/AR/TR, with the new second entry added to all three.

## 4. Self-service account deletion

**UI:** Settings page, Account section, next to "Log out" — a "Delete account" button (`variant="destructive"` or equivalent styling — visually distinct from the neutral "Log out" action). Opens a confirmation `Dialog`:
- Explains what's being deleted: all letters, reply drafts, and cancels any active subscription; states this cannot be undone.
- A text input requiring the user to type the fixed literal `DELETE` (not translated, same in EN/AR/TR — a safety mechanism, not user-facing prose, matching the convention of similar type-to-confirm patterns elsewhere) before the "Delete my account" button enables. The surrounding label ("Type DELETE to confirm") is translated as normal.

**Server action** (new, e.g. `src/app/(app)/settings/delete-account-action.ts`):
1. Authenticate via the request-scoped client (`createClient()`), get the current user's id — never accept a client-supplied id.
2. Using the service-role client (`createServiceClient()`):
   a. List and remove all objects under `letters/{user_id}/` in Supabase Storage. Failure is logged to Sentry, not blocking.
   b. If `profiles.stripe_customer_id` is set, list the customer's active Stripe subscriptions (`stripe.subscriptions.list({ customer, status: "active" })`) and cancel each immediately (`stripe.subscriptions.cancel(id)`, not `cancel_at_period_end`). Failure is logged to Sentry, not blocking.
   c. Call `service.auth.admin.deleteUser(user_id)` — this cascades through the existing FKs (`profiles.id → auth.users(id) on delete cascade`, `letters.user_id → profiles.id on delete cascade`), removing the profile and all letter rows automatically. This step's success is the one that must not fail for the action to report success — it's the actual "your data is gone" guarantee.
3. On success: client-side signs out (clears the Supabase session) and redirects to the landing page with a toast confirming deletion.

**Error envelope:** same `Result<T>` pattern as the rest of the codebase — if step 2c fails, return `{ ok: false, error: {...} }` with a specific message and a "try again or email us" recovery, matching `lib/CLAUDE.md`'s error-envelope rule.

**Copy needed** (EN/AR/TR): Settings' "Delete account" button label, the confirmation dialog's heading/body/confirmation-input-label/CTA, and the post-deletion toast message.

## 5. Explicitly parked (not built now)

- Impressum: every field needs the operator's real legal name, address, phone, VAT/register status — cannot be filled without that information. Revisit before actively driving traffic (i.e., before or alongside Stage 2's marketing push, not necessarily at a formal "launch" event — flagged once to the user, not re-raised).
- Terms' `[Operator legal name]` and `[VAT ...]` placeholders — same blocker as above.
- Newsletter/Resend-Audience privacy-policy language — ships as part of Stage 2's own plan, once that feature exists.
