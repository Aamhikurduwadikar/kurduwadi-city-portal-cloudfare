-- KURDUWADI CITY PORTAL - FINAL ADMIN APPROVE / REJECT FIX
-- Run this entire file once in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Ensure the admin helper exists and checks the logged-in user's admin profile.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- BUSINESS CARDS
create or replace function public.approve_business_card(card_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is null then raise exception 'Login required'; end if;
  if not public.is_admin() then raise exception 'Not authorized'; end if;
  update public.business_cards set status='approved', updated_at=now()
  where id=card_id and status='pending';
  if not found then raise exception 'Pending business card not found'; end if;
end; $$;

create or replace function public.reject_business_card(card_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is null then raise exception 'Login required'; end if;
  if not public.is_admin() then raise exception 'Not authorized'; end if;
  update public.business_cards set status='rejected', updated_at=now()
  where id=card_id and status='pending';
  if not found then raise exception 'Pending business card not found'; end if;
end; $$;

-- GALLERY PHOTO / VIDEO
create or replace function public.approve_gallery_item(item_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is null then raise exception 'Login required'; end if;
  if not public.is_admin() then raise exception 'Not authorized'; end if;
  update public.gallery_items set status='approved'
  where id=item_id and status='pending';
  if not found then raise exception 'Pending gallery item not found'; end if;
end; $$;

create or replace function public.reject_gallery_item(item_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is null then raise exception 'Login required'; end if;
  if not public.is_admin() then raise exception 'Not authorized'; end if;
  update public.gallery_items set status='rejected'
  where id=item_id and status='pending';
  if not found then raise exception 'Pending gallery item not found'; end if;
end; $$;

-- Gallery delete also removes the Storage object when possible.
create or replace function public.delete_gallery_item(item_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare
  item public.gallery_items%rowtype;
  object_path text;
begin
  if auth.uid() is null then raise exception 'Login required'; end if;
  if not public.is_admin() then raise exception 'Not authorized'; end if;
  select * into item from public.gallery_items where id=item_id for update;
  if not found then raise exception 'Gallery item not found'; end if;
  object_path := regexp_replace(item.media_url, '^.*/storage/v1/object/public/community-images/', '');
  if object_path <> item.media_url then
    delete from storage.objects where bucket_id='community-images' and name=object_path;
  end if;
  delete from public.gallery_items where id=item_id;
end; $$;

revoke all on function public.approve_business_card(uuid) from public;
revoke all on function public.reject_business_card(uuid) from public;
revoke all on function public.approve_gallery_item(uuid) from public;
revoke all on function public.reject_gallery_item(uuid) from public;
revoke all on function public.delete_gallery_item(uuid) from public;
grant execute on function public.approve_business_card(uuid) to authenticated;
grant execute on function public.reject_business_card(uuid) to authenticated;
grant execute on function public.approve_gallery_item(uuid) to authenticated;
grant execute on function public.reject_gallery_item(uuid) to authenticated;
grant execute on function public.delete_gallery_item(uuid) to authenticated;

-- RLS: admin can update approval status.
alter table public.business_cards enable row level security;
drop policy if exists admin_business_cards on public.business_cards;
create policy admin_business_cards on public.business_cards for all to authenticated
using (public.is_admin()) with check (public.is_admin());

alter table public.gallery_items enable row level security;
drop policy if exists admin_gallery on public.gallery_items;
create policy admin_gallery on public.gallery_items for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists gallery_public on public.gallery_items;
create policy gallery_public on public.gallery_items for select to anon, authenticated
using (status='approved');

select 'FINAL ADMIN APPROVE / REJECT FIX SUCCESS' as result;
