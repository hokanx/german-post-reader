## How to build with Papkram

Papkram reads German bureaucratic mail for people who don't speak German. The
voice is **calm and clinical, reassuring** — never chirpy, never salesy. Every
button label, empty state, and error message should sound like a competent
person explaining something, not like marketing.

### Setup — no provider needed

There is **no theme provider or context wrapper**. Link `styles.css` and render
components directly; they read their colours from CSS custom properties defined
on `:root`.

Dark mode is a **`.dark` class on an ancestor** (there is no media-query
fallback). To render dark, put `class="dark"` on a wrapping element:

```jsx
const { Card, CardHeader, CardTitle, Button } = window.Papkram;

<div className="dark bg-background text-foreground p-6">
  <Card className="max-w-sm">
    <CardHeader><CardTitle>Rundfunkbeitrag</CardTitle></CardHeader>
  </Card>
</div>
```

Give the page itself `bg-background text-foreground` — the components style
themselves but not the surface behind them.

### Styling idiom: Tailwind v4 utilities, semantic tokens only

Style your own layout with Tailwind utility classes. **Never use raw palette
classes** (`bg-purple-600`, `text-zinc-700`) or hex values, and never write
gradients — every colour must resolve through a semantic token. This is a hard
project rule, not a preference.

| Role | Utilities |
|---|---|
| Page surface | `bg-background` `text-foreground` |
| Raised surface | `bg-card` `text-card-foreground` · `bg-popover` `text-popover-foreground` |
| Brand / primary action | `bg-primary` `text-primary-foreground` |
| Amber secondary | `bg-secondary` `text-secondary-foreground` |
| Quiet fills, helper text | `bg-muted` `text-muted-foreground` |
| Orange accent | `bg-accent` `text-accent-foreground` |
| Errors, destructive | `bg-destructive` `text-destructive` `text-destructive-foreground` |
| Edges & focus | `border-border` `border-input` `ring-ring` |

Alpha steps work on all of them (`bg-primary/10`, `ring-foreground/10`).

**Never put white text on `accent`** — it measures 2.26:1 and fails contrast.
`accent-foreground` is the dark ink and is the only correct pairing.

**Type:** `font-heading` is Bricolage Grotesque — use it for every heading, at
heavy weight and tight tracking (`font-extrabold tracking-[-0.02em]`).
`font-sans` (Inter) is body text only. `font-mono` (JetBrains Mono) is for
reference numbers, amounts, and anything transcribed from a letter.

**Radius is chunky and non-negotiable:** `rounded-lg` (36px) for buttons and
inputs, `rounded-xl` (40px) for cards and popups. Never square corners.

### House rules — these read as broken brand

Do not produce: Inter as a heading font; purple or blue hero gradients; a
default-gray palette; testimonial carousels; three-column link footers; or
icon-grid "feature" sections. Saturated, slightly clashing colour is
intentional here — do not mute it. Borders are hard and visible, shadows are
hard-offset (never soft blur only), and status chips are all-caps pills.

### Where the truth lives

Read the real files before styling — they beat this summary:

- `styles.css` and its imports (`_ds_bundle.css`, `fonts/fonts.css`) — every
  token definition and every utility that exists.
- `components/<group>/<Name>/<Name>.prompt.md` — usage and examples per
  component; `<Name>.d.ts` — the exact prop types.

### Composition notes

`Button` takes `variant` (`default` `outline` `secondary` `ghost` `destructive`
`link`) and `size` (`default` `xs` `sm` `lg` `icon` `icon-xs` `icon-sm`
`icon-lg`). `Card` takes `size` (`default` `sm`).

`DialogTrigger` and `DialogClose` are headless — give them a shape with
`render`, e.g. `<DialogClose render={<Button variant="outline" />}>Keep it</DialogClose>`.
`DialogContent` portals and draws its own overlay, so you do not need
`DialogPortal` or `DialogOverlay` unless composing by hand. `DialogContent` and
`DialogFooter` both accept `showCloseButton`.

Toasts are fired imperatively via `toast(...)`; render `<Toaster />` once.
