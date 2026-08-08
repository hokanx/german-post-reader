import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = process.argv[2] || path.resolve(__dirname, '../../public/marketing/carousel');
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ args: ['--no-sandbox', '--force-color-profile=srgb'] });
const page = await browser.newPage({ deviceScaleFactor: 1 });
await page.goto('file://' + path.join(__dirname, 'carousel.html'), { waitUntil: 'load' });
await page.evaluate(async () => { await document.fonts.ready; });
await page.waitForTimeout(300);

const slides = await page.$$('.slide');
console.log('found', slides.length, 'slides');
for (let i = 0; i < slides.length; i++) {
  const f = path.join(OUT, `card-${i + 1}.png`);
  await slides[i].screenshot({ path: f });
  console.log('  wrote', path.basename(f));
}
await browser.close();
console.log('done ->', OUT);
