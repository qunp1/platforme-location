// Manual, one-public-page reference capture. Never collects scripts or network requests.
import { mkdirSync } from 'node:fs';
import { Browser } from '../.agents/skills/taste-skill/scripts/lib/cdp.mjs';
const [url, name] = process.argv.slice(2);
if (!url?.startsWith('https://') || !/^[a-z0-9-]+$/.test(name || '')) throw new Error('Provide a public HTTPS URL and simple capture name.');
mkdirSync('replica/screens', { recursive: true });
const browser = await Browser.launch();
try {
  const page = await browser.newPage({ width: 1440, height: 1000 });
  await page.goto(url, { settleMs: 2000 });
  // This exact non-binding cookie choice was observed on the public MarHire page.
  if (new URL(url).hostname === 'marhire.com') {
    await page.eval(() => [...document.querySelectorAll('button')].find(button => button.innerText.trim() === 'Reject')?.click());
  }
  console.log(await page.eval(() => ({ title: document.title, url: location.href, headings: [...document.querySelectorAll('h1,h2')].slice(0, 8).map(e => e.innerText) })));
  await page.screenshot({ path: `replica/screens/${name}-desktop.jpg` });
  await page.setViewport({ width: 390, height: 844, mobile: true });
  await page.screenshot({ path: `replica/screens/${name}-mobile.jpg` });
} finally { await browser.close(); }
