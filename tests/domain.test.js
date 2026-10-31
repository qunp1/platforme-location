import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rentalDays, quote, calendarDate, searchCars, defaultFilters, validateSearch } from '../src/domain.js';
const car = { daily: 25000, pickup: { office: 0, airport: 10000 }, gear: 'manual' };
const trip = { start: '2026-10-26', end: '2026-11-02', location: 'airport' };
test('quotes integer MAD minor units, excludes security deposit', () => {
  assert.deepEqual(quote(car, trip), { days: 7, rental: 175000, delivery: 10000, total: 185000 });
});
test('bills calendar days and rejects nonpositive/invalid spans', () => {
  assert.equal(rentalDays(trip.start, '2026-10-27'), 1);
  assert.equal(rentalDays(trip.start, trip.start), 0);
  assert.equal(rentalDays(trip.end, trip.start), 0);
  assert.equal(rentalDays('bad', trip.end), 0);
});
test('calendar days remain stable across Morocco clock changes', () => {
  assert.equal(rentalDays('2026-02-14','2026-02-16'),2);
  assert.equal(rentalDays('2026-03-21','2026-03-23'),2);
  assert.equal(rentalDays('2028-02-28','2028-03-01'),2);
});
test('today in Morocco is selectable, past dates are rejected', () => {
  const now=Date.parse('2026-10-26T15:00:00Z');
  assert.equal(validateSearch(trip,now),'');
  assert.ok(validateSearch({...trip,start:'2026-10-25'},now));
});
test('unsupported pickup and transmission filters cannot produce offers', () => {
  assert.equal(quote(car, { ...trip, location: 'port' }), null);
  assert.equal(searchCars([car], trip, { gear: 'auto', max: 900, sort: 'price' }).length, 0);
});
test('total-cost sort accounts for handover fees instead of ranking by daily rate', () => {
  const cheapRate = {...car,id:'low-rate',daily:24000,pickup:{airport:25000}};
  const lowTotal = {...car,id:'low-total'};
  assert.deepEqual(searchCars([cheapRate,lowTotal],trip,defaultFilters).map(c=>c.id),['low-total','low-rate']);
  assert.deepEqual(searchCars([cheapRate,lowTotal],trip,{...defaultFilters,sort:'price-desc'}).map(c=>c.id),['low-rate','low-total']);
});
test('invalid calendar dates and inherited pickup keys are rejected', () => {
  assert.ok(Number.isNaN(calendarDate('2026-02-30')));
  assert.equal(quote(car,{...trip,location:'constructor'}),null);
  assert.ok(validateSearch({...trip,location:'toString'}));
});
test('filters combine category, transmission, budget and supported pickup', () => {
  const fleet=[{...car,id:'one',category:'economy'},{...car,id:'two',category:'compact',gear:'auto'}];
  assert.deepEqual(searchCars(fleet,trip,{...defaultFilters,category:'compact',gear:'auto'}).map(c=>c.id),['two']);
  assert.equal(searchCars(fleet,{...trip,location:'port'},defaultFilters).length,0);
});

test('fuel and seats combine with existing filters without changing sort',()=>{
 const fleet=[{...car,id:'diesel-five',fuel:'Diesel',seats:5},{...car,id:'petrol-seven',fuel:'Essence',seats:7},{...car,id:'petrol-five',fuel:'Essence',seats:5}];
 assert.deepEqual(searchCars(fleet,trip,{...defaultFilters,fuel:'essence',seats:'7'}).map(c=>c.id),['petrol-seven']);
 assert.equal(searchCars(fleet,trip,{...defaultFilters,fuel:'diesel',seats:'7'}).length,0);
 assert.equal(searchCars(fleet,trip,defaultFilters).length,3);
});
