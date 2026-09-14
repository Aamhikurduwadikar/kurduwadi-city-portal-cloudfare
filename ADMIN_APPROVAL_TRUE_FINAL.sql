-- KURDUWADI CITY PORTAL - TRUE FINAL ADMIN APPROVAL FIX
-- Run this whole file in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- 1) Secure admin test. The logged-in admin MUST exist in admin_profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
      and lower(coalesce(role,'')) = 'admin'
  );
$$;

-- 2) Diagnostic function used by the Admin Panel.
create or replace function public.admin_access_check()
returns table(is_admin boolean, user_id uuid, admin_profile_exists boolean)
language sql
security definer
stable
set search_path = public
as $$
  select
    public.is_admin(),
    auth.uid(),
    exists(select 1 from public.admin_profiles where id=auth.uid());
$$;

-- 3) One secure action RPC for cards.
create or replace function public.set_business_card_status(card_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;
  if not public.is_admin() then raise exception 'ADMIN_REQUIRED'; end if;
  if new_status not in ('approved','rejected') then raise exception 'INVALID_STATUS'; end if;
  update public.business_cards
     set status=new_status, updated_at=now()
   where id=card_id and status='pending';
  if not found then raise exception 'PENDING_BUSINESS_CARD_NOT_FOUND'; end if;
end;
$$;

-- 4) One secure action RPC for photo/video.
create or replace function public.set_gallery_item_status(item_id uuid, new_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;
  if not public.is_admin() then raise exception 'ADMIN_REQUIRED'; end if;
  if new_status not in ('approved','rejected') then raise exception 'INVALID_STATUS'; end if;
  update public.gallery_items
     set status=new_status
   where id=item_id and status='pending';
  if not found then raise exception 'PENDING_GALLERY_ITEM_NOT_FOUND'; end if;
end;
$$;

revoke all on function public.admin_access_check() from public;
grant execute on function public.admin_access_check() to authenticated;
revoke all on function public.set_business_card_status(uuid,text) from public;
grant execute on function public.set_business_card_status(uuid,text) to authenticated;
revoke all on function public.set_gallery_item_status(uuid,text) from public;
grant execute on function public.set_gallery_item_status(uuid,text) to authenticated;

-- 5) Correct admin RLS policies.
alter table public.business_cards enable row level security;
drop policy if exists admin_business_cards on public.business_cards;
create policy admin_business_cards on public.business_cards
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists business_cards_public on public.business_cards;
create policy business_cards_public on public.business_cards
for select to anon, authenticated using (status='approved');

alter table public.gallery_items enable row level security;
drop policy if exists admin_gallery on public.gallery_items;
create policy admin_gallery on public.gallery_items
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists gallery_public on public.gallery_items;
create policy gallery_public on public.gallery_items
for select to anon, authenticated using (status='approved');

select 'TRUE FINAL ADMIN APPROVAL SQL SUCCESS' as result;
