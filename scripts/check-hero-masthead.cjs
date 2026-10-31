const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
(async () => {
  const b = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const c = await b.newContext();
  const p = await c.newPage();
  const out = [];
  for (const width of [390, 1079, 1440]) {
    await p.setViewportSize({ width, height: 800 });
    await p.goto('http://127.0.0.1:4173/');
    await p.locator('.offer-card').first().waitFor();
    const top = await p.locator('.site-header').getAttribute('data-hero');
    const before = await p.locator('.hero-stage').boundingBox();
    await p.screenshot({ path: 'replica/hero-masthead-' + width + '.png' });
    const axe = await new AxeBuilder({ page: p })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    await p.evaluate(() => scrollTo(0, 150));
    await p.waitForFunction(() => document.querySelector('.site-header').dataset.hero === 'false');
    out.push({
      width,
      top,
      scrolled: await p.locator('.site-header').getAttribute('data-hero'),
      violations: axe.violations.map((v) => v.id),
      heroY: before.y,
    });
    if (width === 1079) await p.screenshot({ path: 'replica/hero-masthead-scrolled.png' });
    await p.evaluate(() => scrollTo(0, 0));
    await p.waitForFunction(() => document.querySelector('.site-header').dataset.hero === 'true');
    await p.goto('http://127.0.0.1:4173/cars?location=office');
    if ((await p.locator('.site-header').getAttribute('data-hero')) !== 'false')
      throw Error('Hero styling leaked');
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
