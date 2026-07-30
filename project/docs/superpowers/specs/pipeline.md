# Design: letter upload + analysis pipeline

Source: SPEC.md key user flow #2, mvp scope "OCR extraction + AI analysis pipeline", CLAUDE.md AI pipeline rules. Implements BUILD_PROMPT.md step 03. **Provider note:** the user swapped the locked AI provider from OpenAI GPT-4o to Google Gemini (`gemini-flash-latest`, via `@google/genai`) for its free tier — same role in the pipeline (vision + text, structured JSON out). SPEC.md/CLAUDE.md were updated to match.

## flow

1. User is on `/upload` (protected by `proxy.ts`). Drops or picks a file (JPEG/PNG/PDF) or captures a photo (mobile camera input).
2. Client uploads the raw bytes to the `uploadLetter` server action as `FormData`.
3. Server action, in order:
   a. Reads `subscription_status` and `trial_letters_used` from `profiles` via the **service-role** client (never trust a client-supplied count). If `subscription_status === 'trialing'` and `trial_letters_used >= 3`, return `{ ok: false, error: { code: 'TRIAL_LIMIT_REACHED', ... } }` immediately — no upload, no Gemini call.
   b. **Implementation correction (discovered during build):** the original design routed PDFs through Tesseract.js for text extraction first. Tesseract/Leptonica cannot decode PDF containers at all — it errors with "Pdf reading is not supported" (confirmed live: `Error in pixReadStream: Pdf reading is not supported`). Since Gemini has native PDF document understanding, both images (`image/jpeg`, `image/png`) AND PDFs (`application/pdf`) now go through the same path: base64-encode the bytes and send directly to Gemini as inline document/vision data via `analyzeDocument()`. Tesseract.js was removed from the dependency tree entirely (dead code otherwise); CLAUDE.md's stack section was updated to match.
   c. Gemini call uses `responseMimeType: 'application/json'` + `responseSchema` enforcing the exact five keys CLAUDE.md requires: `summary`, `deadlines` ({date, description}[]), `reply_draft`, `detected_language_confirmed`, `risk_flags` (string[]). The system instruction tells Gemini the user's chosen language and to flag (not guess) ambiguous amounts/dates into `risk_flags`.
   d. On any Gemini failure: catch, log (`console.error`; routes to Sentry once step 06 wires it in), return `{ ok: false, error: { code: 'ANALYSIS_FAILED', message: 'Analysis failed — try again.' } }`. Never insert a partial row.
   f. On success: upload the original file to the `letters` storage bucket at `{user_id}/{letter_id}`, insert the `letters` row (summary, deadlines, reply_draft, risk_flags, language, storage_path), increment `profiles.trial_letters_used` by 1 — all via the service-role client in one pass (the anon/RLS client can't write `trial_letters_used`, and letters writes are already covered by RLS but service-role keeps this one action's writes atomic-ish without juggling two clients).
4. Client redirects to `/letters/[id]`.
5. `/letters/[id]` is a Server Component: fetches the letter row (service-role client — the row read is already scoped to the requesting session via the page's own auth check, mirroring the pattern in `/dashboard`), renders summary, deadline chips, reply draft, risk flags. If `language === 'ar'`, the analysis content container gets `dir="rtl"`.
6. Loading state: the upload page shows a branded loading animation (spring, `useReducedMotion`-gated) with copy in the user's language once the action is in flight past ~3s (per CLAUDE.md: any wait over 25s must show progress copy, never a blank screen — in practice Gemini Flash responses land well under that, so a single persistent loading state covers both cases without needing a fake progress bar).

## never surface raw OCR text

`raw_ocr_text` is stored on the `letters` row (nullable, image uploads leave it null since there's no separate OCR step for those) but never rendered — CLAUDE.md is explicit: "Never surface raw OCR output to the user." The results page only reads `summary`, `deadlines`, `reply_draft`, `risk_flags`.

## why the trial-limit check and the write both use the service-role client

RLS lets a user insert only their own `letters` rows and nothing on `profiles` (see `plan/database.md` — no insert/update-from-client policy on `trial_letters_used`). The upload server action is the one place server-side that both reads the authoritative trial state and increments it; using the RLS client here would either fail (no update policy) or, if a policy were added to make it work, would reopen the exact "never trust client counts" hole CLAUDE.md warns about. Service-role, used only inside this one server action, is the correct boundary.

## files

| file | responsibility |
|---|---|
| `src/lib/gemini/client.ts` | constructs the `GoogleGenAI` client from `env.GEMINI_API_KEY`. |
| `src/lib/gemini/analyze-letter.ts` | `analyzeDocument(bytes, mimeType, language)` — returns `Result<LetterAnalysis>`, handles images and PDFs identically. |
| `src/app/upload/actions.ts` | `uploadLetter(formData)` — trial-limit check, calls the pipeline, writes storage + `letters` + `profiles`. |
| `src/app/upload/page.tsx` | drag-drop + camera-capture upload UI. |
| `src/app/upload/upload-form.tsx` | client component: file picker, upload progress/loading state, redirect on success, `TRIAL_LIMIT_REACHED` → renders `PaywallModal` (built in step 05; this step renders a plain inline message as a placeholder trigger point so the upload flow isn't blocked on billing). |
| `src/app/letters/[id]/page.tsx` | Server Component results page — summary, deadlines, reply draft, risk flags, RTL-aware. |
| `src/app/letters/[id]/loading.tsx` | skeleton matching the results layout. |
| `src/app/letters/[id]/not-found.tsx` | shown when the letter id doesn't exist or isn't the caller's. |
| `src/app/letters/[id]/error.tsx` | client error boundary with retry. |

## redirect targets / ambiguity SPEC.md left open

SPEC.md doesn't say what happens to `/upload` when `TRIAL_LIMIT_REACHED` before Stripe exists (step 05). Decision: this step renders an inline "you've used your 3 free letters" message with a disabled-looking CTA; step 05 replaces it with the real `PaywallModal` + working "Subscribe Now" button. This keeps step 03 shippable without back-filling billing code early.
