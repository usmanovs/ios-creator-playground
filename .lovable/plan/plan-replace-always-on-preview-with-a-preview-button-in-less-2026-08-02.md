# Plan: Replace always-on preview with a preview button in Lesson Editor

## Goal
The lesson editor modal currently splits its width 50/50 between the edit form (left) and a live `LessonPreview` panel (right). The preview takes up half the modal but adds little value while editing. Remove the always-visible preview and make the form full-width, then expose the same preview on demand via a button.

## Changes

### `src/components/admin/LessonEditor.tsx`
- Change the content grid from `md:grid-cols-2` to a single full-width column so the edit form gets the full modal width.
- Remove the inline `<LessonPreview .../>` render block from the right column.
- Add a **Preview** button to the `DialogHeader` (next to the existing "Next lesson →" button) that toggles a `showPreview` state.
- When `showPreview` is true, render the existing `LessonPreview` component in a lightweight overlay/panel (reuse it as-is, no changes to `LessonPreview.tsx`). Use a simple full-cover overlay inside the modal so the user can review the rendered lesson and close it to return to editing.
- Keep the "Next lesson →" button position unchanged.

### `src/components/admin/LessonPreview.tsx`
- No changes needed; reused as-is.

## Result
- Editor form becomes full-width, giving more room for the rich text editor and fields.
- Preview is available on demand via a header button instead of being permanently rendered.
