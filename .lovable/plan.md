## Goal

Make the KPI strip at the top of the Instructor page take less vertical space without removing any information or functionality.

## Current state

`src/pages/Instructor.tsx` has a 4-column KPI strip above the day columns:
- Course completed (large percentage + progress bar + sub-label)
- Items covered (large count / total + sub-label)
- Days completed (large count / total + next-class date)
- Day 1 date picker (label + button)

Each card uses `p-4` padding, `text-3xl` numbers, `mt-2` spacing, and a fairly tall progress bar.

## Changes

Update only the KPI strip markup in `src/pages/Instructor.tsx` (around lines 585–660):

- Reduce card padding from `p-4` to `p-3`.
- Reduce grid gap from `gap-3` to `gap-2`.
- Shrink large numbers from `text-3xl` to `text-2xl`.
- Shrink the progress bar from `h-2` to `h-1.5`.
- Tighten vertical margins: sub-labels become `mt-1` and helper text uses `text-[11px]` consistently.
- Keep the date picker button compact (`size="sm"` remains).
- Preserve all existing logic, icons, and text content.

No other files, components, or data logic are touched.

## Verification

After the change, the KPI strip should still show the same four items with the same numbers and date picker, but with noticeably less vertical height.