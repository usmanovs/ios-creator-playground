## Goal

Make the two pre-class message areas on the Instructor schedule page more spacious, and clearly show when a message has been saved rather than leaving it looking like an active text input.

## What will change

1. **More room for each pre-class message**
  - Increase the minimum height of the pre-class message 1 and 2 textareas from `80px` to `140px`.
  - Add a bit more vertical spacing between the two message blocks and the lessons list so they don't feel cramped.
2. **Clear "saved" state**
  - After a message is saved, switch from the textarea to a read-only preview card that shows the formatted text (preserving line breaks).
  - Add a small **Edit** button on the preview card so the instructor can switch back to the textarea when they want to make changes.
  - While the message is in edit mode, the textarea will still auto-save on change after the existing 600ms debounce.
3. **Save status feedback**
  - Keep the "Saving…" indicator only during the save request, then replace it with a brief "Saved" checkmark before returning to the read-only preview.

## Files to edit

- `src/pages/Instructor.tsx` — the `DayColumn` component and its state for pre-class messages.

## Optional follow-up

If you want the textareas to auto-grow as you type, or the read-only preview to render Markdown, just let me know and I can add that next. yes do it!

&nbsp;