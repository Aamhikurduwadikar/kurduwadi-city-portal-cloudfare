-- Kurduwadi City Portal: Digital Business Card approval/rejection
create or replace function public.approve_business_card(card_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Login required'; end if;
  if not public.is_admin() then raise exception 'Not authorized'; end if;
  update public.business_cards
  set status='approved', updated_at=now()
  where id=card_id and status='pending';
  if not found then raise exception 'Pending business card not found'; end if;
end;
$$;

create or replace function public.reject_business_card(card_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Login required'; end if;
  if not public.is_admin() then raise exception 'Not authorized'; end if;
  update public.business_cards
  set status='rejected', updated_at=now()
  where id=card_id and status='pending';
  if not found then raise exception 'Pending business card not found'; end if;
end;
$$;

revoke all on function public.approve_business_card(uuid) from public;
revoke all on function public.reject_business_card(uuid) from public;
grant execute on function public.approve_business_card(uuid) to authenticated;
grant execute on function public.reject_business_card(uuid) to authenticated;

alter table public.business_cards enable row level security;
drop policy if exists business_cards_public_approved on public.business_cards;
create policy business_cards_public_approved on public.business_cards
for select using (status='approved');

drop policy if exists business_cards_owner_insert on public.business_cards;
create policy business_cards_owner_insert on public.business_cards
for insert with check (auth.uid()=user_id or user_id is null);

drop policy if exists admin_business_cards on public.business_cards;
create policy admin_business_cards on public.business_cards
for all using (public.is_admin()) with check (public.is_admin());

select 'BUSINESS CARD APPROVE + REJECT SUCCESS' as result;
