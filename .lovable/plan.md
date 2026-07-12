## Goal
Navigating between lessons should feel instant — no full-page flash, sidebar stays mounted, only the lesson content swaps.

## Root cause
`Lesson.tsx` mounts `SidebarProvider` + `CourseSidebar` per route, and returns an early `Loading...` view that replaces the whole layout on every navigation. `CourseSidebar` also refetches chapters/lessons each time.

## Changes

**1. New route layout `src/pages/CourseLayout.tsx`**
- Reads `:courseId` from URL (route `/course/:courseId`) or derives it from the current lesson
- Renders `SidebarProvider` + `CourseSidebar` + header with `SidebarTrigger` once
- Renders `<Outlet />` for the child route (course overview or lesson)
- Fetches chapters/lessons once here and passes them to `CourseSidebar` via props (or context) so sidebar doesn't refetch per lesson

**2. Restructure routes in `src/App.tsx`**
```
/course/:courseId            → CourseLayout → Course (index)
/course/:courseId/lesson/:id → CourseLayout → Lesson
```
Keep legacy `/lesson/:lessonId` redirecting to the nested path (look up course_id) so existing links keep working.

**3. Simplify `src/pages/Lesson.tsx`**
- Remove `SidebarProvider`, sidebar, header — layout handles those
- Replace full-page "Loading..." with an inline skeleton in the content area only, so the sidebar and header remain visible during fetch
- Use React Query (`useQuery` keyed by lessonId) for caching — revisiting a lesson is instant

**4. Simplify `src/pages/Course.tsx`**
- Remove its own page chrome/background wrapper; render inside the shared layout
- Reuse the same chapters/lessons data via React Query (same key as sidebar) to avoid duplicate fetches

**5. `CourseSidebar`**
- Accept optional `chapters`/`lessons` props from layout; fall back to its own React Query fetch keyed by courseId
- No behavior change otherwise

## Technical notes
- React Query cache means the sidebar data survives navigation and lesson content is cached per id
- No schema/backend changes
- `aurora-bg` moves into the layout so the background doesn't repaint between routes