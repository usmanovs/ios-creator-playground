## Goal
Make lesson-to-lesson navigation feel seamless by adding a visible loading state that only affects the main content area, while the sidebar and header remain fully mounted.

## What will be built

1. **Navigation-aware loading state in `src/pages/Lesson.tsx`**
   - Detect when `lessonId` changes while `isFetching` is true (React Query's `isFetching` is true on any refetch, but we only show the indicator when the route `lessonId` differs from the currently rendered lesson's `id` or when `isLoading` is false but `isFetching` is true).
   - Keep the existing `isLoading && !lesson` skeleton for first-visit cold loads.
   - During subsequent navigations, render a slim animated progress bar at the top of the content area and slightly dim the outgoing content so users know a transition is happening.
   - Once the new lesson data arrives, swap the content normally.

2. **Preserve mounted layout**
   - `SidebarProvider`, `CourseSidebar`, and the sticky header (`SidebarTrigger`) will not be re-rendered or unmounted when `lessonId` changes.
   - The sidebar will continue to show the course tree and highlight the active lesson via `currentLessonId`.

3. **React Query configuration remains the same**
   - Keep `staleTime: 5 * 60 * 1000` and `prefetchQuery` for previous/next neighbors.
   - The smooth indicator only complements the existing prefetch; prefetched lessons will still swap instantly, and non-prefetched lessons will show the gentle indicator.

## What this achieves

- No full-page reloads or full-page skeleton flashes when switching lessons.
- Sidebar and header stay in place; only the lesson content area gives feedback.
- Users get clear, non-jarring visual feedback that the next lesson is loading.
- Navigation between prefetched lessons remains instantaneous.

## Files to edit
- `src/pages/Lesson.tsx` — add `isFetching` and conditional navigation indicator.
- `src/components/ui/skeleton.tsx` or a small inline styled bar in `Lesson.tsx` — no new component needed if we use a simple Tailwind-animate progress bar.

## No changes to
- `CourseSidebar.tsx` (remains mounted and unchanged).
- Data fetching logic (`fetchLesson`, `fetchCourseNav`, prefetching).
- React Query keys and caching behavior.