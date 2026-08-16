// Compiles .design-sync/ds-styles.css with the project's OWN Tailwind v4
// toolchain (same version, same plugin as next dev/build), so the stylesheet
// the design system ships is byte-for-byte the pipeline the app uses.
//
// Usage: node .design-sync/compile-css.mjs <input.css> <output.css>
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';

const input = resolve(process.argv[2]);
const output = resolve(process.argv[3]);

const result = await postcss([tailwind()]).process(readFileSync(input, 'utf8'), {
  from: input,
  to: output,
});

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, result.css);
console.log(`wrote ${output} — ${(result.css.length / 1024).toFixed(1)} KB`);
