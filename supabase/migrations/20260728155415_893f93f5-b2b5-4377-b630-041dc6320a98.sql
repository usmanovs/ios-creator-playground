CREATE TABLE public.instructor_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  day_number smallint,
  schedule_order integer NOT NULL DEFAULT 0,
  covered boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.instructor_notes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.instructor_notes TO authenticated;
GRANT ALL ON public.instructor_notes TO service_role;

ALTER TABLE public.instructor_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notes viewable by everyone" ON public.instructor_notes
FOR SELECT USING (true);

CREATE POLICY "Admins manage notes" ON public.instructor_notes
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_instructor_notes_updated_at
BEFORE UPDATE ON public.instructor_notes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();