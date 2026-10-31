import { test, expect } from '@playwright/test';

test('tablet navigation and offer actions remain inside the viewport at 200% text', async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/cars');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  await expect(page.locator('.offer-row').first()).toBeVisible();
  for (const target of await page
    .locator('.header-nav a:visible, .header-end a:visible, .listing-cta')
    .all()) {
    const box = await target.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(768);
  }
});

test('filter dismissal and apply stay visible while criteria scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 });
  await page.goto('/cars');
  await page.getByRole('button', { name: /^Filtres/ }).click();
  const dialog = page.getByRole('dialog');
  const apply = dialog.getByRole('button', { name: 'Afficher les résultats' });
  await expect(apply).toBeInViewport({ timeout: 1500 });
  await dialog.getByRole('button', { name: '7 places', exact: true }).scrollIntoViewIfNeeded();
  await expect(dialog.getByRole('button', { name: 'Fermer', exact: true })).toBeInViewport();
  await dialog.getByRole('button', { name: '7 places', exact: true }).click();
  await apply.click();
  await expect(page).toHaveURL(/seats=7/);
  await expect(page.locator('.offer-row')).toHaveCount(1);
});

test('enlarged bottom navigation stays accessible on short screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 568 });
  await page.goto('/');
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  const requests = page
    .getByRole('navigation', { name: 'Navigation mobile' })
    .getByRole('link', { name: 'Demandes', exact: true });
  await expect(requests).toBeInViewport();
  await requests.click();
  await expect(page).toHaveURL(/account\/bookings/);
});

test('missing pages have a primary heading and short pages fill the viewport', async ({ page }) => {
  await page.goto('/not-found');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cette page est introuvable', {
    timeout: 1500,
  });
  await page.route('**/api/health', (route) => route.fulfill({ json: { configured: false } }));
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/account/bookings');
  await expect(
    page.getByText('Les comptes et demandes ne sont pas encore connectés.', { exact: false }),
  ).toBeVisible();
  const footer = await page.locator('.site-footer').boundingBox();
  expect(footer.y + footer.height).toBeGreaterThanOrEqual(1100);
});
