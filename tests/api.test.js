import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApi } from '../server/api.js';

async function start(t,options={}) {
 const server=createApi(options);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 return (path,body,headers={})=>fetch(`http://127.0.0.1:${server.address().port}/api${path}`,{method:body===undefined?'GET':'POST',headers:{Origin:'http://127.0.0.1:5173','Content-Type':'application/json',...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
}
test('unconfigured backend reports unavailable and never simulates authentication',async t=>{
 const call=await start(t);assert.deepEqual(await (await call('/health')).json(),{configured:false});
 assert.equal((await call('/auth/sign-in',{email:'demo@example.test',password:'example-password'})).status,503);
});
test('rejects cross-origin writes and unauthenticated request reads',async t=>{
 const call=await start(t,{url:'https://example.test',key:'test',fetcher:()=>{throw Error('unexpected provider call');}});
 assert.equal((await call('/requests',{}, {Origin:'https://attacker.test'})).status,403);
 assert.equal((await call('/requests')).status,401);
});
test('sign-in uses HTTP-only cookies and returns no tokens to browser JavaScript',async t=>{
 const call=await start(t,{url:'https://example.test',key:'test',secure:true,fetcher:async()=>Response.json({access_token:'private-access',refresh_token:'private-refresh',expires_in:3600,user:{id:'user-1',email:'demo@example.test'}})});
 const r=await call('/auth/sign-in',{email:'demo@example.test',password:'example-password'});
 const data=await r.json();assert.equal(data.user.id,'user-1');assert.equal(data.access_token,undefined);
 for(const cookie of r.headers.getSetCookie()){assert.match(cookie,/HttpOnly/);assert.match(cookie,/SameSite=Lax/);assert.match(cookie,/Secure/);}
});
test('request creation forwards only validated inputs and user token, never client quote or owner',async t=>{
 let rpc;
 const call=await start(t,{url:'https://example.test',key:'test',fetcher:async(url,options)=>{
  if(url.endsWith('/auth/v1/user'))return Response.json({id:'user-1',email:'demo@example.test'});
  rpc={url,options};return Response.json({id:'request-1',status:'requested'});
 }});
 const body={vehicleId:'sandero',start:'2030-11-01',end:'2030-11-03',location:'office',contactName:'Demo Driver',phone:'+212 600 000000',termsAccepted:true,idempotencyKey:'11111111-1111-4111-8111-111111111111',expectedTotal:50000,customer_id:'attacker',quote:{total:1}};
 const r=await call('/requests',body,{Cookie:'access_token=customer-token'});assert.equal(r.status,201);
 assert.equal(rpc.options.headers.Authorization,'Bearer customer-token');
 const sent=JSON.parse(rpc.options.body);assert.equal(sent.customer_id,undefined);assert.equal(sent.quote,undefined);assert.equal(sent.p_expected_total,50000);
 assert.equal((await call('/requests',{...body,termsAccepted:false},{Cookie:'access_token=customer-token'})).status,400);
});
test('expired access session refreshes and rotates cookies before authenticated data access',async t=>{
 const seen=[];const call=await start(t,{url:'https://example.test',key:'test',fetcher:async(url,options)=>{
  seen.push([url,options]);if(url.endsWith('/auth/v1/user'))return Response.json({}, {status:401});
  if(url.includes('grant_type=refresh_token'))return Response.json({access_token:'new-access',refresh_token:'new-refresh',user:{id:'user-1'}});
  return Response.json([]);
 }});
 const r=await call('/requests',undefined,{Cookie:'access_token=expired; refresh_token=old-refresh'});
 assert.equal(r.status,200);assert.equal(seen[2][1].headers.Authorization,'Bearer new-access');assert.match(r.headers.get('set-cookie'),/new-refresh/);
});
test('password recovery validates the emailed code before changing the password and revokes sessions',async t=>{
 const paths=[];const call=await start(t,{url:'https://example.test',key:'test',fetcher:async(url,options)=>{
  paths.push([url,options]);return url.endsWith('/verify')?Response.json({access_token:'recovery-session'}):Response.json({});
 }});
 const r=await call('/auth/reset-password',{email:'demo@example.test',code:'123456',password:'new-example-password'});
 assert.equal(r.status,200);assert.equal(paths[0][0],'https://example.test/auth/v1/verify');assert.equal(JSON.parse(paths[0][1].body).type,'recovery');
 assert.equal(paths[1][1].method,'PUT');assert.equal(paths[1][1].headers.Authorization,'Bearer recovery-session');assert.match(paths[2][0],/logout\?scope=global$/);
 assert.match(r.headers.get('set-cookie'),/Max-Age=0/);
});
