import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync } from 'node:fs';
test.beforeEach(async ({page})=>{
  // Local functional QA uses the fallback font when the sandbox blocks Google Fonts.
  await page.route('https://fonts.googleapis.com/**',route=>route.fulfill({contentType:'text/css',body:''}));
  page.on('pageerror',error=>{throw error;});
  page.on('console',message=>{if(message.type()==='error') throw new Error(message.text());});
  page.on('response',response=>{if(response.status()>=500) throw new Error(`Server error ${response.status()} ${response.url()}`);});
});
const trip='location=airport&start=2027-01-04&end=2027-01-11';
async function chooseDates(scope) {
  const close=scope.getByRole('button',{name:'Fermer le calendrier'});
  if(await close.isVisible()) await close.click();
  await scope.getByRole('button',{name:/^Lieu de remise/}).click();
  await scope.getByRole('button',{name:/Aéroport Nador-Al Aroui Remise/}).click();
  while(!await scope.locator('[data-day="2027-01-04"]:visible').count()) await scope.getByRole('button',{name:'Mois suivant'}).click();
  await scope.locator('[data-day="2027-01-04"]:visible').click();
  await scope.locator('[data-day="2027-01-11"]:visible').click();
  await scope.getByRole('button',{name:'Valider',exact:true}).click();
}
async function axe(page) {
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
}
async function screenshot(page,id,testInfo) {
  mkdirSync('replica/clone-screens',{recursive:true});
  await page.screenshot({path:`replica/clone-screens/${id}-${testInfo.project.name}.png`,fullPage:true});
  await page.screenshot({path:`replica/clone-screens/${id}-${testInfo.project.name}-fold.png`});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
}
test('F01-H1 search to full details, price breakdown, accessible pages',async({page},testInfo)=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toContainText('Louez à Nador');
  await page.getByRole('heading',{name:'Dacia Sandero',exact:true}).waitFor();
  await expect(page.locator('.search-simple input[type="time"]')).toHaveCount(0);
  await expect(page.locator('input[type="date"],select')).toHaveCount(0);
  await axe(page);await screenshot(page,'S01',testInfo);
  await chooseDates(page);
  await page.getByRole('button',{name:'Rechercher',exact:true}).click();
  await expect(page).toHaveURL(/\/cars\?/);
  await expect(page.getByRole('status')).toContainText('11 offres');
  await axe(page);await screenshot(page,'S02',testInfo);
  await page.getByRole('link',{name:'Découvrir Dacia Sandero, Cap Nador Location',exact:true}).click();
  await expect(page).toHaveURL(/\/cars\/sandero\?/);
  await expect(page.getByRole('heading',{level:1})).toHaveText('Dacia Sandero');
  await expect(page.locator('.quote-total')).toContainText('1.850');
  await expect(page.locator('.deposit-box')).toContainText('5.000');
  await axe(page);await screenshot(page,'S04',testInfo);
  await page.getByRole('button',{name:'Agrandir la photo de Dacia Sandero'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Agrandir la photo de Dacia Sandero'})).toBeFocused();
  await page.reload();await expect(page.getByRole('heading',{level:1})).toHaveText('Dacia Sandero');
  await page.route('**/api/health',route=>route.fulfill({json:{configured:false}}));
  await page.locator('.quote-panel').getByRole('button',{name:'Préparer ma demande'}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText('Votre demande de location');
  await expect(page.getByText('Aucune demande n’a été envoyée.',{exact:false})).toBeVisible();
});
test('daily rates remain until dates are explicitly chosen',async({page},testInfo)=>{
  await page.goto('/');
  await expect(page.getByRole('button',{name:'Dates de location',exact:true})).toContainText('Ajouter des dates');
  await expect(page.locator('.home-offers .offer-card').first().locator('.price')).toContainText('250 MAD');
  await expect(page.locator('.home-offers .offer-card').first().locator('.price')).toContainText('par jour');
  await expect(page.locator('.hero-backdrop')).toBeVisible();
  await expect(page.locator('.home-offers .offer-card').first().getByRole('link')).toHaveCount(1);
  await expect(page.locator('.home-offers .offer-card').first()).not.toContainText('Caution');
  await page.getByRole('link',{name:'Découvrir Dacia Sandero, Cap Nador Location',exact:true}).click();
  await expect(page).not.toHaveURL(/start=/);
  await expect(page.locator('.quote-total')).toContainText('250 MAD');
  await expect(page.locator('.quote-total')).toContainText('par jour');
  await expect(page.locator('.deposit-box')).toContainText('5.000');
  await page.reload();
  await expect(page.locator('.quote-total')).toContainText('par jour');
  await page.locator('.quote-panel').getByRole('button',{name:'Choisir mes dates',exact:true}).click();
  await chooseDates(page.getByRole('dialog'));
  await page.getByRole('button',{name:'Rechercher'}).click();
  await expect(page.locator('.quote-total')).toContainText('1.850');
  await page.reload();
  await expect(page.locator('.quote-total')).toContainText('7 jours');
});

test('F02-H1 edit trip, cancel draft, persist applied URL',async({page},testInfo)=>{
  await page.goto(`/cars?${trip}`);
  await page.getByRole('button',{name:/Modifier/}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog.locator('input[type="date"],input[type="time"],select')).toHaveCount(0);
  await dialog.getByRole('button',{name:/^Lieu de remise/}).click();
  await dialog.getByRole('button',{name:/Port de Beni Ensar Accueil/}).click();
  await page.keyboard.press('Escape');await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(page).toHaveURL(/location=airport/);
  await page.getByRole('button',{name:/Modifier/}).click();
  await axe(page);
  await dialog.getByRole('button',{name:/^Lieu de remise/}).click();
  await dialog.getByRole('button',{name:/Port de Beni Ensar Accueil/}).click();
  await screenshot(page,'S03',testInfo);
  await dialog.locator('[data-day="2027-01-04"]:visible').click();
  await page.keyboard.press('Escape');
  await dialog.getByRole('button',{name:'Rechercher'}).click();
  await expect(dialog.getByRole('alert')).toContainText('Vérifiez les dates');
  await dialog.locator('[data-day="2027-01-11"]:visible').click();
  await dialog.getByRole('button',{name:'Valider',exact:true}).click();
  await dialog.getByRole('button',{name:'Rechercher'}).click();
  await expect(dialog).toHaveCount(0);await expect(page).toHaveURL(/location=port/);
  await expect(page.getByRole('status')).toContainText('9 offres');
  await page.reload();await expect(page.getByRole('status')).toContainText('9 offres');
});
test('F01-E1 filters, empty recovery and total sorting',async({page},testInfo)=>{
  await page.goto(`/cars?${trip}`);
  if(testInfo.project.name==='mobile') {
    await page.getByRole('button',{name:/^Filtres/}).click();
    await page.getByRole('dialog').getByRole('button',{name:'Automatique',exact:true}).click();
    await expect(page).not.toHaveURL(/gear=auto/);
    await page.getByRole('dialog').getByRole('button',{name:'Afficher les résultats'}).click();
  } else await page.locator('.filters-sidebar').getByRole('button',{name:'Automatique',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('4 offres');
  await expect(page).toHaveURL(/gear=auto/);
  await page.reload();await expect(page.getByRole('status')).toContainText('4 offres');
  await page.getByRole('link',{name:'Découvrir Renault Clio 5, Marchica Mobilité',exact:true}).click();
  await page.goBack();await expect(page).toHaveURL(/gear=auto/);
  await page.goto(`/cars?${trip}&max=200`);
  await expect(page.getByRole('heading',{name:'Aucune offre pour ces critères'})).toBeVisible();
  await page.getByRole('button',{name:'Effacer les filtres',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('11 offres');
  await page.getByRole('button',{name:/^Trier par/}).click();
  await page.getByRole('button',{name:'Prix total décroissant',exact:true}).click();
  await expect(page.locator('.offer-list article').first()).toContainText('Peugeot 3008');
  await expect(page.locator('.offer-list article').first()).toContainText('Marchica Mobilité');
});
test('expanded fleet categories persist and all new model details load',async({page},testInfo)=>{
  for (const [category,label,names] of [['suv','SUV',['Dacia Duster','Peugeot 3008']],['family','Familiales',['Dacia Logan','Dacia Jogger']]]) {
    await page.goto(`/cars?${trip}`);
    if(testInfo.project.name==='mobile') await page.getByRole('button',{name:/^Filtres/}).click();
    const scope=testInfo.project.name==='mobile'?page.getByRole('dialog'):page.locator('.filters-sidebar');
    await scope.getByRole('button',{name:label,exact:true}).click();
    if(testInfo.project.name==='mobile') await scope.getByRole('button',{name:'Afficher les résultats'}).click();
    await expect(page).toHaveURL(new RegExp(`category=${category}`));
    await expect(page.locator('.offer-list article')).toHaveCount(2);
    for(const name of names) await expect(page.locator('.offer-list').getByRole('heading',{name,exact:true})).toBeVisible();
    await page.reload();
    await expect(page.locator('.offer-list article')).toHaveCount(2);
  }
  for(const [id,name] of [['logan','Dacia Logan'],['corsa','Opel Corsa'],['i20','Hyundai i20'],['duster','Dacia Duster'],['3008','Peugeot 3008'],['jogger','Dacia Jogger']]) {
    await page.goto(`/cars/${id}?${trip}`);
    await expect(page.getByRole('heading',{level:1})).toHaveText(name);
    const photo=page.getByRole('button',{name:`Agrandir la photo de ${name}`}).locator('img');
    await expect.poll(()=>photo.evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
    await expect(page.locator('.quote-total')).toBeVisible();
  }
});

test('F01-E5 malformed and unavailable offer recover safely',async({page})=>{
  await page.goto('/cars/not-real?'+trip);
  await expect(page.getByRole('heading',{name:'Cette offre est introuvable'})).toBeVisible();
  await page.getByRole('link',{name:'Revenir aux voitures'}).click();
  await expect(page.getByRole('status')).toContainText('11 offres');
  await page.goto('/cars?location=constructor&start=bad&end=bad');
  await expect(page.getByText('Le lien contenait une recherche invalide.',{exact:false})).toBeVisible();
  await page.goto('/cars/sandero?'+trip.replace('airport','port'));
  await expect(page.getByText('Cette agence ne propose pas cette prise en charge.',{exact:false})).toBeVisible();
});
test('F01-E6 catalog error retry retains trip',async({page})=>{
  await page.route(/\/src\/catalog\.js(?:\?.*)?$/,route=>route.fulfill({contentType:'application/javascript',body:`import {cars} from '/src/data.js'; let attempt=0; export const catalog={list:async()=>{if(!attempt++)throw new Error('Test catalog failure'); return cars;}};`}));
  await page.goto('/cars?'+trip);
  await expect(page.getByRole('alert')).toContainText('Les offres n’ont pas pu être chargées');
  await page.getByRole('button',{name:'Réessayer'}).click();
  await expect(page.getByRole('status')).toContainText('11 offres');
  await expect(page).toHaveURL(/start=2027-01-04/);
});
test('F01-E7 responsive widths and reduced motion',async({page})=>{
  for(const width of [1366,768,390,320]) {
    await page.setViewportSize({width,height:width===1366?768:900});
    await page.goto('/');
    await expect(page.getByRole('button',{name:'Rechercher',exact:true})).toBeVisible();
    // The full-bleed hero prioritizes a complete booking dock in the first viewport.
    if(width===1366) {
      const dock=await page.locator('.search-simple').boundingBox();
      expect(dock.y+dock.height).toBeLessThan(768);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.goto('/cars?'+trip);
    await expect(page.getByRole('status')).toContainText('11 offres');
    const photo=await page.locator('.offer-row .offer-photo-link').first().boundingBox();
    expect(photo.width).toBeGreaterThan(100);expect(photo.height).toBeGreaterThan(100);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/cars/sandero?'+trip);
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
});
test('F01-E8 keyboard-only navigation reaches an offer',async({page})=>{
  await page.goto('/');
  await page.getByRole('heading',{name:'Dacia Sandero',exact:true}).waitFor();
  await chooseDates(page);
  for(let i=0;i<35;i++) {
    await page.keyboard.press('Tab');
    if(await page.getByRole('button',{name:'Rechercher',exact:true}).evaluate(el=>document.activeElement===el)) break;
  }
  await expect(page.getByRole('button',{name:'Rechercher',exact:true})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/cars\?/);
  for(let i=0;i<12;i++) {
    await page.keyboard.press('Tab');
    if(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')?.startsWith('Découvrir Dacia Sandero'))) break;
  }
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Dacia Sandero');
});
