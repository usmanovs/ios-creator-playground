## Plan

1. **Make day lesson areas the active drop targets**
   - Put the droppable ref on the lessons list area inside each day, not only the full day card.
   - Keep the day card highlight behavior, but make insertion target detection more precise.

2. **Fix top-of-day insertion**
   - Update drag-end logic so dropping over the first lesson in Day 2 inserts before it.
   - If the pointer is over the Day 2 empty/list area itself, append to the end as before.

3. **Improve collision detection for nested schedule items**
   - Prefer actual lesson item collisions for ordering.
   - Fall back to the day column/list only when no lesson item is under the pointer.

4. **Verify the reported case**
   - Test dragging `#BeLikeImanbek` into Day 2 at the top and confirm it saves with the correct Day 2 `schedule_order`.

## Technical notes

The current instructor schedule uses `@dnd-kit` with one droppable per day column and sortable lesson items. The fix will stay in `src/pages/Instructor.tsx` and only change the instructor board drag/drop behavior.