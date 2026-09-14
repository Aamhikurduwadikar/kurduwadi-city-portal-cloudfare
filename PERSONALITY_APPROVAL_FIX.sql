-- KURDUWADI CITY PORTAL
-- PERSONALITY APPROVAL + PHOTO/CARD FIX
-- Fixes ambiguous RPC caused by both bigint and uuid overloads.

create extension if not exists pgcrypto;

-- Remove the conflicting UUID overload. Admin JS sends a numeric submission id (bigint).
drop function if exists public.approve_personality_submission(uuid);

-- Recreate the single, unambiguous RPC used by the Admin Panel.
drop function if exists public.approve_personality_submission(bigint);

create or replace function public.approve_personality_submission(submission_id bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  s public.personality_submissions%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  select * into s
  from public.personality_submissions
  where id = submission_id
    and status = 'pending'
  for update;

  if not found then
    raise exception 'Pending personality submission not found';
  end if;

  insert into public.personalities (
    name,
    photo_url,
    relation_to_kurduwadi,
    field,
    major_work,
    reference_url,
    contact,
    status,
    created_at,
    updated_at
  ) values (
    s.name,
    s.image_url,
    s.relation,
    s.field,
    s.reason,
    s.reference_url,
    s.contact,
    'approved',
    coalesce(s.created_at, now()),
    now()
  );

  update public.personality_submissions
  set status = 'approved'
  where id = submission_id;
end;
$$;

revoke all on function public.approve_personality_submission(bigint) from public;
grant execute on function public.approve_personality_submission(bigint) to authenticated;

-- Keep published personality cards readable by everyone.
alter table public.personalities enable row level security;
drop policy if exists personalities_public_approved on public.personalities;
create policy personalities_public_approved
on public.personalities for select
using (status = 'approved');

-- Helpful index for the public card grid.
create index if not exists personalities_status_created_idx
on public.personalities(status, created_at desc);

select 'PERSONALITY APPROVAL FIX SUCCESS' as result;
