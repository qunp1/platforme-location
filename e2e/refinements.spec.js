import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('duration shortcuts use tomorrow, preserve departure, and cross month/year boundaries',async({page})=>{
 await page.clock.setFixedTime(new Date('2026-12-30T12:00:00Z'));await page.goto('/');
 await page.getByRole('button',{name:'Dates de location',exact:true}).click();
 await page.getByRole('button',{name:'3 jours',exact:true}).click();
 await expect(page.getByRole('button',{name:'Dates de location',exact:true})).toContainText('31 déc. – 3 janv.');
 await expect(page.getByRole('button',{name:'3 jours',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'14 jours',exact:true}).click();
 await expect(page.getByRole('button',{name:'Dates de location',exact:true})).toContainText('31 déc. – 14 janv.');
 await page.getByRole('button',{name:'Dates exactes',exact:true}).click();
 await expect(page.getByRole('button',{name:'Dates exactes',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Valider',exact:true}).click();
 await page.getByRole('button',{name:'Rechercher',exact:true}).click();
 await expect(page).toHaveURL(/start=2026-12-31/);await expect(page).toHaveURL(/end=2027-01-14/);
 await page.getByRole('button',{name:/Modifier/}).click();
 const dialog=page.getByRole('dialog');await dialog.getByRole('button',{name:'Dates de location',exact:true}).click();
 await dialog.getByRole('button',{name:'5 jours',exact:true}).click();
 await expect(dialog.getByRole('button',{name:'Dates de location',exact:true})).toContainText('31 déc. – 5 janv.');
 await dialog.getByRole('button',{name:'Effacer les dates'}).click();
 await dialog.getByRole('button',{name:'7 jours',exact:true}).click();
 await expect(dialog.getByRole('button',{name:'Dates de location',exact:true})).toContainText('31 déc. – 7 janv.');
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(axe.violations).toEqual([]);
});
test('laptop sidebar persists and cards keep three compact zones',async({page})=>{
 for(const width of [768,1024,1280,1440]){
  await page.setViewportSize({width,height:900});await page.goto('/cars');
  const sidebar=page.locator('.filters-sidebar');
  if(width>=1024){await expect(sidebar).toBeVisible();await expect(page.getByRole('button',{name:/^Filtres/})).toBeHidden();expect(await sidebar.evaluate(el=>getComputedStyle(el).position)).toBe('sticky');}
  const card=page.locator('.offer-row').first();await expect(card).toBeVisible();
  const photo=await card.locator('.offer-photo-link').boundingBox(),details=await card.locator('.offer-main').boundingBox(),price=await card.locator('.offer-price').boundingBox(),cta=await card.locator('.listing-cta').boundingBox();
  expect(details.x).toBeGreaterThan(photo.x+photo.width-1);expect(price.x).toBeGreaterThan(details.x+details.width-1);expect(cta.width).toBeLessThan(240);expect(cta.x+cta.width).toBeLessThan((await card.boundingBox()).x+(await card.boundingBox()).width-8);
  expect(await page.locator('.trip-band').evaluate(el=>getComputedStyle(el).position)).toBe('sticky');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.evaluate(()=>window.scrollTo(0,600));
 const summary=await page.locator('.trip-band').boundingBox();
 expect(summary.y).toBeGreaterThanOrEqual(80);expect(summary.y+summary.height).toBeLessThan(220);
 expect((await page.locator('.filters-sidebar').boundingBox()).y).toBeGreaterThanOrEqual(80);
 await page.locator('.filters-sidebar').getByRole('button',{name:'Automatique',exact:true}).click();await expect(page).toHaveURL(/gear=auto/);
 await expect(page.locator('.filters-sidebar .filter-pill[aria-pressed="true"]')).toHaveCount(4);
});

test('landing copy, process descriptions and collapsed photo credits are complete',async({page})=>{
 await page.goto('/');
 await expect(page.getByText('Les offres en direct de nos agences partenaires à Nador.',{exact:true})).toBeVisible();
 await expect(page.locator('.process-steps li p')).toHaveCount(3);
 const credits=page.locator('footer .photo-credits');await expect(credits).not.toHaveAttribute('open','');
 await expect(credits.locator('li')).toHaveCount(9);await expect(credits.locator('ul')).toBeHidden();
 await credits.locator('summary').click();await expect(credits.locator('ul')).toBeVisible();
});
