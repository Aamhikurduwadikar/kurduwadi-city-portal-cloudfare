-- Phase 3 security hardening. Run in Supabase SQL Editor.
-- Public data remains readable only when approved/published; admin writes require is_admin().
create or replace function public.is_admin()
returns boolean language sql security definer set search_path=public stable as $$
  select exists(select 1 from public.admin_profiles where id=auth.uid() and role='admin');
$$;

-- Prevent public users from directly changing approval fields through normal update paths.
-- Existing admin policies remain the only authenticated admin write path for these tables.

create index if not exists business_cards_slug_status_idx on public.business_cards(slug,status);
create index if not exists city_info_status_key_idx on public.city_info(status,section_key);
create index if not exists gallery_items_status_created_idx on public.gallery_items(status,created_at desc);

-- Do not store secrets in frontend code. The anon key is public by design; service_role must never be deployed to the browser.
