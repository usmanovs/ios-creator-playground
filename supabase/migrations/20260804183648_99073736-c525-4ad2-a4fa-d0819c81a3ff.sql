GRANT DELETE ON public.retro_items TO anon, authenticated;

CREATE POLICY "retro_items_delete_all"
  ON public.retro_items
  FOR DELETE
  TO anon, authenticated
  USING (true);