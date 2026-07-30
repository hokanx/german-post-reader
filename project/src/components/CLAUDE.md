# components/CLAUDE.md — design-system rules

scoped rules for everything under this folder. the root CLAUDE.md north star + BANS still apply; this adds the design-system coding discipline.

## color — semantic tokens ONLY
- every color resolves through the OKLCH semantic tokens in `globals.css`: `bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `text-primary-foreground`, `bg-muted`, `text-muted-foreground`, `bg-accent`, `border-border`, `bg-destructive`.
- NEVER a raw Tailwind color class (`bg-blue-500`, `text-zinc-700`, `from-purple-500`) or a raw hex inside a component. raw values live ONLY in the globals.css token definitions.

## typography
- **Inter is BANNED as a heading font** (it's the #1 generic-AI tell). Inter is fine for BODY text only.
- headings use **Bricolage Grotesque** (the locked direction's heading face). if no direction is locked, pick a heading+Inter pairing by vibe: **Geist+Inter** (precise/tech), **Bricolage Grotesque+Inter** (playful/bold), **Plus Jakarta Sans+Inter** (friendly/rounded), **Source Serif 4+Inter** or **Fraunces+Inter** (editorial/serif), **JetBrains Mono+Inter** (terminal/dev).
- load fonts via `next/font/google` (or `@fontsource/*` for non-Next stacks) — never a raw `<link>` you forget to preconnect. expose them as CSS variables and map to `--font-sans` / `--font-heading`.
- use the type scale from `design-system/MASTER.md`; don't invent ad-hoc sizes.

## icons
- **Lucide only.** never mix icon libraries. no emoji as icons.
- stroke width **1.5px** everywhere (`strokeWidth={1.5}`).
- sizes are `size-4` or `size-5` ONLY (16/20px). no `size-3`, no arbitrary `h-[13px]`.
- an icon-only button MUST have an `aria-label`.

## interaction states (every interactive element)
- hover, focus-visible, active, AND disabled are all styled — none skipped.
- focus ring uses the `--ring` token (`focus-visible:ring-2 focus-visible:ring-ring`), >= 3:1 contrast, never `outline-none` without a replacement ring.
- touch targets >= 44px on mobile.

## motion
- framer-motion per the root BUILD_PROMPT `## motion` section; always gated behind `useReducedMotion()` / `prefers-reduced-motion`.

## toasts (Sonner — the shadcn-native toast)
- **Sonner is the toast system.** add the shadcn Sonner component (`npx shadcn@latest add sonner`) and mount `<Toaster />` once in the root layout. don't hand-roll toasts or pull a second toast lib.
- **`toast.promise()` is the DEFAULT for any async user action** (save, delete, submit, upload): it shows loading → success/error in one call, e.g. `toast.promise(saveThing(), { loading: 'Saving…', success: 'Saved', error: (e) => e.message })`. the error branch shows the SPECIFIC message from the lib error envelope — never a generic string.
- toasts are confirmations, not the primary error UI for a whole view (that's `ErrorState`). style them with semantic tokens.

## required state components
- build reusable `Skeleton`, `EmptyState`, and `ErrorState` components here. every data view composes them (see `app/CLAUDE.md`). an `EmptyState` always takes a reason + a CTA; an `ErrorState` always takes a specific message + a retry action.

## structure
- compose shadcn / shadcnblocks-skill blocks per the page brief in `design-system/pages/<page>.md`. don't freestyle layout. one component = one responsibility.
