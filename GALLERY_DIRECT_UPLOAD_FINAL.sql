-- KURDUWADI CITY PORTAL - GALLERY DIRECT PHOTO/VIDEO UPLOAD
-- Run this SQL once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  media_type text not null default 'image' check (media_type in ('image','video')),
  media_url text not null,
  thumbnail_url text,
  category text,
  submitted_by uuid references auth.users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.gallery_items enable row level security;

drop policy if exists gallery_public on public.gallery_items;
create policy gallery_public on public.gallery_items
for select using (status='approved');

drop policy if exists gallery_insert on public.gallery_items;
create policy gallery_insert on public.gallery_items
for insert to anon, authenticated
with check ((auth.uid()=submitted_by) or submitted_by is null);

drop policy if exists admin_gallery on public.gallery_items;
create policy admin_gallery on public.gallery_items
for all to authenticated
using (public.is_admin()) with check (public.is_admin());

create index if not exists gallery_status_idx on public.gallery_items(status, created_at desc);

-- Public bucket so approved media can display directly on the website.
insert into storage.buckets (id, name, public)
values ('community-images', 'community-images', true)
on conflict (id) do update set public=true;

-- Anyone may upload only inside gallery/; the website enforces image/video type and size.
drop policy if exists gallery_storage_public_read on storage.objects;
create policy gallery_storage_public_read on storage.objects
for select to public
using (bucket_id='community-images');

drop policy if exists gallery_storage_upload on storage.objects;
create policy gallery_storage_upload on storage.objects
for insert to anon, authenticated
with check (bucket_id='community-images' and (storage.foldername(name))[1]='gallery');

-- Logged-in admins can manage gallery files.
drop policy if exists gallery_storage_admin_delete on storage.objects;
create policy gallery_storage_admin_delete on storage.objects
for delete to authenticated
using (bucket_id='community-images' and public.is_admin());

drop policy if exists gallery_storage_admin_update on storage.objects;
create policy gallery_storage_admin_update on storage.objects
for update to authenticated
using (bucket_id='community-images' and public.is_admin())
with check (bucket_id='community-images' and public.is_admin());

-- Admin delete: remove database row and its uploaded Storage object.
drop function if exists public.delete_gallery_item(uuid);
create or replace function public.delete_gallery_item(item_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item public.gallery_items%rowtype;
  object_path text;
begin
  if auth.uid() is null then raise exception 'Login required'; end if;
  if not public.is_admin() then raise exception 'Not authorized'; end if;

  select * into item from public.gallery_items where id=item_id for update;
  if not found then raise exception 'Gallery item not found'; end if;

  object_path := regexp_replace(item.media_url, '^.*/storage/v1/object/public/community-images/', '');
  if object_path = item.media_url then object_path := null; end if;

  if object_path is not null then
    delete from storage.objects
    where bucket_id='community-images' and name=object_path;
  end if;

  delete from public.gallery_items where id=item_id;
end;
$$;

revoke all on function public.delete_gallery_item(uuid) from public;
grant execute on function public.delete_gallery_item(uuid) to authenticated;

select 'GALLERY DIRECT PHOTO + VIDEO UPLOAD SUCCESS' as result;
