-- Atomic increment functions for view and download counters
CREATE OR REPLACE FUNCTION public.increment_note_views(note_id uuid)
RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  UPDATE public.notes SET views = COALESCE(views, 0) + 1 WHERE id = note_id;
$$;

CREATE OR REPLACE FUNCTION public.increment_note_downloads(note_id uuid)
RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  UPDATE public.notes SET downloads = COALESCE(downloads, 0) + 1 WHERE id = note_id;
$$;

GRANT EXECUTE ON FUNCTION public.increment_note_views(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_note_downloads(uuid) TO anon, authenticated;