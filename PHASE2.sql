-- KURDUWADI CITY PORTAL - PHASE 2
create extension if not exists pgcrypto;

create table if not exists public.business_cards (
 id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
 name text not null, designation text, business_name text, phone text, whatsapp text, email text,
 address text, website text, instagram text, facebook text, photo_url text, bio text,
 slug text unique not null, status text not null default 'pending', created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists public.representatives (
 id uuid primary key default gen_random_uuid(), name text not null, role text, ward text, party text,
 phone text, email text, photo_url text, office_address text, social_url text, description text,
 status text not null default 'approved', created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists public.city_info (
 id uuid primary key default gen_random_uuid(), section_key text unique not null, title text not null,
 content text, image_url text, status text not null default 'approved', updated_at timestamptz default now()
);

create table if not exists public.gallery_items (
 id uuid primary key default gen_random_uuid(), title text not null, description text,
 media_type text not null default 'image', media_url text not null, thumbnail_url text,
 category text, submitted_by uuid references auth.users(id) on delete set null,
 status text not null default 'pending', created_at timestamptz default now()
);

alter table public.business_cards enable row level security;
alter table public.representatives enable row level security;
alter table public.city_info enable row level security;
alter table public.gallery_items enable row level security;

drop policy if exists business_cards_public on public.business_cards;
create policy business_cards_public on public.business_cards for select using (status='approved');
drop policy if exists business_cards_owner_insert on public.business_cards;
create policy business_cards_owner_insert on public.business_cards for insert with check (auth.uid()=user_id or user_id is null);
drop policy if exists business_cards_owner_update on public.business_cards;
create policy business_cards_owner_update on public.business_cards for update using (auth.uid()=user_id);

drop policy if exists representatives_public on public.representatives;
create policy representatives_public on public.representatives for select using (status='approved');

drop policy if exists city_info_public on public.city_info;
create policy city_info_public on public.city_info for select using (status='approved');

drop policy if exists gallery_public on public.gallery_items;
create policy gallery_public on public.gallery_items for select using (status='approved');
drop policy if exists gallery_insert on public.gallery_items;
create policy gallery_insert on public.gallery_items for insert with check (auth.uid()=submitted_by or submitted_by is null);

drop policy if exists admin_business_cards on public.business_cards;
create policy admin_business_cards on public.business_cards for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_representatives on public.representatives;
create policy admin_representatives on public.representatives for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_city_info on public.city_info;
create policy admin_city_info on public.city_info for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists admin_gallery on public.gallery_items;
create policy admin_gallery on public.gallery_items for all using (public.is_admin()) with check (public.is_admin());

create index if not exists business_cards_status_idx on public.business_cards(status);
create index if not exists gallery_status_idx on public.gallery_items(status, created_at desc);
create index if not exists reps_status_idx on public.representatives(status);

insert into public.city_info(section_key,title,content,status) values
('history','कुर्डूवाडीचा इतिहास','कुर्डूवाडी शहराची स्थानिक माहिती, इतिहास आणि विकासाची माहिती येथे Admin कडून भरता येईल.','approved'),
('population','लोकसंख्या','लोकसंख्येचा अधिकृत/विश्वसनीय आकडा Admin कडून स्रोतासह अपडेट करता येईल.','approved'),
('about','कुर्डूवाडीची ओळख','कुर्डूवाडी, ता. माढा, जि. सोलापूर — शहर, रेल्वे, बाजारपेठ, शिक्षण आणि स्थानिक सेवांची माहिती.','approved')
on conflict(section_key) do nothing;
