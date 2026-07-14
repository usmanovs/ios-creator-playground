## Plan: Progress indicators for course takers

Add motivational progress indicators to the course page, plus a way for learners to mark lessons as complete and see their progress in the sidebar.

### Data model
1. **New table `public.user_progress`**
   - `id`, `user_id` (refs `auth.users`), `lesson_id` (refs `public.lessons`)
   - `completed_at`, `created_at`, `updated_at`
   - Unique `(user_id, lesson_id)`
2. **RLS**
   - Authenticated users can select/insert/update/delete only rows where `user_id = auth.uid()`.
   - `service_role` gets full access.
3. **Trigger**
   - Auto-update `updated_at` on changes using the existing `update_updated_at_column` function.

### Authentication
1. **Update `src/pages/Auth.tsx`** so the existing sign-in page works for both admins and learners.
   - Change wording from admin-only to a generic sign-in.
   - Use `redirect_uri: window.location.origin + "/auth"` for Google OAuth and `emailRedirectTo: window.location.origin + "/auth"` for email sign-up.
   - On session detection, check if the user is an admin via `user_roles`.
     - Admins → `/admin`
     - Learners → `/course/:courseId` (the existing hardcoded course route)

### Course page (`src/pages/Course.tsx`)
1. **Fetch current user** and their completed lesson IDs from `user_progress`.
2. **Show a progress summary card at the top** with:
   - A horizontal progress bar and "X% complete" text.
   - "Y of Z lessons completed".
   - A **Continue learning** button that links to the next incomplete lesson (first unfinished in chapter/lesson order).
   - A **Sign in to track progress** prompt for anonymous users.
3. **Mark completed lessons** in the chapter list with a small check indicator.

### Lesson page (`src/pages/Lesson.tsx`)
1. Add a **Mark as complete** button at the bottom of the lesson content.
2. If the lesson is already completed, show a **Completed** state with a checkmark and an option to un-complete (toggle).
3. After toggling completion, insert/delete the `user_progress` row and refresh the progress query so the course page and sidebar update.

### Sidebar (`src/components/CourseSidebar.tsx`)
1. Fetch the same progress data and show a check icon next to completed lessons.

### Files to change
- `src/pages/Auth.tsx`
- `src/pages/Course.tsx`
- `src/pages/Lesson.tsx`
- `src/components/CourseSidebar.tsx`
- New migration for `public.user_progress`.

### Verification
- Sign in as a learner, mark a lesson complete, and confirm the course page shows the updated percentage and the sidebar shows the checkmark.
- Sign in as an admin and confirm the redirect still goes to `/admin`.