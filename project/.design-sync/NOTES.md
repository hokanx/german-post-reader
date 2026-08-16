# design-sync notes — Papkram

Repo-specific gotchas for future syncs. Config lives in `.design-sync/config.json`;
run everything from `project/` (the package dir), not the git root.

## Shape: this is an app, not a library

- Papkram is a Next.js app (`"private": true`, no `dist/`, no package `exports`).
  There is no build that emits a component library, so **`cfg.entry` points at a
  hand-written barrel**, `.design-sync/entry.ts`, which re-exports the UI
  primitives. Adding a component to the design system means adding it to that
  barrel **and** to `cfg.componentSrcMap`.
- `cfg.componentSrcMap` is a **full enumeration here, not a sparse override**.
  That is deliberate: with no `.d.ts` tree, `exportedNames()` returns nothing, so
  the map is the only thing that defines the component list. Do not "clean it up"
  into a sparse map — the sync would discover zero components.
- Scope was set with the user on the first sync: **UI primitives only**. Everything
  in `src/components/` outside `ui/` is wired to Next routing, Supabase, server
  actions, or i18n context and will not render standalone. Do not add them
  without re-checking that decision.
- `cfg.pkg` is `"papkram"` even though `package.json` says `"project"`. Previews
  import from `"papkram"`; the converter's import policy rewrites that to
  `window.Papkram` without ever hitting node resolution, so no `node_modules`
  entry is needed.

## CSS: must be compiled before every build

The components are Tailwind v4 utility classes, so the bundle needs **compiled**
CSS, not `globals.css` source. `.design-sync/compile-css.mjs` runs the project's
own PostCSS + `@tailwindcss/postcss` (same version as `next build`) over
`.design-sync/ds-styles.css` into `.design-sync/.cache/ds-compiled.css`, which is
what `cfg.cssEntry` points at.

**Always run the compile step before `package-build.mjs`:**

```sh
node .design-sync/compile-css.mjs .design-sync/ds-styles.css .design-sync/.cache/ds-compiled.css
```

`ds-styles.css` imports the app's real `globals.css` (tokens stay single-sourced)
and then widens coverage two ways: `@source "../src"` picks up every utility the
app itself uses, and a block of `@source inline(...)` safelists the semantic
colour/radius/type/layout families so the **design agent** can write classes the
app does not use yet. If the agent's generated designs ever come out unstyled in
a particular utility family, widen that safelist and re-sync.

## Fonts

The app loads fonts via `@fontsource/*` CSS imports in `layout.tsx` (not
`next/font`), which is lucky — those ship real `@font-face` + woff2, so
`cfg.extraFonts` points straight at the nine stylesheets and 99 font files ship
with the bundle. If someone migrates `layout.tsx` back to `next/font/google`,
`extraFonts` must keep pointing at the `@fontsource` packages or every design
renders in a fallback font.

## Overlays and card presentation

- Every `Dialog*` component and `Toaster` needs
  `cfg.overrides.<Name>.cardMode = "single"` plus an explicit `viewport` — they
  portal to the body and use `position: fixed`, so in a normal grid cell they
  escape or collapse.
- Dialog viewports are **700px wide on purpose**: the dialog footer is
  `flex-col-reverse sm:flex-row`, so anything under 640px shows the buttons
  stacked, which is not the layout the component is designed around.
- `Button`, the whole `Card` family, `Input`, `Label` and `Skeleton` use
  `cardMode: "column"`. In the default grid their `max-w-sm` compositions were
  clipped at the right edge of the card.
- An unportalled `<DialogOverlay />` collapses to a thin strip. Wrap it in
  `<DialogPortal>` (which is what `DialogContent` does internally).

## Known render warns

Checked against on every re-sync — a warn **not** listed here is new.

- `[RENDER_THIN] components/general/Toaster/Toaster.html: rendered height is 0px`
  — **benign**. Sonner renders its toasts `position: fixed`, so the mount root
  measures zero even though the toasts are visible. Confirmed in
  `_screenshots/review/general__Toaster.png`.

## Real bugs this sync surfaced in the app (both FIXED)

Two genuine app defects were found while verifying previews. Both were fixed in
`src/` during the first sync and re-verified from the fresh sheets.

1. **Toasts had square corners.** `src/components/ui/sonner.tsx` set
   `"--border-radius": "var(--radius)"`, but `globals.css` only ever defines
   `--radius-sm` / `--radius-md` / `--radius-lg` — bare `--radius` does not
   exist, so the radius resolved to nothing. Fixed by pointing it at
   `var(--radius-md)` (22px, the locked `radius.md` step).
2. **A long `DialogTitle` ran underneath the floating close button.**
   `DialogContent`'s close button is `absolute top-2 right-2` with no room
   reserved for it. Fixed in `dialog.tsx`: when `showCloseButton` is on, the
   popup adds `[&_[data-slot=dialog-title]]:pr-6`, so long titles wrap clear of
   the button. The `Longer` cell of `.design-sync/previews/DialogTitle.tsx` is
   the regression case — keep it long enough to reach the popup's right edge.

## Re-sync risks — what can go stale

- **`.design-sync/entry.ts` and `cfg.componentSrcMap` are hand-maintained.** A
  component added to `src/components/ui/` will be silently missing from the
  design system until both are updated. There is no discovery to catch it.
- **The `@source inline(...)` safelist in `ds-styles.css` is a guess about what
  the design agent will write.** It is not derived from anything, so it cannot
  go "wrong" — it can only be too narrow. Symptom: unstyled output in the
  generated designs.
- **The two fixes above are load-bearing for two preview cells.** If someone
  reverts the `sonner.tsx` radius or the `dialog.tsx` title padding, the Toaster
  and `DialogTitle/Longer` cards regress visibly — they are the regression
  tests. Do not "simplify" the `showCloseButton && …` line out of `dialog.tsx`.
- **`@base-ui/react` is pre-1.0-ish and the `Dialog` previews depend on
  `<Dialog open>` rendering statically.** If a version bump changes the open/portal
  behaviour, every Dialog card is affected at once.
- Playwright's chromium was already cached at build 1234, matching the repo's
  pinned `playwright-core` 1.62.0 — no browser download was needed. A playwright
  bump may require one.
