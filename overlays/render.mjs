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
    document.fonts.load('900 176px Fraunces'),
    document.fonts.load('700 33px Fraunces'),
    document.fonts.load('600 26px Archivo'),
    document.fonts.load('500 38px Archivo'),
    document.fonts.load('400 40px Archivo'),
    document.fonts.load('700 32px Archivo'),
  ]);
  await document.fonts.ready;
});

const fraunces = await page.evaluate(() => document.fonts.check('900 176px Fraunces'));
const archivo = await page.evaluate(() => document.fonts.check('600 26px Archivo'));
if (!fraunces || !archivo) {
  console.warn(`! webfont missing (Fraunces=${fraunces} Archivo=${archivo}) — cards will render in a fallback face`);
}

const cards = await page.evaluate(() => window.BASE.map((c) => c.id));
const formats = await page.evaluate(() => Object.keys(window.FORMATS));

let written = 0;
for (const id of cards) {
  for (const fmt of formats) {
    const dataUrl = await page.evaluate(
      ([cardId, fmtKey]) => {
        const card = window.BASE.find((c) => c.id === cardId);
        const fm = window.FORMATS[fmtKey];
        const cv = document.createElement('canvas');
        cv.width = fm.w;
        cv.height = fm.h;
        window.drawCard(cv.getContext('2d'), card, fm);
        return cv.toDataURL('image/png');
      },
      [id, fmt],
    );
    const file = resolve(outDir, `marino-${id}-${fmt}.png`);
    await writeFile(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
    written++;
  }
}

await browser.close();
console.log(`rendered ${written} PNGs to ${outDir}`);
