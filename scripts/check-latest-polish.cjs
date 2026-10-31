const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  const results = [];
  for (const width of [320, 614, 1110, 1920])
    for (const mode of ['demo', 'worst', 'empty', 'one', 'many']) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('http://127.0.0.1:5175/?data=' + mode);
      await page.locator('.catalog-stress').waitFor();
      await page.waitForFunction(() => !document.querySelector('.skeleton'));
      results.push({
        width,
        mode,
        ...(await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          cards: document.querySelectorAll('.home-offers .offer-card').length,
          hero: document.querySelector('.hero-stage').getBoundingClientRect().height,
          headingFont: getComputedStyle(document.querySelector('.home-offers h2')).fontFamily,
        }))),
      });
      if (['demo', 'worst'].includes(mode) && [320, 1110].includes(width))
        await page.screenshot({ path: `replica/polish-${width}-${mode}.png` });
    }
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('http://127.0.0.1:5175/?data=worst');
  await page.locator('.offer-card').first().waitFor();
  await page.addStyleTag({ content: 'html {font-size:200%}' });
  results.push({
    width: 320,
    mode: 'worst-200%',
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  });
  await page.screenshot({ path: 'replica/polish-320-200.png', fullPage: true });
  await page.goto('http://127.0.0.1:5175/cars?location=office&data=many');
  await page.locator('.offer-card').first().waitFor();
  results.push({ mode: 'catalog-many', count: await page.locator('.offer-card').count() });
  require('fs').writeFileSync(
    'replica/polish-stress-results.json',
    JSON.stringify(results, null, 2),
  );
  await browser.close();
  console.log(JSON.stringify(results));
})();
