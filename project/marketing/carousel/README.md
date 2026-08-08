# Jobcenter carousel — social assets

Top-of-funnel Instagram/LinkedIn carousel (8 slides, 1080×1350, 4:5) built from
the "Confronto & Solução / Mirror & Path" copy brief, anchored on the fear of a
Jobcenter letter. Rendered images live in `../../public/marketing/carousel/`
(`card-1.png` … `card-8.png`, plus `contact-sheet.png` for a quick overview).

## The slides

1. **The moment** — you got a Jobcenter letter, and it just sits there.
2. **You already tried** — Google Translate gives words, not meaning.
3. **Written in code** — bureaucratic German even natives struggle with.
4. **What actually matters** — the do / deadline / consequence buried inside.
5. **The stakes** — a missed deadline can warn you, pause benefits, start a process.
6. **The real enemy** — not German, the *gap* between what it says and what it means.
7. **The fix** — Papkram: summary, flagged deadline, ready-to-send German reply.
8. **CTA** — the next letter doesn't have to feel like that. Try Papkram free.

## Design

Locked Playful/Bold system (`design-system/MASTER.md`): Bricolage Grotesque
headings, Inter body, cream `#fff7ed` / purple `#7c3aed` / orange `#fb923c`,
hard 2–3px borders with hard-offset shadows, pill-uppercase kicker chips, and
one sticker ornament per slide. No purple hero gradients, no testimonial
carousel patterns, no icon-grid feature sections — icons are lucide only.

The color journey tracks the narrative: cream (dread/diagnosis) → ink slide 3
(the "code") → purple slide 6 (reframe) → bright product reveal slide 7 →
purple CTA slide 8.

## Regenerating

Fonts are embedded as base64 in `fonts.css` so the render is fully
self-contained (no network, no layout shift). To change copy or design, edit
`build-carousel.mjs` (the slide data + CSS), then:

```
node build-carousel.mjs   # -> carousel.html
node render.mjs           # -> ../../public/marketing/carousel/card-*.png
```

`render.mjs` drives headless Chromium via Playwright and screenshots each
`.slide` element at its native 1080×1350. Pass an output directory as the first
arg to render elsewhere. `carousel.html` is the committed, ready-to-open preview
of all 8 slides.
