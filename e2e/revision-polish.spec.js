import { test, expect } from '@playwright/test';

test('hero photo is an edge-to-edge background at every size', async ({ page }) => {
  for (const width of [524, 1110]) {
    await page.setViewportSize({ width, height: 650 });
    await page.goto('/');
    const image = await page.locator('.hero-visual').boundingBox();
    const search = await page.locator('.booking-pill').boundingBox();
    expect(image.x).toBe(0);
    expect(Math.abs(image.width - width)).toBeLessThan(1);
    expect(image.y).toBeLessThan(search.y);
    expect(image.y + image.height).toBeGreaterThan(search.y + search.height);
    await expect(
      page.getByRole('button', { name: 'Dates de location', exact: true }),
    ).toContainText('Ex.');
    await expect(page).not.toHaveURL(/start=/);
  }
});

test('home fleet links to the catalog without duplicate filters', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.fleet-tabs')).toHaveCount(0);
  await expect(page.locator('.home-offers .offer-card')).toHaveCount(6);
  await expect(page.locator('.home-offers h2')).toHaveCSS('font-family', /Plus Jakarta Sans/);
  await expect(page.getByRole('navigation', { name: 'Préparer votre arrivée' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Voir le catalogue', exact: true }).click();
  await expect(page).toHaveURL(/\/cars/);
});

test('mobile filters and sort align while the offer count stays visible', async ({ page }) => {
  for (const width of [320, 390, 524]) {
    await page.setViewportSize({ width, height: 650 });
    await page.goto('/cars?location=office');
    const filter = await page.getByRole('button', { name: /^Filtres/ }).boundingBox();
    const sort = await page.getByRole('button', { name: /^Trier par/ }).boundingBox();
    expect(Math.abs(filter.y + filter.height / 2 - sort.y - sort.height / 2)).toBeLessThan(1);
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.locator('.quick-transmission')).toHaveCount(0);
  }
});
