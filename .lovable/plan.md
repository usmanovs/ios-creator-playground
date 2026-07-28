## Goal

On the instructor board (`/instructor`), when a day is marked **Done**, it should shrink to a slim collapsed card and move out of the way so the remaining (upcoming) days shift up into view.

## Behavior

1. **Auto-collapse on complete** — clicking "Complete" collapses that day's card immediately; un-marking it expands it again.
2. **Collapsed card shows a compact summary only**: `Day N`, its date, a green "Done" badge, item count, and a chevron. Pre-class messages, lesson list, and homework are hidden.
3. **Manual override** — clicking the collapsed card's header (or chevron) expands it back for review without changing its Done status. Expanding a completed day is remembered per day for the session.
4. **Completed days move to the end** — the grid renders incomplete days first (in Day order), then completed days (in Day order), then Unassigned. So the next class day is always top-left.
5. **Drag-and-drop stays intact** — a collapsed day still accepts drops; dropping onto it auto-expands it so you can see where the item landed.

```text
Before                          After Day 1 & 2 completed
[Day1 full][Day2 full][Day3]    [Day3 full][Day4 full][Day5 full]
[Day4    ][Day5    ][Day6]      [Day6 full][Day7 full][Unassigned]
[Day7    ][Unassigned  ]        [Day1 ✓ collapsed][Day2 ✓ collapsed]
```

## Technical notes

All changes are in `src/pages/Instructor.tsx` (presentation only — no schema or data changes):

- Add `collapsedOverride: Record<number, boolean>` state; effective collapsed = `completed[d] && !collapsedOverride[d]`.
- Pass `collapsed` + `onToggleCollapsed` into `DayColumn`; when `collapsed`, render only the header row (plus the droppable ref so drops still register) and skip `PreClassField`, the sortable list, and `HomeworkField`.
- Reduce `min-h-[300px]` to `min-h-0` for collapsed cards so the grid reflows tightly.
- Sort the `DAYS.map` render order by `completed` flag before mapping, keeping the same `DayColumn` props.
- In `onDragEnd` (and on `isOver`), clear the override for the target day so a collapsed completed day opens when something is dropped into it.
