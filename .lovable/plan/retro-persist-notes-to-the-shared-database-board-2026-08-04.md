# Retro — Persist notes to the shared database board

## Problem
The `/retro` page keeps notes in local component state only, so a page refresh wipes everything — the "What to improve" item disappeared because of this. The database already has a `retro_items` table (shared board, public insert + select), but the page isn't using it.

## Goal
Wire `/retro` to the existing `retro_items` table so notes survive refreshes and everyone shares one board, matching the user's "shared board" choice. Keep the page simple (no voting, no per-user split).

## Database change (migration)
The `retro_items` table currently denies DELETE. The current UI has a hover-to-remove (X) button, so add a delete capability so removes persist too.

- Add a DELETE policy on `public.retro_items` allowing anyone (shared board) to remove a note:
  `CREATE POLICY "retro_items_delete_all" ON public.retro_items FOR DELETE TO anon, authenticated USING (true);`
- Grant DELETE to anon and authenticated (required for the Data API to allow it):
  `GRANT DELETE ON public.retro_items TO anon, authenticated;`
- No new tables. `retro_votes` is left untouched and unused (out of scope for the simple board).

### retro_items schema (existing, unchanged)
- `id uuid`, `category text` (will use `'well'` / `'improve'`), `content text`, `author text` (nullable, left null for the simple board), `status text default 'open'`, `created_at timestamptz`.

## Code change — `src/pages/Retro.tsx`
Replace local-state logic with Supabase reads/writes against `retro_items`:

- On mount, `select id, category, content from retro_items order by created_at desc` and split into `well` / `improve` by `category`.
- Add (Enter or + button): `insert into retro_items (category, content)` with `category` = `'well'` or `'improve'` and `content` = trimmed draft. On success, prepend to the matching column's state (optimistic or after insert — use insert-then-update state).
- Remove (X): `delete from retro_items where id = ?`, then filter out of state.
- Keep the existing KPI strip and split bar — they already derive from `well`/`improve` arrays, so they'll reflect DB data automatically.
- Use the existing Supabase client: `import { supabase } from "@/integrations/supabase/client"`.
- Use `useEffect` for the initial load and `useState` for the two arrays. Show a subtle loading state (skeleton or muted "Loading…") while fetching.
- `Column` component stays as-is (it takes `items`, `onAdd`, `onRemove`).

```text
mount → fetch retro_items → split by category → render
add   → insert row → update local state
remove→ delete row  → update local state
KPI strip ← well[] / improve[]  (unchanged derivation)
```

## Files
- `supabase--migration` — DELETE policy + grants on `retro_items`.
- `src/pages/Retro.tsx` — swap local state for Supabase read/insert/delete.

## Verification
- `/retro` loads existing notes from the DB (empty initially).
- Add a "What to improve" note, refresh the page → note persists.
- Remove a note → it's gone after refresh.
- KPI strip + split bar update live from DB-backed data.
