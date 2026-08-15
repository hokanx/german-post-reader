# Brand assets

Pre-rendered PNGs generated from the source SVGs in the Papkram Brand Kit
(`Papkram-Brand-Kit/assets/papkram-icon.svg` and `papkram-appicon-store.svg`),
rasterized once at build-relevant sizes rather than re-rendered per request.

- `icon.png` — from `papkram-icon.svg` (rounded square, own margin/shadow) — used by `src/app/icon.tsx` (browser tab favicon).
- `apple-icon.png` — from `papkram-appicon-store.svg` (full-bleed — iOS applies its own corner mask) — used by `src/app/apple-icon.tsx` and `public/icon-192.png` / `public/icon-512.png` (PWA manifest icons).

Regenerate if the source SVGs change:

```
node -e "
const sharp = require('sharp');
sharp('path/to/papkram-icon.svg', { density: 384 }).resize(32, 32).png().toFile('src/brand-assets/icon.png');
sharp('path/to/papkram-appicon-store.svg', { density: 384 }).resize(180, 180).png().toFile('src/brand-assets/apple-icon.png');
"
```
