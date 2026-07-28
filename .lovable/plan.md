## Goal
Add instructor-only notes (e.g. "Demo MVP #1 using a mirroring app, not Zoom screenshare") that sit in the day columns of the Instructor board exactly like lesson rows — same size, same drag handle, same checkbox — just color-coded so they're visually distinct. They never appear on the course page, sidebar, or student lesson view.

## Approach
New `instructor_notes` table, so notes can never leak into student-facing queries.

### Database
`public.instructor_notes`:
- `title` (text) — the note text, shown like a lesson title
- `day_number` (nullable smallint; null = Unassigned column)
- `schedule_order` (int)
- `covered` (boolean, default false) — so the checkbox works like lessons
- id / created_at / updated_at with update trigger
- Grants + RLS: anyone can read; only admins can create, edit, delete.

### Instructor page (`src/pages/Instructor.tsx`)
- Fetch notes with lessons and merge them into each day column's item list, sorted together by `schedule_order`.
- Render a note with the same row layout as a lesson: drag handle, covered checkbox, title text, and a "Note" tag where the chapter label sits.
- Color coding: amber/warning accent — tinted background, amber left edge and border, amber "Note" tag — versus the current neutral lesson card. Colors added as semantic tokens in `index.css` / `tailwind.config.ts`, no hardcoded values.
- Click the note title to edit it inline (click-to-edit / blur-to-save, matching the homework field pattern); trash icon to delete.
- Notes participate in the existing drag-and-drop, including cross-day moves and the "drop at top" zones, so a note can sit between any two lessons.
- "Add note" button in each day column header.

### Nothing else changes
Course page, course sidebar, and the lesson page read from `lessons` only, so notes stay invisible to students by construction.
