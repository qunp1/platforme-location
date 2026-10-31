import {test,expect} from '@playwright/test';
test('dialogs dismiss by Escape and restore focus without locking scrolling',async({page})=>{
 await page.goto('/cars?location=office');const trigger=page.locator('.trip-summary').getByRole('button');await trigger.click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(trigger).toBeFocused();expect(await page.evaluate(()=>document.body.style.overflow)).not.toBe('hidden');
 await trigger.click();await page.getByRole('button',{name:'Fermer',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('mobile calendar closes, reopens and confirms without stale panels',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');const trigger=page.getByRole('button',{name:'Dates de location',exact:true});await trigger.click();const panel=page.getByRole('region',{name:'Choisir les dates de location'});await expect(panel).toBeVisible();await page.getByRole('button',{name:'7 jours',exact:true}).click();await page.getByRole('button',{name:'Valider',exact:true}).click();await expect(page.locator('.date-popover')).toHaveCount(0);await expect(trigger).toBeFocused();await trigger.click();await page.getByRole('button',{name:'Fermer le calendrier'}).click();await trigger.click();await expect(panel).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('.date-popover')).toHaveCount(0);
});
test('reduced motion resolves overlay dismissal immediately',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/cars?location=office');await page.locator('.trip-summary').getByRole('button').click();expect(await page.getByRole('dialog').evaluate(e=>e.getAnimations().length)).toBe(0);await page.getByRole('button',{name:'Fermer',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
});
