
## What "retro" means here

The reference repo's `retro` page is a **retrospective feedback board**, not a vintage aesthetic. Attendees post two kinds of notes — "what went well" and "what to improve" — vote on each other's notes, and admins move improvement items across a status pipeline (open → planned → in progress → done). I'll port that feature to this project, matching the current site's aurora/glass look so it feels native rather than pasted-in.

## Route & scope

- New standalone route at **`/retro`**, registered in `src/App.tsx`.
- Existing pages, nav, and homepage untouched.
- Bilingual (EN/RU) via the existing `LanguageContext` — new keys added there.

## Page structure

```text
┌──────────────────────────────────────────────┐
│ Header: back-to-home · logo · share · EN/RU  │
├──────────────────────────────────────────────┤
│ Hero: badge, title, subtitle, 3 stat cards   │
│       (Ideas / Wins / Improvements)          │
├──────────────────────────────────────────────┤
│ Submission form (category · name · content)  │
├─────────────────────┬────────────────────────┤
│ ✅ What went well   │ 💡 What to improve     │
│  · upvote button    │  · upvote button       │
│  · content + author │  · status chip + select│
│  · vote count       │  · content + author    │
└─────────────────────┴────────────────────────┘
```

- Voting: one vote per browser (anonymous voter id in `localStorage`), optimistic UI with rollback on error.
- Status pipeline (improvement column only): `open | planned | in_progress | done`, changeable via a dropdown on each card. Everyone can change status for now — mirrors the reference. If you want it admin-only, say so and I'll gate it behind `useAuthUser` + the existing admin role check.
- Sorting: by vote count desc, then newest.
- Sharing: "Share" button copies the `/retro` URL (Web Share API when available, clipboard fallback).

## Backend (Lovable Cloud)

Two new tables in one migration, with grants and RLS:

- `retro_items(id uuid pk, category text check in ('well','improve'), content text, author text null, status text check in ('open','planned','in_progress','done') default 'open', created_at timestamptz default now())`
- `retro_votes(id uuid pk, item_id uuid fk → retro_items on delete cascade, voter_id text, created_at timestamptz default now(), unique(item_id, voter_id))`

Policies:
- `retro_items`: anyone (anon + authenticated) can `SELECT` and `INSERT`; only authenticated can `UPDATE` status (simple bar to avoid drive-by tampering). No delete from the client.
- `retro_votes`: anyone can `SELECT` and `INSERT`; the unique constraint prevents double-voting per browser.
- Grants written per the project's grant rules (anon read+insert on items/votes; authenticated for updates; service_role all).

## Design

Reuse the existing tokens (`--background`, `--card`, `--primary` violet, `--accent` green) and glass utilities from `index.css` so the page matches the site — glass cards, aurora background, Space Grotesk display font. No new palette. The reference's "mint/amber" accents map to the project's existing `accent` (green) and a soft amber for "in progress" chips only.

## Files

- **New**: `src/pages/Retro.tsx`, `supabase/migrations/<ts>_retro.sql`
- **Edited**: `src/App.tsx` (add `<Route path="/retro">`), `src/contexts/LanguageContext.tsx` (EN/RU strings for hero, form, columns, statuses, empty states, share)

## Out of scope (ask if you want them)

- Admin-only status control
- Realtime updates (currently reloads after submit; can add Supabase realtime if needed)
- Adding a link to `/retro` in the main navbar (kept standalone per your answer)
