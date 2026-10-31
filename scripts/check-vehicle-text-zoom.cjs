const { chromium } = require('@playwright/test');
(async () => {
  const b = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const c = await b.newContext({ viewport: { width: 320, height: 700 } });
  const p = await c.newPage();
  const results = [];
  for (const query of ['location=office', 'location=airport&start=2027-01-04&end=2027-01-11']) {
    await p.goto('http://127.0.0.1:4173/cars/sandero?' + query);
    await p.locator('.mobile-quote-bar').waitFor();
    await p.addStyleTag({ content: 'html{font-size:200%}' });
    const bar = await p.locator('.mobile-quote-bar').boundingBox();
    const btn = await p.locator('.mobile-quote-bar .button').boundingBox();
    results.push({
      query,
      barHeight: bar.height,
      buttonWithin: btn.x >= 0 && btn.x + btn.width <= 320 && btn.y + btn.height <= 700,
      overflow: await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    });
    await p.locator('.mobile-quote-bar .button').click();
    results[results.length - 1].actionReached =
      (await p.getByRole('dialog').isVisible()) ||
      /\/requests\/new|\/account\//.test(new URL(p.url()).pathname);
  }
  console.log(JSON.stringify(results));
  await b.close();
  if (results.some((r) => !r.buttonWithin || r.overflow || !r.actionReached)) process.exitCode = 1;
})();
