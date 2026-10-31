import { test } from 'node:test';
import assert from 'node:assert/strict';
import {defaultFilters} from '../src/domain.js';
import {makeUrl,parseRoute} from '../src/navigation.js';

test('French entry aliases preserve existing routing and trip state',()=>{
  for(const [alias,path] of [['/voitures','/cars'],['/voitures/sandero','/cars/sandero'],['/compte','/account/bookings'],['/aide','/help'],['/agences','/agency'],['/comment-ca-marche','/how-it-works']]){
    const route=parseRoute(alias+'?location=port&start=2027-01-04&end=2027-01-11&gear=auto');
    assert.equal(route.path,path);assert.equal(route.search.location,'port');assert.equal(route.hasDates,true);assert.equal(route.filters.gear,'auto');
  }
});
test('trip and every filter survive URL serialization and refresh parsing',()=>{
  const search={location:'port',start:'2027-01-04',end:'2027-01-11'};
  const filters={...defaultFilters,gear:'auto',category:'compact',max:425,sort:'price-desc'};
  const parsed=parseRoute(makeUrl('/cars/clio',search,filters));
  assert.deepEqual(parsed.search,search);assert.deepEqual(parsed.filters,filters);assert.equal(parsed.path,'/cars/clio');
});
test('malformed URL values normalize safely to supported defaults',()=>{
  const parsed=parseRoute('/cars?location=constructor&start=no&end=bad&gear=unknown&max=Infinity');
  assert.equal(parsed.invalidTrip,true);assert.equal(parsed.search.location,'airport');assert.equal(parsed.filters.gear,'all');assert.equal(parsed.filters.max,700);
});
test('unrecognized sort and category cannot leak into filter controls',()=>{
  const parsed=parseRoute('/cars?category=truck&sort=random&max=-3');
  assert.equal(parsed.filters.category,'all');assert.equal(parsed.filters.sort,'price');assert.equal(parsed.filters.max,200);
});

test('family and SUV filters survive shareable search links',()=>{
  for(const category of ['family','suv']) {
    const search={location:'airport',start:'2027-01-04',end:'2027-01-11'};
    const filters={...defaultFilters,gear:'all',category,max:700,sort:'price'};
    assert.deepEqual(parseRoute(makeUrl('/cars',search,filters)).filters,filters);
  }
});

test('browsing without dates never counts fallback dates as a user choice',()=>{
  assert.equal(parseRoute('/').hasDates,false);
  assert.equal(parseRoute('/cars/sandero?location=airport').hasDates,false);
  assert.equal(parseRoute('/cars?start=bad&end=bad').hasDates,false);
  assert.equal(parseRoute('/cars?start=2027-01-04&end=2027-01-11').hasDates,true);
});

test('legacy timed links normalize to calendar dates',()=>{
  const parsed=parseRoute('/cars?start=2027-01-04T10:00&end=2027-01-11T12:00');
  assert.equal(parsed.search.start,'2027-01-04');
  assert.equal(parsed.search.end,'2027-01-11');
  assert.equal(parsed.hasDates,true);
  assert.doesNotMatch(makeUrl('/cars',parsed.search),/T10|T12/);
});

test('fuel and seats are validated and survive shared links',()=>{
 const filters={...defaultFilters,fuel:'diesel',seats:'7'};
 assert.deepEqual(parseRoute(makeUrl('/cars',{location:'office'},filters)).filters,filters);
 const invalid=parseRoute('/cars?fuel=electric&seats=9').filters;
 assert.equal(invalid.fuel,'all');assert.equal(invalid.seats,'all');
});

test('GitHub Pages links preserve the repository base and route parameters', async () => {
  const { browserUrl, routeLocation } = await import('../src/navigation.js');
  const route = '/cars/sandero?location=airport&fuel=diesel';
  const href = browserUrl(route, '/platforme-location/', true);
  assert.equal(href, '/platforme-location/#/cars/sandero?location=airport&fuel=diesel');
  const restored = routeLocation(`https://qunp1.github.io${href}`, true);
  assert.equal(restored.pathname, '/cars/sandero');
  assert.equal(restored.searchParams.get('fuel'), 'diesel');
  assert.equal(browserUrl(route, '/', false), route);
  assert.equal(browserUrl('https://example.com', '/platforme-location/', true), 'https://example.com');
});
