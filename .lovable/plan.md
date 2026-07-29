## Goal

Make dragging a lesson from one chapter to another on `/admin` feel smooth and predictable: you see exactly where the lesson will land while dragging, instead of only finding out after you drop.

## What changes

1. **Live preview while dragging.** Today items only move on drop, so cross-chapter drags feel like a guess. Add an `onDragOver` handler that moves the dragged lesson into the hovered chapter's list in local state as you hover, so the target list opens a gap and the source list closes up in real time.

2. **Floating drag preview.** Add a `DragOverlay` that renders the lesson row (and chapter card) following the cursor, instead of the current "ghost at 50% opacity stuck in place". Original row renders as a faint placeholder gap.

3. **Save once, on drop.** With the live preview handling visuals, `onDragEnd` only persists the final result. Replace the current sequential per-row `await supabase.update(...)` loop with a single batched `upsert` of the touched rows, so the board doesn't stutter after drop. Keep the existing rollback-on-error behavior.

4. **Collapsed chapters.** Hovering a collapsed chapter for a moment auto-expands it so you can drop at a precise position rather than only appending to the end.

5. **Motion polish.** Enable dnd-kit's auto-scroll with a gentler threshold for long chapter lists, add a `dropAnimation` so the card settles into place, and keep sortable transitions on so neighbors slide rather than jump.

## Technical notes

All changes are in `src/pages/Admin.tsx`, `src/components/admin/SortableChapter.tsx`, and `src/components/admin/SortableLesson.tsx` (presentation/interaction only, no schema change):

- `Admin.tsx`: add `activeDrag` state, `onDragStart`/`onDragOver`/`onDragCancel` to `DndContext`; `onDragOver` computes target chapter + index using the existing `collisionDetection` output and updates `lessons` optimistically (chapter_id + order_index) without touching the DB. Keep a snapshot of `lessons` at drag start for cancel/rollback.
- `moveLesson` is split: a pure `computeMove(lessons, lessonId, toChapterId, toIndex)` used by both `onDragOver` and `onDragEnd`, plus a `persistMove` that diffs against the drag-start snapshot and does one `supabase.from("lessons").upsert(rows)`.
- `SortableLesson.tsx`: extract the row markup so the same visual can render inside `DragOverlay`; use `isDragging ? opacity-30 border-dashed` for the placeholder.
- `SortableChapter.tsx`: on `isOver` while collapsed, start a ~500ms timer that calls `setOpen(true)`; clear on leave.
