import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
// Reads only the project's trusted static catalog, replacing image imports with filenames.
let source = readFileSync('src/data.js','utf8').replace(/^import (\w+) from '([^']+)';/gm,(_,name,path)=>`const ${name}=${JSON.stringify(path)};`).replace(/export const /g,'const ');
const cars = vm.runInNewContext(`${source}\ncars;`,{}, {timeout:1000});
const sql = value => `'${String(value).replaceAll("'","''")}'`;
let output = '-- Fictional catalog only. Run after the migration in the same Supabase project.\nbegin;\n';
for (const agency of new Set(cars.map(c=>c.agency))) output += `insert into public.agencies(name) values(${sql(agency)}) on conflict(name) do nothing;\n`;
for (const c of cars) {
 const {image,photoRef,pickup,agency,id,name,daily,deposit,active,...terms} = c;
 output += `insert into public.vehicles(id,agency_id,name,daily,deposit,pickup,terms,active) values(${sql(id)},(select id from public.agencies where name=${sql(agency)}),${sql(name)},${daily},${deposit},${sql(JSON.stringify(pickup))}::jsonb,${sql(JSON.stringify(terms))}::jsonb,true) on conflict(id) do nothing;\n`;
}
writeFileSync('supabase/seed.sql',output+'commit;\n');
