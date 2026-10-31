import { test, expect } from '@playwright/test';

test('phone details use one bottom booking action and a regular specification grid', async ({
  page,
}) => {
  for (const width of [320, 375, 430, 594]) {
    await page.setViewportSize({ width, height: 750 });
    await page.goto('/cars/sandero?location=office');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dacia Sandero');
    await expect(page.getByRole('navigation', { name: 'Navigation mobile' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Retour aux offres' })).toHaveCount(0);
    const bar = await page.locator('.mobile-quote-bar').boundingBox();
    expect(Math.abs(bar.y + bar.height - 750)).toBeLessThan(1);
    const button = await page.locator('.mobile-quote-bar .button').boundingBox();
    expect(button.width).toBeGreaterThanOrEqual(200);
    expect(button.height).toBeGreaterThanOrEqual(48);
    const specs = await page.locator('.vehicle-specs li').all();
    const boxes = await Promise.all(specs.map((spec) => spec.boundingBox()));
    expect(boxes).toHaveLength(4);
    expect(boxes[0].y).toBe(boxes[1].y);
    expect(boxes[2].y).toBe(boxes[3].y);
    expect(boxes[0].width).toBe(boxes[1].width);
    expect(boxes[2].y).toBeGreaterThan(boxes[0].y);
    const photo = await page.locator('.vehicle-image-frame').boundingBox();
    expect(Math.abs(photo.width / photo.height - 4 / 3)).toBeLessThan(0.01);
    await expect(page.locator('.gallery-action')).toHaveText('');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.locator('.mobile-quote-bar .button').click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('photo remains fully clickable with an accessible name and icon-only affordance', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/cars/sandero?location=office');
  const photo = page.getByRole('button', { name: 'Agrandir la photo de Dacia Sandero' });
  await photo.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(photo).toBeFocused();
});

test('catalog category labels and edge-to-edge browsing navigation align', async ({ page }) => {
  await page.setViewportSize({ width: 1094, height: 750 });
  await page.goto('/cars?location=office');
  await expect(page.locator('.category-chip')).toHaveCount(0);
  await page.setViewportSize({ width: 594, height: 650 });
  const nav = page.getByRole('navigation', { name: 'Navigation mobile' });
  const box = await nav.boundingBox();
  expect(box.x).toBe(0);
  expect(box.width).toBe(594);
  expect(box.y + box.height).toBe(650);
  await expect(nav).toHaveCSS('border-radius', '0px');
  await expect(nav.getByRole('link', { name: 'Voitures' })).toHaveAttribute('aria-current', 'page');
});
