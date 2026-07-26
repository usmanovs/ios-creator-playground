
CREATE TABLE public.retro_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('well','improve')),
  content text NOT NULL CHECK (length(content) BETWEEN 2 AND 500),
  author text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','planned','in_progress','done')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.retro_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.retro_items(id) ON DELETE CASCADE,
  voter_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (item_id, voter_id)
);

CREATE INDEX retro_votes_item_id_idx ON public.retro_votes(item_id);
CREATE INDEX retro_items_created_at_idx ON public.retro_items(created_at DESC);

GRANT SELECT, INSERT ON public.retro_items TO anon;
GRANT SELECT, INSERT, UPDATE ON public.retro_items TO authenticated;
GRANT ALL ON public.retro_items TO service_role;

GRANT SELECT, INSERT ON public.retro_votes TO anon;
GRANT SELECT, INSERT ON public.retro_votes TO authenticated;
GRANT ALL ON public.retro_votes TO service_role;

ALTER TABLE public.retro_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retro_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "retro_items_select_all" ON public.retro_items FOR SELECT USING (true);
CREATE POLICY "retro_items_insert_all" ON public.retro_items FOR INSERT WITH CHECK (true);
CREATE POLICY "retro_items_update_auth_status_only" ON public.retro_items
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "retro_votes_select_all" ON public.retro_votes FOR SELECT USING (true);
CREATE POLICY "retro_votes_insert_all" ON public.retro_votes FOR INSERT WITH CHECK (true);
