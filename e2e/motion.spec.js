import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('FAQ opens and closes with keyboard, reverses cleanly, and keeps answers accessible',async({page})=>{
 await page.goto('/help');const item=page.locator('.questions-list details').first(),summary=item.locator('summary');const closed=await item.evaluate(e=>e.getBoundingClientRect().height);
 await summary.focus();await page.keyboard.press('Enter');await expect(summary).toHaveAttribute('aria-expanded','true');await expect.poll(()=>item.evaluate(e=>e.getAnimations().length)).toBe(0);expect(await item.evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThan(closed);await expect(item.locator('p')).toBeVisible();
 await item.evaluate(e=>{const s=e.querySelector('summary');s.click();setTimeout(()=>s.click(),60);});
 await expect.poll(()=>item.evaluate(e=>e.getAnimations().length)).toBe(0);await expect(summary).toHaveAttribute('aria-expanded','true');await expect(item).toHaveAttribute('open','');expect(await item.evaluate(e=>e.style.height)).toBe('');
 await summary.focus();await page.keyboard.press('Space');await expect(item).not.toHaveAttribute('open','');await expect(summary).toHaveAttribute('aria-expanded','false');await expect(item.locator('p')).toBeHidden();const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);
});
test('route entrance is brief and filter changes do not replay it',async({page})=>{
 await page.goto('/');await page.evaluate(()=>{window.motionCalls=[];const original=Element.prototype.animate;Element.prototype.animate=function(frames,timing){window.motionCalls.push({frames,timing});return original.call(this,frames,timing);};});
 await page.locator('footer').getByRole('link',{name:'Comparer les offres',exact:true}).click();await expect(page).toHaveURL(/\/cars/);await expect.poll(()=>page.evaluate(()=>window.motionCalls.filter(x=>x.timing.duration===150).length)).toBeGreaterThan(0);
await page.goto('/cars?location=office');await page.evaluate(()=>{window.motionCalls=[];const original=Element.prototype.animate;Element.prototype.animate=function(frames,timing){window.motionCalls.push({frames,timing});return original.call(this,frames,timing);};});
 await page.setViewportSize({width:1440,height:900});await page.locator('.filters-sidebar').getByRole('button',{name:'Diesel',exact:true}).click();await expect(page).toHaveURL(/fuel=diesel/);expect(await page.evaluate(()=>window.motionCalls.length)).toBe(0);
});
test('reduced motion removes FAQ and route movement',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/help');await page.locator('.questions-list summary').first().click();expect(await page.locator('.questions-list details').first().evaluate(e=>e.getAnimations().length)).toBe(0);
 await page.locator('footer').getByRole('link',{name:'Comparer les offres',exact:true}).click();expect(await page.locator('main').evaluate(e=>e.getAnimations({subtree:true}).length)).toBe(0);
});
test('request hover lift is restricted to pointer devices and reduced motion',async({page},info)=>{
 await page.goto('/cars/jogger?location=office&start=2027-01-04&end=2027-01-11');const button=page.locator('.quote-panel .booking-request');await button.hover();
 if(info.project.name==='desktop')await expect(button).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, -1)');else await expect(button).toHaveCSS('transform','none');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(button).toHaveCSS('transform','none');
});
