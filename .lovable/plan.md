## Goal
On the Instructor Kanban page, show each lesson's chapter on the right side, aligned on the same row as the lesson title (instead of beneath it).

## Change
In `src/pages/Instructor.tsx`, `LessonCard`:
- Replace the current two-line layout (title on line 1, chapter + draft badge on line 2) with a single-row flex layout.
- Left: lesson title (truncates, still gets strikethrough when covered).
- Right (same row): chapter name in small muted text (`text-[11px] text-foreground/50`, truncates, shrink allowed), followed by the "draft" badge if applicable.
- Preview eye button stays at the far right, unchanged.

No changes to data, drag/drop, covered checkbox, or any other component.
