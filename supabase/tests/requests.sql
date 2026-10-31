-- Run in a development Supabase SQL editor AFTER migration and seed. Rolls back all test data.
begin;
insert into auth.users(id,email) values
 ('11111111-1111-4111-8111-111111111111','rls-one@example.invalid'),
 ('22222222-2222-4222-8222-222222222222','rls-two@example.invalid');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$
declare b public.booking_requests; again public.booking_requests; start_day date := (now() at time zone 'Africa/Casablanca')::date+7;
begin
 b := public.create_booking_request('sandero',start_day,start_day+2,'office','Test Driver','+212600000000','33333333-3333-4333-8333-333333333333',50000);
 again := public.create_booking_request('sandero',start_day,start_day+2,'office','Test Driver','+212600000000','33333333-3333-4333-8333-333333333333',50000);
 if b.id<>again.id or b.total<>50000 or b.status<>'requested' then raise exception 'Invalid creation/retry'; end if;
 begin
  perform public.create_booking_request('sandero',start_day,start_day+2,'office','Test Driver','+212600000000','44444444-4444-4444-8444-444444444444',1);
  raise exception 'Expected quote rejection' using errcode='ZX001';
 exception when others then if sqlstate='ZX001' then raise; end if; end;
 begin
  update public.booking_requests set status='confirmed' where id=b.id;
  raise exception 'Expected mutation rejection' using errcode='ZX001';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin
 if exists(select 1 from public.booking_requests) then raise exception 'RLS leaked another customer request'; end if;
 begin
  insert into public.agency_memberships(agency_id,user_id,role) select id,auth.uid(),'owner' from public.agencies limit 1;
  raise exception 'Expected role escalation rejection' using errcode='ZX001';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
