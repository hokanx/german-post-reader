---
description: anti-slop visual loop on the current page
---

run the visual quality loop on the page currently open in the dev server (or the page named in $ARGUMENTS if provided):

1. if the dev server isn't running, start it yourself via Bash. (terminal rule — never ask the user to run `npm run dev`.)
2. **screenshot the page in ALL THREE forced states** (a data view is not done until all three are verified), each at 375px AND 1440px via chrome-devtools-mcp:
   - **empty** — force zero data (point the view at an empty dataset, or temporarily return `[]` from the data fn). save `artifacts/review/<page>-empty.png`.
   - **loading** — force the loading UI (delay the fetch, or render the `loading.tsx`/skeleton directly). save `artifacts/review/<page>-loading.png`.
   - **error** — force a failure (make the data fn return the error envelope / throw). confirm the `error.tsx` / `ErrorState` shows a SPECIFIC cause + recovery, never "Something went wrong". save `artifacts/review/<page>-error.png`.
   then restore the normal data path and screenshot the **populated** state (rendering the real Faker seed data) → `artifacts/review/<page>.png`.
3. **taste pass** — invoke ui-ux-pro-max in review mode on ALL the screenshots (all three states + populated). ask specifically for findings in its §1-§3 categories: accessibility (CRITICAL), touch + interaction (CRITICAL), performance + layout (HIGH). if SPEC.md has a design direction locked, compare to its tokens — flag any drift from the chosen fonts, palette, radius, or density. compare to `docs/design-refs/` images and to `artifacts/golden.png` if present.
4. **correctness pass** — invoke the **web-design-guidelines** skill on the screenshots (a11y / focus rings / tap targets / contrast / semantic HTML / layout shift). anything CRITICAL is a fix-before-done blocker.
5. for every CRITICAL finding from any pass, fix the underlying code. show the user the diff before committing.
6. re-screenshot. if a `design-system/pages/<page>.md` exists, compare the rendered page to the layout brief and call out divergences.
7. repeat 2-6 until ui-ux-pro-max AND web-design-guidelines give ALL THREE states + the populated state a clean bill. then run `/design-review <page>` as the final blocking gate.

slop checklist — verify each before declaring done:
- lucide icons only (no emoji icons)
- touch targets >= 44pt on mobile
- text contrast >= 4.5:1 for body, >= 3:1 for large
- focus-visible rings on every interactive element (2-4px, >=3:1 against bg)
- body text >= 16px on mobile (no `text-[10px]`/`text-[11px]` for content)
- one primary CTA per screen
- one icon set + one stroke width
- semantic color tokens (no raw hex in components)
- if dark mode: contrast verified independently for both themes
- if SPEC.md has a design direction: fonts and palette match its tokens exactly
