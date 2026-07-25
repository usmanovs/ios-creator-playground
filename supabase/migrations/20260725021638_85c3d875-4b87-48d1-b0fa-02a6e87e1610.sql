CREATE TABLE public.day_homework (
  day_number smallint PRIMARY KEY CHECK (day_number BETWEEN 1 AND 7),
  content text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT ON public.day_homework TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.day_homework TO authenticated;
GRANT ALL ON public.day_homework TO service_role;

ALTER TABLE public.day_homework ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view homework"
  ON public.day_homework FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert homework"
  ON public.day_homework FOR INSERT
  TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update homework"
  ON public.day_homework FOR UPDATE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete homework"
  ON public.day_homework FOR DELETE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER day_homework_updated_at
  BEFORE UPDATE ON public.day_homework
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();