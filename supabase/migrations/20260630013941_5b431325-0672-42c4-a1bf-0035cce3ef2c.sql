
REVOKE EXECUTE ON FUNCTION public.log_activity(text, text, uuid, text, jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.list_admins() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.revoke_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.accept_admin_invite() FROM PUBLIC, anon, authenticated;
-- Keep these existing ones tightened too
REVOKE EXECUTE ON FUNCTION public.bootstrap_first_admin() FROM PUBLIC, anon, authenticated;
