-- कुर्डूवाडी Business Story / Business Directory upgrade
-- Run once in Supabase SQL Editor if this migration is not already applied.
alter table public.kurduwadi_directory
  add column if not exists owner_name text,
  add column if not exists founded_year integer,
  add column if not exists products_services text,
  add column if not exists origin_story text,
  add column if not exists business_history text,
  add column if not exists inspiration text,
  add column if not exists family_story text,
  add column if not exists achievements text,
  add column if not exists community_contribution text,
  add column if not exists future_vision text,
  add column if not exists website text,
  add column if not exists instagram text,
  add column if not exists facebook text,
  add column if not exists video_url text,
  add column if not exists reference_url text;

create index if not exists kurduwadi_directory_business_story_idx
  on public.kurduwadi_directory(status, category, founded_year);

drop policy if exists "community anon uploads allowed folders" on storage.objects;
create policy "community anon uploads allowed folders"
on storage.objects for insert to anon, authenticated
with check (
  bucket_id = 'community-images'
  and (storage.foldername(name))[1] = any(array['profiles','noticeboard','news','personalities','ideas','business'])
);
