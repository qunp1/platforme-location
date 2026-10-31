import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('custom pickers support keyboard, cross-year ranges, clear, and dismissal', async ({
  page,
}, info) => {
  await page.clock.setFixedTime(new Date('2026-10-25T12:00:00Z'));
  await page.goto('/');
  await page.getByRole('button', { name: /^Lieu de remise/ }).click();
  await page.getByRole('button', { name: /Nador centre Retrait/ }).click();
  const picker = page.getByRole('region', { name: 'Choisir les dates de location' });
  await expect(picker).toBeFocused();
  await expect(page.locator('[data-day="2026-10-24"]')).toBeDisabled();
  await page.locator('[data-day="2026-10-25"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-day="2026-10-26"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Dates de location', exact: true })).toContainText(
    '26 oct. – 27 oct.',
  );
  await page.getByRole('button', { name: 'Effacer les dates' }).click();
  await expect(page.getByRole('button', { name: 'Dates de location', exact: true })).toContainText(
    'Ajouter des dates',
  );
  await expect(page.getByRole('button', { name: 'Valider', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Mois suivant' }).click();
  await page.getByRole('button', { name: 'Mois suivant' }).click();
  await page.locator('[data-day="2026-12-31"]:visible').click();
  if (info.project.name === 'mobile')
    await page.getByRole('button', { name: 'Mois suivant' }).click();
  await page.locator('[data-day="2027-01-03"]:visible').click();
  await expect(page.locator('.in-range')).not.toHaveCount(0);
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.screenshot({
    path: `replica/clone-screens/range-${info.project.name}.png`,
    fullPage: false,
  });
  await page.keyboard.press('Escape');
  await expect(picker).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Dates de location', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Dates de location', exact: true }).click();
  await page.getByRole('heading', { level: 1 }).click();
  await expect(picker).toHaveCount(0);
  await page.getByRole('button', { name: 'Rechercher', exact: true }).click();
  await expect(page).toHaveURL(/start=2026-12-31/);
  await expect(page).toHaveURL(/end=2027-01-03/);
  await expect(page.locator('.offer-row').first().locator('.price')).toContainText('pour 3 jours');
  await expect(page.locator('.pricing-status')).toHaveCount(0);
});
test('mobile uses the bottom dock without a duplicate header menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Ouvrir le menu' })).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeHidden();
  const dock = page.getByRole('navigation', { name: 'Navigation mobile' });
  await expect(dock.getByRole('link')).toHaveCount(4);
  await dock.getByRole('link', { name: 'Voitures', exact: true }).click();
  await expect(page).toHaveURL(/\/cars/);
});
