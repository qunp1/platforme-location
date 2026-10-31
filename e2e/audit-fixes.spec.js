import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('past dates require correction before preparing a request',async({page})=>{
 await page.goto('/cars/jogger?location=office&start=2020-01-04&end=2020-01-11');
 await expect(page.getByRole('button',{name:'Préparer ma demande'})).toHaveCount(0);
 await page.locator('.quote-panel').getByRole('button',{name:'Modifier mes dates',exact:true}).click();
 await expect(page.getByRole('region',{name:'Choisir les dates de location'})).toBeVisible();
});
test('account service failure offers retry and preserves trip',async({page})=>{
 let failed=true;await page.route('**/api/health',r=>r.fulfill({status:failed?500:200,contentType:'application/json',body:failed?'{}':'{"configured":false}'}));
 await page.goto('/requests/new?vehicle=jogger&location=port&start=2027-01-04&end=2027-01-11');
 await expect(page.getByRole('button',{name:'Réessayer'})).toBeVisible();
 await expect(page.locator('input[type=email]')).toHaveCount(0);
 await expect(page.getByRole('link',{name:'Revenir aux voitures'})).toHaveAttribute('href',/location=port.*start=2027-01-04/);
 failed=false;await page.getByRole('button',{name:'Réessayer'}).click();await expect(page.getByText('La configuration du service est nécessaire.',{exact:false})).toBeVisible();
});
test('process page passes contrast checks',async({page})=>{
 await page.goto('/how-it-works');const result=await new AxeBuilder({page}).withRules(['color-contrast']).analyze();expect(result.violations).toEqual([]);
});
test('calendar confirmation fits phone viewport and date highlight has desktop breathing room',async({page},info)=>{
 await page.goto('/');await page.getByRole('button',{name:'Dates de location',exact:true}).click();
 if(info.project.name==='mobile'){
 const box=await page.getByRole('button',{name:'Valider',exact:true}).boundingBox();expect(box.y).toBeGreaterThan(80);expect(box.y+box.height).toBeLessThanOrEqual(844);
 }else{const date=await page.locator('.date-trigger').boundingBox();const submit=await page.locator('.pill-submit').boundingBox();expect(submit.x-date.x-date.width).toBeGreaterThanOrEqual(6);}
});
test('enlarged text keeps primary controls inside phone width',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const [url,selector] of [['/','.process-cta'],['/cars/jogger?location=office','.acceptance-tag, .mobile-quote-bar .button']]){
 await page.goto(url);await page.evaluate(()=>document.documentElement.style.fontSize='200%');
 for(const target of await page.locator(selector).all()){const b=await target.boundingBox();expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(390);}
 }
});
