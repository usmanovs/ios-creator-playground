DROP POLICY IF EXISTS "retro_items_update_auth_status_only" ON public.retro_items;
CREATE POLICY "retro_items_update_all" ON public.retro_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.retro_items TO anon, authenticated;