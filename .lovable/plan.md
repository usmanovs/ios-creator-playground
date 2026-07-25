## Goal
Add a visual border/divider between the pre-class message section and the lessons list in each day column on the instructor schedule board, matching the existing divider between lessons and homework.

## Current state
In `src/pages/Instructor.tsx`, the `DayColumn` component currently renders:
- Day header
- Pre-class message 1
- Pre-class message 2
- Lessons list (`SortableContext`)
- Homework section (separated by `border-t border-border/60`)

There is no divider between the pre-class messages and the lessons list, so the sections visually run together.

## Changes
- In `src/pages/Instructor.tsx`, wrap the `SortableContext` lessons block with a top border matching the homework divider style.
- Add `mt-3 pt-3 border-t border-border/60` to the lessons container to create a consistent visual separator.
- Ensure spacing remains balanced so the lesson list does not feel cramped against the pre-class messages.

## Verification
- Build the project to confirm no syntax errors.
- Check the `/instructor` preview to confirm each day column shows a clear divider between pre-class messages and lessons.