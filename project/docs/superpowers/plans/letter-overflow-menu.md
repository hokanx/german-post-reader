# Plan: letter overflow menu (view original + share summary)

Implements the design at `docs/superpowers/specs/letter-overflow-menu.md`.

## tasks

1. **copy** — add `moreOptions`, `viewOriginalLetter`, `shareSummary`, `openOriginalFailedToast`, `summaryWatermark` to the `letters` block in `src/lib/i18n/copy.ts` for EN, AR, TR, plus matching type entries.
2. **`build-share-summary.ts`** — pure function `buildShareSummary(letter: {...}, copy: {...}): string` under `src/lib/letters/`. Sections included only when their array is non-empty: sender line, summary, payments, appointments, deadlines, key facts, then the watermark line. Add `build-share-summary.test.ts` (hand-rolled assert style, matching siblings): full letter with every section, minimal letter with none, watermark always present.
3. **`getOriginalLetterUrl` server action** — add to `letters/[id]/actions.ts`: auth check, fetch `storage_path` scoped to `.eq("id", letterId).eq("user_id", user.id)`, `createSignedUrl(storage_path, 60)` via the RLS-scoped client, return `Result<{ url: string }>`.
4. **`letter-menu.tsx`** — new client component: `MoreHorizontal` icon-button `PopoverTrigger` (`aria-label={copy.moreOptions}`, 44px touch target), `PopoverContent` with two buttons:
   - "View uploaded letter" (icon: `ExternalLink` or `FileText`) → calls the server action, `window.open(url, "_blank", "noopener,noreferrer")` on success, `toast.error(copy.openOriginalFailedToast)` on failure.
   - "Share summary" (icon: `Share2`) → builds the text via `buildShareSummary`, tries `navigator.share`, falls back to `navigator.clipboard.writeText` + `toast.success(copy.copiedToast)` (reusing the existing key), catches `AbortError` silently, `toast.error(copy.copyFailedToast)` on other failures.
5. **wire into `page.tsx`** — render `<LetterMenu .../>` in the header row next to the existing badges, passing the letter fields `buildShareSummary` needs (already fetched by the page's existing query — no new columns) plus `letterId` and `language`/copy.
6. **verify** — start dev server, log in as the demo account, open a letter, exercise both menu actions: confirm the signed URL opens the original file in a new tab, confirm the share/copy text is well-formed (screenshot or print the clipboard content), confirm behavior on a letter with zero payments/appointments/deadlines/key_facts (sections correctly omitted, no empty headings). Screenshot the menu at 375px and 1440px, confirm 44px touch target and focus-visible ring, confirm Arabic RTL popover layout (`dir` on `PopoverContent`, matching `LetterFilters`). Run `npx tsc --noEmit`.
7. **commit** — `feat: letter overflow menu — view original letter + share/export summary`.

## notes

- No new DB columns or migrations — `storage_path` already exists on `letters` (migration 0001); the summary text is built entirely from columns the page already fetches.
- Signed URL is generated fresh on each click (not cached), consistent with its short 60s expiry.
