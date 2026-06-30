
-- Activity log
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  entity_label text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view activity" ON public.activity_log
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.log_activity(
  _action text, _entity_type text, _entity_id uuid, _entity_label text, _metadata jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, private, auth
AS $$
DECLARE _email text;
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  SELECT email INTO _email FROM auth.users WHERE id = auth.uid();
  INSERT INTO public.activity_log(actor_id, actor_email, action, entity_type, entity_id, entity_label, metadata)
  VALUES (auth.uid(), _email, _action, _entity_type, _entity_id, _entity_label, COALESCE(_metadata, '{}'::jsonb));
END;
$$;

-- Admin invites
CREATE EXTENSION IF NOT EXISTS citext;
CREATE TABLE public.admin_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL UNIQUE,
  invited_by uuid,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_invites TO authenticated;
GRANT ALL ON public.admin_invites TO service_role;
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage invites" ON public.admin_invites
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

-- Auto-promote invited users on signup (and keep first-admin bootstrap)
CREATE OR REPLACE FUNCTION public.accept_admin_invite()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_invites WHERE email = NEW.email AND accepted_at IS NULL) THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin')
      ON CONFLICT DO NOTHING;
    UPDATE public.admin_invites SET accepted_at = now() WHERE email = NEW.email;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_accept_invite ON auth.users;
CREATE TRIGGER on_auth_user_created_accept_invite
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.accept_admin_invite();

-- List admins RPC
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE(user_id uuid, email text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth
AS $$
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  RETURN QUERY
    SELECT ur.user_id, u.email::text, ur.created_at
    FROM public.user_roles ur
    JOIN auth.users u ON u.id = ur.user_id
    WHERE ur.role = 'admin'
    ORDER BY ur.created_at;
END;
$$;

-- Revoke admin RPC
CREATE OR REPLACE FUNCTION public.revoke_admin(target_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth
AS $$
DECLARE _count int; _email text;
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  SELECT count(*) INTO _count FROM public.user_roles WHERE role = 'admin';
  IF _count <= 1 THEN
    RAISE EXCEPTION 'cannot remove the last admin';
  END IF;
  SELECT email INTO _email FROM auth.users WHERE id = target_user_id;
  DELETE FROM public.user_roles WHERE user_id = target_user_id AND role = 'admin';
  PERFORM public.log_activity('role_revoke', 'role', target_user_id, _email, '{}'::jsonb);
END;
$$;
