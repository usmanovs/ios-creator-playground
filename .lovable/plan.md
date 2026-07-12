## Goal
Show a sidebar on the Lesson page listing all chapters and lessons of the course, so users can navigate between lessons without going back.

## Changes

**1. New component: `src/components/CourseSidebar.tsx`**
- Props: `courseId`, `currentLessonId`
- Fetches course title, chapters (ordered), and published lessons (ordered) — same queries used in `Course.tsx`
- Renders chapters as collapsible groups (chapter containing the current lesson expanded by default) with lessons as `NavLink`s to `/lesson/:id`
- Highlights the active lesson
- Shows a small lesson-type icon (video / pdf / text)
- Includes a "Back to course" link at the top
- Uses shadcn `Sidebar` primitives (`Sidebar`, `SidebarContent`, `SidebarGroup`, `SidebarMenu`, etc.) with `collapsible="icon"` so it can collapse to a narrow rail

**2. Update `src/pages/Lesson.tsx`**
- Wrap page in `SidebarProvider` with a full-width flex layout: `<CourseSidebar>` on the left, lesson content on the right
- Add a `SidebarTrigger` in a small top bar of the content area so the sidebar can be toggled/reopened on all screen sizes
- Keep existing lesson rendering (video / pdf / text) unchanged; remove the standalone "Back to course" link (now in the sidebar)
- On mobile the shadcn sidebar auto-switches to an off-canvas drawer opened via the trigger

## Technical notes
- Data fetching in `CourseSidebar` mirrors `Course.tsx` queries (no schema changes)
- Active state via `useParams()` / comparison to `currentLessonId`
- No changes to routes, backend, or other pages