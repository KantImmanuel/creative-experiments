import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = `file://${path.join(dir, 'index.html')}`;
const outDir = path.join(dir, 'mockups');

const stateMap = [
  ['pre-market', 'pre-market.png'],
  ['live', 'live.png'],
  ['settling', 'settling.png'],
  ['result-green', 'result-green.png'],
  ['result-red', 'result-red.png'],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(htmlPath, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

for (const [state, filename] of stateMap) {
  await page.click(`.state-switcher button[data-state="${state}"]`);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, filename), fullPage: false });
  console.log(`✓ ${filename}`);
}

await browser.close();
console.log('Done!');
