ALTER TABLE public.retro_items DROP CONSTRAINT IF EXISTS retro_items_status_check;
UPDATE public.retro_items SET status = 'todo' WHERE status NOT IN ('todo','in_progress','accomplished');
ALTER TABLE public.retro_items ALTER COLUMN status SET DEFAULT 'todo';
ALTER TABLE public.retro_items ADD CONSTRAINT retro_items_status_check CHECK (status IN ('todo','in_progress','accomplished'));