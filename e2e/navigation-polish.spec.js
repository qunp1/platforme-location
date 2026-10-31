import { test, expect } from '@playwright/test';

test('mobile header slides softly, reveals upwards and resets on resize and focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  const header = page.locator('.site-header');
  await expect(header).toHaveCSS('transition-duration', /0\.25s/);
  await expect(header).toHaveCSS('backdrop-filter', /blur\(16px\)/);
  await page.evaluate(() => window.scrollTo(0, 450));
  await expect(header).toHaveAttribute('data-hidden', 'true');
  await page.evaluate(() => window.scrollTo(0, 420));
  await expect(header).toHaveAttribute('data-hidden', 'false');
  await page.evaluate(() => window.scrollTo(0, 550));
  await expect(header).toHaveAttribute('data-hidden', 'true');
  await page.setViewportSize({ width: 430, height: 800 });
  await expect(header).toHaveAttribute('data-hidden', 'false');
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect(header).toHaveAttribute('data-hidden', 'true');
  await header.getByRole('link', { name: 'Nadorly, accueil' }).focus();
  await expect(header).toHaveAttribute('data-hidden', 'false');
  await expect(header).toHaveCSS('transition-duration', '0s');
});

test('opening a real picker reveals a hidden header without a scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  const header = page.locator('.site-header');
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(header).toHaveAttribute('data-hidden', 'true');
  await page
    .getByRole('button', { name: 'Dates de location', exact: true })
    .evaluate((button) => button.click());
  await expect(page.locator('.booking-popover')).toBeVisible();
  await expect(header).toHaveAttribute('data-hidden', 'false');
});

test('desktop header remains pinned and reduced motion disables the slide', async ({ page }) => {
  await page.setViewportSize({ width: 1110, height: 800 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(page.locator('.site-header')).toHaveAttribute('data-hidden', 'false');
  expect((await page.locator('.site-header').boundingBox()).y).toBe(0);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.site-header')).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('.mobile-dock')).toHaveCSS('backdrop-filter', /blur\(20px\)/);
});

test('worst-case values and empty fleet remain readable at enlarged text size', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/?data=empty');
  await expect(page.getByText('Choisissez votre prise en charge')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Voir les voitures', exact: true })).toHaveAttribute(
    'href',
    /\/cars/,
  );
  await page.goto('/?data=worst');
  await expect(page.locator('.home-offers .offer-card')).toHaveCount(6);
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  const overflowing = await page
    .locator('.home-offers .price strong, .mobile-dock a span')
    .evaluateAll(
      (elements) =>
        elements.filter((el) => el.getBoundingClientRect().right > innerWidth + 1).length,
    );
  expect(overflowing).toBe(0);
});

test('touching the brand does not pin the header during later scrolling', async ({
  page,
}, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  await page.getByRole('link', { name: 'Nadorly, accueil' }).first().tap();
  await page.evaluate(() => scrollTo(0, 500));
  await expect(page.locator('.site-header')).toHaveAttribute('data-hidden', 'true');
});
