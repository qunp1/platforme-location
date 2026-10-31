const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
(async () => {
  const b = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const results = [];
  for (const width of [390, 1110])
    for (const route of ['/', '/cars?location=office', '/cars/sandero?location=office']) {
      const context = await b.newContext({ viewport: { width, height: 800 } });
      const p = await context.newPage();
      await p.goto('http://127.0.0.1:4173' + route);
      await p.locator('h1').waitFor();
      await p.locator('.skeleton').waitFor({ state: 'detached' });
      const axe = await new AxeBuilder({ page: p })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      results.push({
        width,
        route,
        violations: axe.violations.map((v) => v.id),
        overflow: await p.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        devControls: await p.locator('.catalog-stress').count(),
      });
      if (route === '/' && width === 390)
        await p.screenshot({ path: 'replica/final-mobile-navigation.png' });
      await context.close();
    }
  require('fs').writeFileSync(
    'replica/latest-production-check.json',
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results));
  await b.close();
  if (results.some((r) => r.violations.length || r.overflow || r.devControls)) process.exitCode = 1;
})();
