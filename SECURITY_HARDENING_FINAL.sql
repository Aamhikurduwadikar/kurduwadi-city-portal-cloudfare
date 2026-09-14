-- Security hardening for admin RPCs and foreign-key indexes.
-- Admin RPCs must not be callable by anonymous users.
revoke execute on function public.admin_access_check() from anon;
revoke execute on function public.is_admin() from anon;
revoke execute on function public.approve_business_card(uuid) from anon;
revoke execute on function public.reject_business_card(uuid) from anon;
revoke execute on function public.approve_gallery_item(uuid) from anon;
revoke execute on function public.reject_gallery_item(uuid) from anon;
revoke execute on function public.delete_gallery_item(uuid) from anon;
revoke execute on function public.approve_personality_submission(bigint) from anon;
revoke execute on function public.set_business_card_status(uuid,text) from anon;
revoke execute on function public.set_gallery_item_status(uuid,text) from anon;

create index if not exists business_cards_user_id_idx
  on public.business_cards(user_id);

create index if not exists gallery_items_submitted_by_idx
  on public.gallery_items(submitted_by);
