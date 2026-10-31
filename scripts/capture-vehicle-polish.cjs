const { chromium } = require('@playwright/test');
(async () => {
  const b = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const context = await b.newContext();
  const p = await context.newPage();
  for (const [width, path, file] of [
    [390, '/cars/sandero?location=office', 'vehicle-detail-phone'],
    [320, '/cars/sandero?location=office', 'vehicle-detail-small-phone'],
    [594, '/cars?location=office', 'edge-navigation'],
    [1094, '/cars?location=office', 'centered-categories'],
  ]) {
    await p.setViewportSize({ width, height: 750 });
    await p.goto('http://127.0.0.1:4173' + path);
    await p.locator('.skeleton').waitFor({ state: 'detached' });
    await p.screenshot({ path: 'replica/' + file + '.png' });
  }
  await b.close();
})();
