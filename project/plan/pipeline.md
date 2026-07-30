# Plan: letter upload + analysis pipeline implementation

Expands `docs/superpowers/specs/pipeline.md`.

1. **Gemini client** — `src/lib/gemini/client.ts`: thin factory around `new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })`.
2. **analysis schema + prompt** — `src/lib/gemini/analyze-letter.ts`: shared `responseSchema` (Type.OBJECT with the 5 required keys), shared system instruction builder (takes target language), `analyzeImage(bytes, mimeType, language)`, `analyzeText(text, language)`.
3. **OCR fallback** — `src/lib/ocr/extract-text.ts`: `createWorker('deu')`, `recognize(buffer)`, `terminate()`, wrapped in `Result<string>`.
4. **upload server action** — `src/app/upload/actions.ts`: trial-limit read (service client) → route by mimetype → pipeline call → storage upload + `letters` insert + `trial_letters_used` increment (service client) → return `Result<{ letterId: string }>`.
5. **upload UI** — `src/app/upload/page.tsx` (Server Component shell, auth check) + `src/app/upload/upload-form.tsx` (client: file input with `capture="environment"` for mobile camera, drag-drop zone, loading animation, inline trial-limit message).
6. **results page** — `src/app/letters/[id]/page.tsx`: fetch by id + verify `user_id` ownership, render summary/deadlines/reply-draft/risk-flags, `dir="rtl"` when `language === 'ar'`.
7. **results states** — `loading.tsx` (skeleton), `not-found.tsx`, `error.tsx` (client boundary, retry via `reset()`).
8. **build check** — `npm run build`.
9. **manual smoke test** — upload a real German-letter-like image through the live app (chrome-devtools), confirm the Gemini call returns structured JSON and the results page renders it; confirm the PDF path via a text-based fixture if a real scanned PDF isn't available.
10. **RTL check** — force a letter row with `language: 'ar'` and screenshot the results page to confirm the `dir="rtl"` container renders correctly.
11. **commit** — `feat: AI analysis pipeline (upload, OCR fallback, Gemini, results page)`.

## self-review (spec coverage)

- Image upload → vision pass, no OCR: step 2, 4. ✓
- PDF upload → Tesseract → text pass: step 3, 4. ✓
- Trial limit enforced server-side: step 4. ✓
- Structured JSON with exact 5 keys: step 2. ✓
- Never surface raw OCR text: step 6 (page only reads summary/deadlines/reply_draft/risk_flags). ✓
- RTL for Arabic: step 6, 10. ✓
- Loading/error/not-found states: step 5, 7. ✓
- No placeholders. ✓
