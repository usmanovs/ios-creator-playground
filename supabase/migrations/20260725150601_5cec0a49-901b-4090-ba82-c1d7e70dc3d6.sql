ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS schedule_order integer;
UPDATE public.lessons SET schedule_order = order_index WHERE schedule_order IS NULL;