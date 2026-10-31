import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('help search handles accents, categories and an empty result', async ({ page }) => {
  await page.goto('/aide');
  await page.getByLabel('Rechercher dans l’aide').fill('especes');
  await expect(page.locator('.questions-list details')).toHaveCount(1);
  await expect(page.locator('.questions-list summary')).toContainText('espèces');
  await page.getByLabel('Rechercher dans l’aide').fill('no-matching-answer');
  await expect(
    page.getByRole('heading', { name: 'Aucune réponse pour cette recherche' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Voir toutes les réponses' }).click();
  await page.getByRole('button', { name: 'Documents', exact: true }).click();
  await expect(page.locator('.questions-list summary')).toHaveText(
    'Quels documents faut-il présenter ?+',
  );
});

test('French vehicle links keep the trip and display every price condition', async ({ page }) => {
  await page.goto('/voitures/sandero?location=airport&start=2027-01-04&end=2027-01-11');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dacia Sandero');
  await expect(page.locator('.quote-panel')).toContainText('250 MAD');
  await expect(page.locator('.quote-panel')).toContainText('1.850 MAD');
  await expect(page.locator('.deposit-box')).toContainText('5.000 MAD');
  await expect(page.locator('.deposit-box')).toContainText('Carte au nom du conducteur');
  await expect(page.locator('.terms-grid')).toContainText('Même niveau au retour');
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(result.violations).toEqual([]);
});

test('mobile dock supports touch navigation and clears the request bar', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'Touch navigation is exercised by the mobile project.');
  await page.goto('/cars/sandero?location=office');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dacia Sandero');
  const dock = page.getByRole('navigation', { name: 'Navigation mobile' });
  await expect(dock).toHaveCount(0);
  const quote = await page.locator('.mobile-quote-bar').boundingBox();
  expect(Math.abs(quote.y + quote.height - page.viewportSize().height)).toBeLessThan(1);
  await page.goto('/');
  await expect(dock).toBeVisible();
  for (const link of await dock.getByRole('link').all()) {
    const box = await link.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(48);
    expect(box.height).toBeGreaterThanOrEqual(48);
  }
  const navigation = await dock.boundingBox();
  expect(navigation.x).toBe(0);
  expect(navigation.width).toBe(page.viewportSize().width);
  await dock.getByRole('link', { name: 'Aide', exact: true }).tap();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Vos questions, nos réponses');
  await expect(dock.getByRole('link', { name: 'Aide' })).toHaveAttribute('aria-current', 'page');
});
