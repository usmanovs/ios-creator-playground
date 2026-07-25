## Problem

The admin course editor and the instructor class schedule both sort lessons by the same `lessons.order_index` column. So dragging to reorder in Admin reshuffles lessons in Instructor (and vice versa).

## Fix

Give the instructor view its own independent ordering column.

### Database
- Add `lessons.schedule_order` (integer, nullable) — the per-day ordering used only by the instructor schedule.
- Backfill it from the current `order_index` so existing days keep their current order.

### Instructor page (`src/pages/Instructor.tsx`)
- Load lessons ordered by `schedule_order` (fallback `order_index` when null).
- On drag end / reorder, write to `schedule_order` only. Never touch `order_index` or `day_number`... wait — day_number still needs updating on cross-day drops; keep that. Only `order_index` writes are removed and replaced with `schedule_order`.

### Admin page
- No changes. Continues to use `order_index` for course/chapter ordering.

### Result
- Reordering in Admin changes only the course-view order.
- Reordering in Instructor changes only the schedule order.
- Moving a lesson between days in Instructor still updates `day_number` as today.
