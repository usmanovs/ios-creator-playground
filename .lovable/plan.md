## Goal

Add to the Instructor board:
1. A KPI strip at the top showing overall course progress.
2. A Day 1 date picker; dates for Days 2–7 are computed automatically on a Monday/Wednesday/Friday cadence.

## 1. KPI strip

A row of compact stat cards above the day columns:

- **Course completed %** — share of all schedule items (lessons + notes assigned to a day) marked "covered". Big number + progress bar.
- **Items covered** — e.g. "24 / 61".
- **Days completed** — e.g. "2 / 7" from the existing per-day "Done" toggle.
- **Next class** — the date of the first not-completed day (once a start date is set).

## 2. Day 1 date + MWF schedule

- A "Day 1 date" picker sits in the KPI strip.
- Given the Day 1 date, each following class day is the next date that falls on Monday, Wednesday, or Friday. Example: Day 1 = Fri Jul 24 → Mon Jul 27, Wed Jul 29, Fri Jul 31, Mon Aug 3, Wed Aug 5, Fri Aug 7.
- If the chosen Day 1 date is not a Mon/Wed/Fri, it is still honored as-is for Day 1 and the following days snap to the MWF cadence (a small hint notes this).
- Each day column header shows its computed date (e.g. "Day 3 · Wed, Jul 29"), and today's class day is highlighted.

## Technical notes

- Store the start date on the existing `courses` row as a new `start_date` column (date, nullable) via a migration, so it is shared across devices/admins rather than living in one browser's storage.
- Date math is a small pure helper (`src/lib/schedule.ts`): `classDates(day1: Date, count: number)` walking forward and keeping only weekdays 1/3/5.
- KPI values are derived from state already loaded in `src/pages/Instructor.tsx` (`lessons`, `notes`, `completed`) — no extra queries.
- Styling reuses existing `glass-card` tokens; no new colors.
