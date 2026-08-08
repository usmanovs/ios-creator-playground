# Reset the instructor board for a new batch

Add a **Reset for new batch** action to the Instructor board that clears all progress marks so the same schedule can be reused with a new group of students.

## What it does

- Unmarks every lesson as covered
- Unmarks every instructor note as covered
- Marks all 7 class days as not completed, so all day columns expand again
- Keeps everything else untouched: homework text, both pre-class messages, Day 1 / class dates, lesson content and ordering, and past student progress

## Where it lives

A small outlined button with a rotate icon in the Instructor page header, next to the existing controls. Clicking it opens a confirmation dialog ("Reset board for a new batch?" with a short note that covered marks and completed days will be cleared and homework/messages will be kept). Only the confirm action performs the reset.

## Technical notes

- `src/pages/Instructor.tsx`: add a `resetBoard` callback that runs three updates — `lessons.covered = false` for the current course, `instructor_notes.covered = false`, and `day_homework.completed = false` for all days — then resets the local `completed`, `sortCompleted`, and `expandedOverride` state and clears covered flags on the in-memory lesson/note lists.
- Reuse the existing `src/components/admin/ConfirmDialog.tsx` for the confirmation step.
- Show a success toast on completion and an error toast with a refetch on failure.
- No database schema change is needed; existing admin RLS policies already allow these updates.
