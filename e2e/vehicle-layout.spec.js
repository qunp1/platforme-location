import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('vehicle booking stays alongside gallery on laptop and preserves trip when edited',async({page})=>{
 await page.setViewportSize({width:1024,height:900});
 await page.goto('/cars/jogger?location=office&start=2027-01-04&end=2027-01-11&gear=manual');
 await expect(page.getByRole('heading',{level:1})).toHaveText('Dacia Jogger');
 const photo=await page.locator('.vehicle-gallery').boundingBox(),quote=await page.locator('.quote-panel').boundingBox();
 expect(quote.x).toBeGreaterThan(photo.x+photo.width);expect(quote.y).toBeLessThan(photo.y+40);
 expect(await page.locator('.quote-panel').evaluate(el=>getComputedStyle(el).position)).toBe('sticky');
 await expect(page.locator('.booking-daily')).toContainText('550 MAD');await expect(page.locator('.quote-total')).toContainText('3.850');
 await expect(page.locator('.vehicle-page')).not.toContainText(/fictiv|démonstration/i);
 await page.getByRole('button',{name:'Modifier les dates du séjour'}).click();
 await expect(page.getByRole('region',{name:'Choisir les dates de location'})).toBeVisible();
 await page.getByRole('button',{name:'3 jours',exact:true}).click();await page.getByRole('button',{name:'Valider',exact:true}).click();await page.getByRole('button',{name:'Rechercher',exact:true}).click();
 await expect(page).toHaveURL(/\/cars\/jogger\?/);await expect(page).toHaveURL(/gear=manual/);await expect(page).toHaveURL(/end=2027-01-07/);
 await expect(page.locator('.quote-total')).toContainText('1.650');
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
 await page.locator('.quote-panel').getByRole('button',{name:'Préparer ma demande'}).click();await expect(page).toHaveURL(/vehicle=jogger/);
});
test('calendar footer is minimal and shared actions have pill corners',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Dates de location',exact:true}).click();
 await expect(page.getByText('Choisissez vos dates ou une durée',{exact:true})).toHaveCount(0);
 for(const control of [page.locator('.header-end .requests-link'),page.getByRole('link',{name:'Voir le catalogue',exact:true})]){
  const radius=await control.evaluate(el=>parseFloat(getComputedStyle(el).borderTopLeftRadius));expect(radius).toBeGreaterThanOrEqual(100);
 }
});
