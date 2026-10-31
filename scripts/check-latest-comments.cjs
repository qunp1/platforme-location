const { chromium } = require('@playwright/test');
(async () => {
  const b = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const c = await b.newContext();
  const p = await c.newPage();
  const trip = 'location=airport&start=2027-01-04&end=2027-01-11';
  const out = [];
  for (const width of [320, 397, 614, 1110]) {
    await p.setViewportSize({ width, height: 650 });
    await p.goto('http://127.0.0.1:4173/cars?' + trip);
    await p.locator('.offer-row').first().waitFor();
    let sort = await p.locator('.sort-select').boundingBox();
    out.push({
      width,
      sortWidth: sort.width,
      chips: await p.locator('.category-chip').count(),
      badges: await p.locator('.pricing-status').count(),
    });
    if (width === 614) await p.screenshot({ path: 'replica/compact-sort-latest.png' });
    await p.goto('http://127.0.0.1:4173/cars/sandero?' + trip);
    await p.locator('.mobile-quote-bar').waitFor({ state: width < 768 ? 'visible' : 'hidden' });
    if (width < 768) {
      const summary = p.locator('.detail-disclosure summary');
      await summary.click();
      await p.waitForFunction(
        () => document.querySelector('.detail-disclosure').getAnimations().length === 0,
      );
      out[out.length - 1].expanded = await summary.getAttribute('aria-expanded');
      await summary.click();
      await p.waitForFunction(() => !document.querySelector('.detail-disclosure').open);
      await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
      const link = await p.locator('.micro-footer a').boundingBox();
      const bar = await p.locator('.mobile-quote-bar').boundingBox();
      out[out.length - 1].footerClearance = bar.y - link.y - link.height;
      out[out.length - 1].amountParts = await p.locator('.booking-amount > span').allTextContents();
      out[out.length - 1].bookingRadius = await p
        .locator('.booking-request')
        .evaluate((el) => getComputedStyle(el).borderRadius);
      if (width === 397) await p.screenshot({ path: 'replica/tight-footer-latest.png' });
    }
  }
  await p.emulateMedia({ reducedMotion: 'reduce' });
  await p.setViewportSize({ width: 397, height: 650 });
  await p.goto('http://127.0.0.1:4173/cars/sandero?' + trip);
  await p.locator('.detail-disclosure summary').click();
  out.push({
    reducedMotionAnimations: await p
      .locator('.detail-disclosure')
      .evaluate((el) => el.getAnimations().length),
  });
  await p.goto('http://127.0.0.1:4173/help');
  out.push({ helpArrivalSections: await p.locator('.arrival-guides').count() });
  console.log(JSON.stringify(out));
  await b.close();
})();
