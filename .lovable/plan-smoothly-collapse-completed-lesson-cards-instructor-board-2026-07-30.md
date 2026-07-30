# Smoothly collapse completed lesson cards (Instructor board)

## Goal
On the Instructor class-schedule board, when a lesson/note checkbox is clicked to mark it **covered**, the card should **smoothly animate closed** (~450ms) and then **disappear from the day column**. A second click can't accidentally toggle it back off because the card is animating away. Covered items can still be un-checked later via a small "covered" reveal toggle at the bottom of each day.

## Current state (verified)
- `src/pages/Instructor.tsx` `CoveredCheckbox` toggles `covered` via `onToggleCovered(id, kind)` → `toggleCovered` (lines 248–270) optimistically flips state and persists to Supabase.
- `DayColumn` renders every item in a single sortable list (`items.map` → `SortableItem`, lines 1037–1047); covered items stay in the list, just styled `line-through` / emerald tint.
- There is no exit animation and no "covered" reveal section.

## Changes (all in `src/pages/Instructor.tsx`)

### 1. Split day items into active / covered in `DayColumn`
- Derive `activeItems = items.filter(i => !i.covered)` and `coveredItems = items.filter(i => i.covered)`.
- The `SortableContext` keeps using the **full** `items` list (so drag IDs stay stable), but render active items in the main list and covered items only inside the reveal section.

### 2. Exit animation for cards being checked
- Add `exitingIds` state (a `Set<string>`) in `DayColumn`.
- Wrap each active card in a new `AnimatedCard` component that detects `covered` going `false → true` (compare to a ref). On that transition it adds an `exiting` class and calls back `onExitStart(id)` to add the id to `exitingIds` (so the card stays mounted and animating instead of vanishing instantly).
- The `exiting` state animates with the `grid-template-rows: 1fr → 0fr` technique (no height measuring needed) plus `opacity → 0`, over `duration-500 ease-in-out`. Inner element `overflow-hidden`.
- On `onTransitionEnd`, call `onExitDone(id)` to remove the id from `exitingIds`. The card is now excluded from `activeItems` (it's covered) and so disappears from the main list — it now lives only in the hidden `coveredItems` reveal section.
- Active-list render filter: `activeItems = items.filter(i => !i.covered || exitingIds.has(i.id))`. A covered-but-exiting card keeps rendering (with exit animation) until its animation finishes.

### 3. "Covered" reveal toggle at the bottom of each day column
- When `coveredItems.length > 0`, render a small footer button: `✓ {n} covered` (emerald, subtle). Clicking toggles local `showCovered` state.
- When expanded, render `coveredItems` in a bordered, dimmed list (opacity-60, line-through). Each still has its `CoveredCheckbox` so the instructor can uncheck to restore the item.
- Unchecking a covered item: it animates back into the active list (a brief fade/slide-in on mount via the same `AnimatedCard` enter animation, ~250ms) — opposite direction, no double-click risk.

### 4. Re-enter animation
- `AnimatedCard` also plays a short enter animation on mount (opacity 0 → 1, slight translateY) `duration-300`, so items returning from the covered section slide back in smoothly.

### 5. Keep counts accurate
- The day header count badge (line 1107) currently shows `items.length`. Keep it as total items (active + covered) so it doesn't jump confusingly during the exit animation; the new "✓ n covered" footer conveys the split.

## Edge cases
- Drag-and-drop: `SortableContext` items list stays the full `items`, so dragging IDs/positions remain valid. Covered items are not draggable in the reveal section (wrap them plainly, no `useSortable`), avoiding sort conflicts.
- Completed-day auto-collapse (lines 716–719) is unaffected; when a day is completed and collapses, covered items are already hidden inside it.
- `toggleCompleted` bulk-sets `covered` on all day items (lines 222–224) — those cards animate out together; the `exitingIds` approach handles many simultaneous exits fine.

## Non-goals
- No database/schema changes (covered already persists).
- No changes to the student-facing course page or Admin page.

## Files changed
- `src/pages/Instructor.tsx` only.
