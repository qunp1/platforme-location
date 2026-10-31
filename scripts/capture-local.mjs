import { mkdirSync } from 'node:fs';
import { Browser } from '../.agents/skills/taste-skill/scripts/lib/cdp.mjs';
const [path = '/design', label = 'design'] = process.argv.slice(2);
const browser = await Browser.launch();
mkdirSync('replica/clone-screens', { recursive: true });
try {
  const page = await browser.newPage({ width: 1440, height: 1000 });
  await page.goto(`http://127.0.0.1:5173${path}`);
  await page.screenshot({path:`replica/clone-screens/${label}-desktop.png`,format:'png',fullPage:true});
  await page.setViewport({ width:390,height:844,mobile:true });
  await page.screenshot({path:`replica/clone-screens/${label}-mobile.png`,format:'png',fullPage:true});
  console.log(JSON.stringify({errors:page.consoleErrors,title:await page.eval(()=>document.title)}));
} finally { await browser.close(); }
