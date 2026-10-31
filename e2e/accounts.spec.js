import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async({page})=>{
 await page.route('https://fonts.googleapis.com/**',route=>route.fulfill({contentType:'text/css',body:''}));
 page.on('pageerror',error=>{throw error;});
});
test('unconfigured accounts show a truthful recovery state',async({page})=>{
 await page.route('**/api/health',r=>r.fulfill({json:{configured:false}}));
 await page.goto('/account/bookings');
 await expect(page.getByText('Les comptes et demandes ne sont pas encore connectés.',{exact:false})).toBeVisible();
 await expect(page.getByRole('button',{name:'Envoyer ma demande'})).toHaveCount(0);
});
test('request journey preserves vehicle and dates through sign-in and shows persisted request',async({page})=>{
 let loggedIn=false, record;let sent;
 await page.route('**/api/**',async route=>{
  const path=new URL(route.request().url()).pathname;
  let json={};
  if(path==='/api/health')json={configured:true};
  if(path==='/api/auth/session')json={user:loggedIn?{id:'demo',email:'demo@example.test'}:null};
  if(path==='/api/auth/sign-in'){loggedIn=true;json={user:{id:'demo',email:'demo@example.test'}};}
  if(path==='/api/requests'&&route.request().method()==='POST'){
   sent=route.request().postDataJSON();record={id:'demo-request',status:'requested',start_date:sent.start,end_date:sent.end,location:sent.location,total:50000,quote:{vehicle:'Dacia Sandero',agency:'Cap Nador Location',daily:25000,days:2,delivery:0,deposit:500000,terms:{insurance:'Responsabilité civile incluse',mileage:200,age:23,license:2,cancellation:'Conditions de démonstration.'}}};json={request:record};
  }else if(path==='/api/requests')json={requests:record?[record]:[]};
  await route.fulfill({json});
 });
 await page.goto('/cars/sandero?location=office&start=2030-11-01&end=2030-11-03');
 await page.locator('.quote-panel').getByRole('button',{name:'Préparer ma demande'}).click();
 await page.getByLabel('E-mail',{exact:true}).fill('demo@example.test');await page.getByLabel('Mot de passe',{exact:true}).fill('example-password');await page.getByRole('button',{name:'Me connecter',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Dacia Sandero'})).toBeVisible();
 await page.getByLabel('Nom du conducteur').fill('Demo Driver');await page.getByLabel('Téléphone').fill('+212600000000');await page.getByRole('checkbox').check();
 const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(a11y.violations).toEqual([]);
 await page.getByRole('button',{name:'Envoyer ma demande'}).click();
 await expect(page.getByText('En attente de l’agence',{exact:true})).toBeVisible();
 expect(sent.vehicleId).toBe('sandero');expect(sent.start).toBe('2030-11-01');expect(sent.expectedTotal).toBe(50000);
 await page.reload();await expect(page.getByText('Référence : demo-request')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:`test-results/requests-${test.info().project.name}.png`,fullPage:true});
});
