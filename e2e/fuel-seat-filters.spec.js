import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('fuel and seat pills filter, survive refresh and clear independently',async({page},info)=>{
 await page.goto('/cars?location=office');
 const mobile=info.project.name==='mobile';
 async function controls(){if(mobile)await page.getByRole('button',{name:/^Filtres/}).click();return mobile?page.getByRole('dialog'):page.locator('.filters-sidebar');}
 let panel=await controls();await panel.getByRole('button',{name:'Essence',exact:true}).click();await panel.getByRole('button',{name:'7 places',exact:true}).click();
 if(mobile)await panel.getByRole('button',{name:'Afficher les résultats'}).click();
 await expect(page).toHaveURL(/fuel=essence/);await expect(page).toHaveURL(/seats=7/);
 await expect(page.locator('.offer-row')).toHaveCount(1);await expect(page.locator('.offer-row')).toContainText('Dacia Jogger');await expect(page.locator('.offer-row .specs')).toContainText('Essence');
 await page.reload();await expect(page.locator('.offer-row')).toHaveCount(1);
 await page.getByRole('button',{name:/Supprimer le carburant/}).click();await expect(page).not.toHaveURL(/fuel=/);await expect(page).toHaveURL(/seats=7/);
 panel=await controls();await panel.getByRole('button',{name:'Diesel',exact:true}).click();if(mobile)await panel.getByRole('button',{name:'Afficher les résultats'}).click();
 await expect(page.getByRole('heading',{name:'Aucune offre pour ces critères'})).toBeVisible();await page.getByRole('button',{name:'Effacer les filtres',exact:true}).click();await expect(page.locator('.offer-row')).toHaveCount(12);
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
});
test('search geometry and closed credits remain consistent',async({page},info)=>{
 for(const route of ['/','/cars?location=office']){
 await page.goto(route);if(route!=='/')await page.getByRole('button',{name:/^Modifier/}).click();
 const bar=page.locator('.booking-pill');await expect(bar).toBeVisible();
 expect(await bar.evaluate(e=>getComputedStyle(e).gap)).toBe(info.project.name==='mobile'?'4px':'8px');
 await page.getByRole('button',{name:'Dates de location',exact:true}).click();
 await expect(page.locator('.booking-divider')).toHaveCSS('opacity','0');
 if(info.project.name==='desktop'){const d=await page.locator('.date-trigger').boundingBox(),s=await page.locator('.pill-submit').boundingBox();expect(s.x-d.x-d.width).toBeGreaterThanOrEqual(6);expect(Math.abs(d.y+d.height/2-s.y-s.height/2)).toBeLessThan(1);const outer=await bar.boundingBox();const top=s.y-outer.y,bottom=outer.y+outer.height-s.y-s.height,right=outer.x+outer.width-s.x-s.width;expect(Math.abs(top-right)).toBeLessThan(1);expect(Math.abs(bottom-right)).toBeLessThan(1);}
 }
 await page.keyboard.press('Escape');await page.keyboard.press('Escape');
 const credits=page.locator('footer .photo-credits');await expect(credits).not.toHaveAttribute('open','');await expect(credits.locator('li')).toHaveCount(9);await expect(credits.locator('ul')).toBeHidden();
});
