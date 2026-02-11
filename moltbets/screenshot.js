const puppeteer = require('puppeteer');
const path = require('path');
const delay = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });
  
  const filePath = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await delay(1000);

  const states = ['pre-market', 'live', 'settling', 'result-green', 'result-red'];
  const names = ['pre-market', 'live', 'settling', 'result-green', 'result-red'];

  for (let i = 0; i < states.length; i++) {
    await page.click(`button[data-state="${states[i]}"]`);
    await delay(500);
    await page.screenshot({ path: path.join(__dirname, 'mockups', `${names[i]}.png`), fullPage: false });
    console.log(`✓ ${names[i]}.png`);
  }

  await browser.close();
  console.log('Done!');
})();
