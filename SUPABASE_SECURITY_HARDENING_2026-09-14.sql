-- Kurduwadi City Portal
-- Security hardening applied on 2026-09-14
-- Admin/security-definer RPCs must never be callable by anonymous visitors.
-- Authenticated callers are still required to pass the function-level is_admin() checks.

REVOKE EXECUTE ON FUNCTION public.admin_access_check() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_content_delete(text,text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_content_insert(text,jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_content_list(text,integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_content_update(text,text,jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_user_list() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_user_remove(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_user_set_role(uuid,text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.approve_business_card(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.approve_gallery_item(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.approve_personality_submission(bigint) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.approve_profile_edit_request(bigint) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.delete_gallery_item(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.reject_business_card(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.reject_gallery_item(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.set_business_card_status(uuid,text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.set_gallery_item_status(uuid,text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.admin_access_check() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_content_delete(text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_content_insert(text,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_content_list(text,integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_content_update(text,text,jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_user_list() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_user_remove(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_user_set_role(uuid,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_business_card(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_gallery_item(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_personality_submission(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_profile_edit_request(bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_gallery_item(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_business_card(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_gallery_item(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_business_card_status(uuid,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_gallery_item_status(uuid,text) TO authenticated;
