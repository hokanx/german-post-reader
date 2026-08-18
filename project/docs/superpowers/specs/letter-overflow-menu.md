# Design: letter overflow menu (view original + share summary)

Per SPEC.md mvp scope: "The letter-detail page has a small overflow ("•••") menu with two actions — viewing the original uploaded letter (image or PDF), and copying/exporting a ready-to-send plain-text summary of the letter branded with a Papkram signature line — works."

## approach

A small `Popover`-based menu (same primitive `LetterFilters` and the deadlines calendar already use — no new dropdown-menu component needed) triggered by a `MoreHorizontal` icon button in the letter-detail page's header row, next to the existing "analysis complete" / "action required" badges.

### view uploaded letter

The `letters` storage bucket is private (RLS: read restricted to the owner's folder — see `supabase/migrations/0001_init.sql`), and nothing in the app currently serves the uploaded file back to the browser. New server action `getOriginalLetterUrl(letterId)` in `letters/[id]/actions.ts`:

- Same ownership-check shape as every other action in this file: authenticate, then `.from("letters").select("storage_path").eq("id", letterId).eq("user_id", user.id).single()`.
- Calls `supabase.storage.from("letters").createSignedUrl(storage_path, 60)` using the **RLS-scoped client** (not service role) — `createSignedUrl` itself is permission-checked against the caller's JWT under Supabase Storage RLS, so this is already correctly scoped to the owner without needing to bypass RLS. 60-second expiry: long enough for the browser to open and load the file once, short enough that the URL isn't useful if it leaked (e.g. via referrer, browser history).
- Returns the signed URL in the `Result` envelope. The client opens it with `window.open(url, "_blank", "noopener,noreferrer")` — the browser's native image/PDF viewer handles rendering from the `Content-Type` Supabase Storage already serves (set from the upload's declared, magic-byte-verified content type — see `upload/actions.ts`), so no client-side image-vs-PDF branching or custom viewer UI is needed.

### share summary

Pure helper `src/lib/letters/build-share-summary.ts`, `buildShareSummary(letter, copy): string` — assembles a plain-text block from data **already on the page** (no new fetch): sender name + category, summary, payments, appointments, deadlines, key facts, each section only included if non-empty, reusing the page's existing section-heading copy (`copy.paymentsHeading` etc. — no duplicate heading strings). Ends with a branded signature line (new copy key `summaryWatermark`, e.g. "— Summarized by Papkram · papkram.de", not translated for the brand name/URL part, matching how `sender_name` and `reply_draft`'s German stay unlocalized elsewhere).

New client component `letters/[id]/letter-menu.tsx` wires both actions:
- "Share summary" calls `navigator.share({ text })` when available (native share sheet — mobile-first, matches "ready to send"/"share" language in the request), falling back to `navigator.clipboard.writeText(text)` + toast when `navigator.share` doesn't exist. `AbortError` from a user-cancelled share sheet is swallowed silently (not an error). Reuses the existing `copy.copiedToast` / `copy.copyFailedToast` keys `CopyReplyButton` already has — no duplicate toast copy.
- "View uploaded letter" calls the new server action, opens the returned URL in a new tab, shows a new `openOriginalFailedToast` on failure.

## new copy keys (`letters` namespace, EN/AR/TR)

`moreOptions` (menu trigger aria-label), `viewOriginalLetter`, `shareSummary`, `openOriginalFailedToast`, `summaryWatermark`.

## edge cases

- Storage fetch failure (deleted object, transient error) → `Result` error surfaced via toast, no crash.
- Letters with none of payments/appointments/deadlines/key_facts present → summary text is just sender + summary + watermark, never an empty/broken block.
- RTL languages: the shared text itself needs no special handling (plain text, not laid out), same as how `reply_draft` copy already works today.
