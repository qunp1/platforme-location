import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('search stays fully within the first screen on small phones', async ({ page }) => {
  for (const [width, height] of [
    [320, 568],
    [360, 640],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    const bar = await page.locator('.booking-pill').boundingBox();
    expect(bar.y + bar.height).toBeLessThanOrEqual(height);
    expect(bar.x).toBeGreaterThanOrEqual(0);
    expect(bar.x + bar.width).toBeLessThanOrEqual(width);
  }
});
test('sticky mobile request action opens dates or proceeds directly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/cars/jogger?location=office');
  await page
    .locator('.mobile-quote-bar')
    .getByRole('button', { name: 'Choisir mes dates' })
    .click();
  await expect(page.getByRole('region', { name: 'Choisir les dates de location' })).toBeVisible();
  await page.goto('/cars/jogger?location=office&start=2027-01-04&end=2027-01-11');
  await page
    .locator('.mobile-quote-bar')
    .getByRole('button', { name: 'Préparer ma demande' })
    .click();
  await expect(page).toHaveURL(/requests\/new.*vehicle=jogger/);
});
test('info and partner pages have complete navigation and truthful contact', async ({ page }) => {
  for (const route of ['/how-it-works', '/help']) {
    await page.goto(route);
    await expect(page.getByRole('link', { name: 'Vous êtes une agence ?' })).toHaveAttribute(
      'href',
      '/agency',
    );
    const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(a.violations).toEqual([]);
  }
  await page.goto('/agency');
  await expect(page.locator('.partner-benefits article')).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'Contacter l’équipe' })).toHaveAttribute(
    'href',
    /^mailto:Anas.Bouayadi01@gmail.com/,
  );
  await expect(page.getByText(/Les comptes agences sont créés manuellement/)).toBeVisible();
  const a = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(a.violations).toEqual([]);
});
test('photo badges sit below the car and category filtering remains available', async ({
  page,
}) => {
  await page.goto('/');
  const frame = await page.locator('.agency-photo-frame').first().boundingBox(),
    badge = await page.locator('.agency-photo-badge').first().boundingBox();
  expect(badge.y).toBeGreaterThan(frame.y + frame.height / 2);
  await expect(page.locator('.photo-label')).toHaveCount(0);
  for (const width of [1440, 1110, 1100, 1024, 1000, 951, 950, 768]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/cars?location=office');
    const sidebar = page.locator('.filters-sidebar'),
      toggle = page.getByRole('button', { name: /^Filtres/ });
    expect((await sidebar.isVisible()) || (await toggle.isVisible())).toBe(true);
    await expect(page.locator('.category-chip')).toHaveCount(0);
  }
});

test('compact mobile action shares the price baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('.compact-price-row').first()).toHaveCSS('align-items', 'baseline');
  await expect(page.locator('.card-action').first()).toHaveCSS('align-items', 'baseline');
});
