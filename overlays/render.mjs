/**
 * Batch-renders every overlay card to a transparent PNG, in both frame sizes.
 *
 * Runs the exact same canvas code the studio uses, loaded from studio.html, so a
 * file written here is pixel-identical to what the browser preview shows.
 *
 *   npm install playwright && node overlays/render.mjs
 */
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, 'out');
await mkdir(outDir, { recursive: true });

// The container ships a pinned Chromium; the npm package's own build number may
// differ, so point at the binary that is actually on disk when it exists.
const PINNED = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch(
  existsSync(PINNED) ? { executablePath: PINNED } : {},
);
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

page.on('pageerror', (e) => console.error('  page error:', e.message));

await page.goto(pathToFileURL(resolve(here, 'studio.html')).href, { waitUntil: 'load' });

// Webfonts must be resolved before anything touches the canvas, or Chromium
// silently falls back to Times and every measurement shifts.
await page.evaluate(async () => {
  await Promise.all([
    document.fonts.load('400 31px Roboto'),
    document.fonts.load('500 27px Roboto'),
    document.fonts.load('700 40px Roboto'),
    document.fonts.load('400 29px Inter'),
    document.fonts.load('600 30px Inter'),
    document.fonts.load('700 42px "Source Sans 3"'),
    document.fonts.load('400 28px "Source Sans 3"'),
  ]);
  await document.fonts.ready;
});

const seen = await page.evaluate(() => ({
  roboto: document.fonts.check('400 31px Roboto'),
  inter: document.fonts.check('400 29px Inter'),
  source: document.fonts.check('400 28px "Source Sans 3"'),
}));
if (!seen.roboto || !seen.inter || !seen.source) {
  console.warn('! webfont missing — cards will render in a fallback face', seen);
}

const cards = await page.evaluate(() => window.BASE.map((c) => c.id));
const themes = await page.evaluate(() => window.THEMES);

let written = 0;
for (const id of cards) {
  for (const theme of themes) {
    const dataUrl = await page.evaluate(
      ([cardId, th]) => {
        const card = window.BASE.find((c) => c.id === cardId);
        return window.renderCard(card, th).toDataURL('image/png');
      },
      [id, theme],
    );
    const file = resolve(outDir, `marino-${id}-${theme}.png`);
    await writeFile(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
    written++;
  }
}

await browser.close();
console.log(`rendered ${written} PNGs to ${outDir}`);
