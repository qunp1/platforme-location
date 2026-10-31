begin;
create table public.agencies (
 id uuid primary key default gen_random_uuid(), name text not null unique,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.agency_memberships (
 id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies on delete cascade,
 user_id uuid not null references auth.users on delete cascade, role text not null check(role in ('member','owner')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(agency_id,user_id)
);
create index on public.agency_memberships(user_id);
create table public.vehicles (
 id text primary key, agency_id uuid not null references public.agencies on delete restrict,
 name text not null, daily integer not null check(daily>0), deposit integer not null check(deposit>=0),
 pickup jsonb not null, terms jsonb not null, active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index on public.vehicles(agency_id);
create table public.booking_requests (
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references auth.users on delete cascade,
 agency_id uuid not null references public.agencies on delete restrict, vehicle_id text not null references public.vehicles on delete restrict,
 start_date date not null, end_date date not null check(end_date>start_date), location text not null check(location in ('office','airport','port')),
 contact_name text not null check(length(contact_name) between 2 and 100), phone text not null check(length(phone) between 6 and 30),
 status text not null default 'requested' check(status in ('requested','awaiting_payment','confirmed','completed','declined','cancelled','expired')),
 currency text not null default 'MAD' check(currency='MAD'), total integer not null check(total>0), quote jsonb not null,
 idempotency_key uuid not null, terms_accepted_at timestamptz not null default now(),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(customer_id,idempotency_key)
);
create index on public.booking_requests(customer_id,created_at desc);
create index on public.booking_requests(agency_id,status);
create index on public.booking_requests(vehicle_id,start_date,end_date);
alter table public.agencies enable row level security;
alter table public.agency_memberships enable row level security;
alter table public.vehicles enable row level security;
alter table public.booking_requests enable row level security;
create policy agency_public_read on public.agencies for select to anon,authenticated using(true);
create policy vehicle_public_read on public.vehicles for select to anon,authenticated using(active);
create policy membership_self_read on public.agency_memberships for select to authenticated using(user_id=auth.uid());
create policy request_customer_read on public.booking_requests for select to authenticated using(customer_id=auth.uid());
-- Agency users cannot inspect customer contact data until the agency workflow is implemented.
revoke all on public.agencies,public.vehicles,public.agency_memberships,public.booking_requests from anon,authenticated;
grant select on public.agencies,public.vehicles to anon,authenticated;
grant select on public.agency_memberships,public.booking_requests to authenticated;

create function public.create_booking_request(p_vehicle_id text,p_start date,p_end date,p_location text,p_contact_name text,p_phone text,p_key uuid,p_expected_total integer)
returns public.booking_requests language plpgsql security definer set search_path='' as $$
declare v public.vehicles; a public.agencies; b public.booking_requests; d integer; fee integer; amount integer;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 -- Serializes identical retry keys before checking or inserting a frozen quote.
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text || p_key::text,0));
 select * into b from public.booking_requests where customer_id=auth.uid() and idempotency_key=p_key;
 if found then
  if b.vehicle_id<>p_vehicle_id or b.start_date<>p_start or b.end_date<>p_end or b.location<>p_location then raise exception 'Retry key reused with different trip'; end if;
  return b;
 end if;
 if p_key is null or p_start is null or p_end is null or p_location is null or p_expected_total is null or p_contact_name is null or p_phone is null or length(trim(p_contact_name)) not between 2 and 100 or p_phone !~ '^[+0-9 ()-]{6,30}$' then raise exception 'Invalid input'; end if;
 if p_start < (now() at time zone 'Africa/Casablanca')::date or p_end<=p_start or p_end-p_start>365 then raise exception 'Invalid dates'; end if;
 select * into v from public.vehicles where id=p_vehicle_id and active for share;
 if not found or not (v.pickup ? p_location) then raise exception 'Unavailable pickup or vehicle'; end if;
 select * into a from public.agencies where id=v.agency_id;
 d := p_end-p_start; fee := (v.pickup->>p_location)::integer; amount := d*v.daily+fee;
 if amount<>p_expected_total then raise exception 'Quote changed: review offer'; end if;
 insert into public.booking_requests(customer_id,agency_id,vehicle_id,start_date,end_date,location,contact_name,phone,total,idempotency_key,quote)
 values(auth.uid(),v.agency_id,v.id,p_start,p_end,p_location,trim(p_contact_name),p_phone,amount,p_key,
 jsonb_build_object('vehicle',v.name,'agency',a.name,'daily',v.daily,'days',d,'rental',d*v.daily,'delivery',fee,'total',amount,'deposit',v.deposit,'terms',v.terms,'billing','calendar_days','demo',true)) returning * into b;
 return b;
end; $$;
revoke all on function public.create_booking_request(text,date,date,text,text,text,uuid,integer) from public,anon;
grant execute on function public.create_booking_request(text,date,date,text,text,text,uuid,integer) to authenticated;
commit;
