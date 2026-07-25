# Sticky formatting toolbar in lesson editor

When editing a lesson, the RichTextEditor toolbar scrolls out of view along with the content. Make it stick to the top of the scrollable dialog area so it's always accessible.

## Change

**`src/components/admin/RichTextEditor.tsx`**
- On the toolbar wrapper (currently `flex flex-wrap gap-1 p-2 border-b border-border`), add `sticky top-0 z-20 bg-card/95 backdrop-blur` so it pins to the top of the nearest scrolling ancestor (the dialog's scroll container in `LessonEditor`).
- Keep existing border-b so the divider remains visible while pinned.

No other files need changes — `LessonEditor.tsx` already uses `overflow-y-auto` on the grid wrapper, which acts as the sticky containing scroller.

## Verification
- Open a lesson in admin, scroll content down inside the dialog: toolbar stays visible at the top of the editor column.
