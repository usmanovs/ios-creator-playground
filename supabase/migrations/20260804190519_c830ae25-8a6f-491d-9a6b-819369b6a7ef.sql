-- day_homework: restrict reads to authenticated
DROP POLICY IF EXISTS "Anyone can view homework" ON public.day_homework;
REVOKE SELECT ON public.day_homework FROM anon;
CREATE POLICY "Authenticated can view homework"
  ON public.day_homework FOR SELECT TO authenticated USING (true);

-- instructor_notes: restrict reads to authenticated
DROP POLICY IF EXISTS "Notes viewable by everyone" ON public.instructor_notes;
REVOKE SELECT ON public.instructor_notes FROM anon;
CREATE POLICY "Authenticated can view notes"
  ON public.instructor_notes FOR SELECT TO authenticated USING (true);

-- retro_items: ownership column
ALTER TABLE public.retro_items ADD COLUMN IF NOT EXISTS created_by uuid;

DROP POLICY IF EXISTS "retro_items_select_all" ON public.retro_items;
DROP POLICY IF EXISTS "retro_items_insert_all" ON public.retro_items;
DROP POLICY IF EXISTS "retro_items_update_all" ON public.retro_items;
DROP POLICY IF EXISTS "retro_items_delete_all" ON public.retro_items;

REVOKE ALL ON public.retro_items FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.retro_items TO authenticated;
GRANT ALL ON public.retro_items TO service_role;

CREATE POLICY "retro_items_select_authenticated"
  ON public.retro_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "retro_items_insert_own"
  ON public.retro_items FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());
CREATE POLICY "retro_items_update_own_or_admin"
  ON public.retro_items FOR UPDATE TO authenticated
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "retro_items_delete_own_or_admin"
  ON public.retro_items FOR DELETE TO authenticated
  USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- retro_votes: authenticated only, self voter_id
DROP POLICY IF EXISTS "retro_votes_select_all" ON public.retro_votes;
DROP POLICY IF EXISTS "retro_votes_insert_all" ON public.retro_votes;

REVOKE ALL ON public.retro_votes FROM anon;
GRANT SELECT, INSERT, DELETE ON public.retro_votes TO authenticated;
GRANT ALL ON public.retro_votes TO service_role;

CREATE POLICY "retro_votes_select_authenticated"
  ON public.retro_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "retro_votes_insert_own"
  ON public.retro_votes FOR INSERT TO authenticated
  WITH CHECK (voter_id = auth.uid()::text);
CREATE POLICY "retro_votes_delete_own"
  ON public.retro_votes FOR DELETE TO authenticated
  USING (voter_id = auth.uid()::text);