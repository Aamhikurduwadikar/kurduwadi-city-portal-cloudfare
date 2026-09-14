-- KURDUWADI CITY PORTAL
-- DIGITAL BUSINESS CARD FIX
create extension if not exists pgcrypto;

create table if not exists public.business_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  designation text,
  business_name text,
  phone text,
  whatsapp text,
  email text,
  address text,
  website text,
  instagram text,
  facebook text,
  photo_url text,
  bio text,
  slug text unique not null,
  status text not null default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.business_cards enable row level security;

drop policy if exists business_cards_public on public.business_cards;
create policy business_cards_public
on public.business_cards for select
using (status='approved');

drop policy if exists business_cards_owner_insert on public.business_cards;
create policy business_cards_owner_insert
on public.business_cards for insert
with check (auth.uid()=user_id or user_id is null);

drop policy if exists business_cards_owner_update on public.business_cards;
create policy business_cards_owner_update
on public.business_cards for update
using (auth.uid()=user_id);

drop policy if exists admin_business_cards on public.business_cards;
create policy admin_business_cards
on public.business_cards for all
using (public.is_admin())
with check (public.is_admin());

create index if not exists business_cards_status_created_idx
on public.business_cards(status, created_at desc);

select 'DIGITAL BUSINESS CARD FIX SUCCESS' as result;
