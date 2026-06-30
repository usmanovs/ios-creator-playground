
# Admin View Upgrade Plan

Rebuild `/admin` into a production-grade LMS editor. Implementing items 1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 from the prior list. (Skipping #4 bulk actions and #5 search/filter as requested.)

## 1. Backend changes (one migration)

**`activity_log` table** — append-only audit trail.
- Columns: `actor_id` (uuid → auth.users), `actor_email` (text snapshot), `action` (text: `create|update|delete|reorder|publish|unpublish|role_grant|role_revoke`), `entity_type` (`course|chapter|lesson|role`), `entity_id` (uuid), `entity_label` (text snapshot of title), `metadata` (jsonb), `created_at`.
- GRANTs: `SELECT` to authenticated, `ALL` to service_role.
- RLS: only admins can SELECT; INSERT via SECURITY DEFINER function `log_activity(...)` so any admin write can record.

**`admin_invites` table** — pending admin promotions by email.
- Columns: `email` (citext unique), `invited_by` (uuid), `accepted_at` (timestamptz null), `created_at`.
- GRANTs + admin-only RLS.
- Trigger on `auth.users` insert: if new user's email matches a pending invite → insert `user_roles(admin)` row and stamp `accepted_at`. (Reuses the same pattern as `bootstrap_first_admin`.)

**Helper RPC `list_admins()`** (SECURITY DEFINER, admin-gated) — returns `{ user_id, email, created_at }` joined from `user_roles` + `auth.users` so the UI can show admins without exposing `auth.users` broadly.

**Helper RPC `revoke_admin(target_user_id uuid)`** — admin-only; refuses to remove the last admin; logs activity.

## 2. Dependencies

- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — drag-and-drop (#1).
- `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image` — rich text editor (#7).

## 3. New components (`src/components/admin/`)

- `RichTextEditor.tsx` — TipTap with toolbar (bold/italic/H1-H3/lists/link/image/code), outputs HTML into `lessons.content_html`.
- `LessonPreview.tsx` — renders the lesson exactly like `/lesson/:id` (video iframe / sanitized HTML / PDF embed) in a right-hand pane of the editor (#8).
- `YouTubeUrlField.tsx` — input with auto-normalize (`watch?v=`, `youtu.be/`, `shorts/` → `embed/`), shows thumbnail preview, validates (#9).
- `ConfirmDialog.tsx` — shadcn AlertDialog wrapper replacing all `confirm()` calls (#11).
- `SortableChapter.tsx` / `SortableLesson.tsx` — dnd-kit sortable rows with drag handle, collapse toggle, lesson count badge (#1, #2).
- `AdminsPanel.tsx` — list current admins, invite by email, revoke (#15).
- `ActivityLogPanel.tsx` — paginated recent edits with actor + action + entity (#16).
- `StickyHeader.tsx` — sticky top bar: course title, save state ("Saved" / "Saving…" / "Unsaved changes"), Preview, Sign out (#17).
- `StatsBar.tsx` — counts: chapters, total lessons, published, draft (#14).
- `EmptyState.tsx` — reusable empty card with icon + CTA (#18).

## 4. Page rewrite (`src/pages/Admin.tsx`)

- Replace flat layout with sticky header + container.
- Sections (collapsible cards): Course info, Stats, Chapters & lessons, Admins, Activity log.
- Chapter card: drag handle, collapse arrow, lesson count chip, inline rename, "+ lesson", delete.
- Lesson row: drag handle, title, type badge, status badge, **Preview** link (opens `/lesson/:id` in new tab, #3), edit, duplicate (#13), delete.
- Duplicate action clones the lesson (title `… (copy)`, status `draft`, next `order_index`).
- All destructive actions route through `ConfirmDialog`.
- All mutations are optimistic: update local state first, fire request, roll back on error with toast. Removes the full-page reload churn (#12).
- Reordering: single `UPDATE … FROM (VALUES …)` batched write after drop.

## 5. Lesson editor dialog rewrite

Two-pane layout (form left, live preview right, #8):
- Title, Type, Status (Select), Video/PDF URL via `YouTubeUrlField`.
- `RichTextEditor` for `content_html` when type=`text`.
- Plain notes textarea.
- **Dirty tracking**: compare current state to original; header shows dot indicator; Esc / close attempt with unsaved changes triggers AlertDialog (#10).
- **Keyboard shortcuts**: `⌘/Ctrl+S` saves, `Esc` closes (with dirty guard) (#6).
- **Autosave**: 2s debounce after edits while dialog open; toast on save; falls back to manual Save button.

## 6. Activity logging integration

Every mutation (course/chapter/lesson/role) calls `log_activity` RPC with action + entity + label snapshot. Reorders log a single `reorder` event with the new order in `metadata`.

## 7. Polish

- Mobile: stack columns under `md`, drag handles still usable, sticky header collapses (#19).
- Empty states: "No chapters yet" / "No lessons in this chapter" / "No activity yet" with CTA buttons (#18).
- All toasts via sonner; consistent success/error messaging.
- Replace `alert/confirm` everywhere in admin.

## 8. Out of scope

- #4 Bulk actions and #5 Search/filter (excluded by user).
- No changes to public `/course` or `/lesson` pages.
- No changes to auth flow beyond admin invite acceptance trigger.

## Technical notes

- DnD uses `@dnd-kit/sortable` with `arrayMove`; persisted `order_index` recomputed as `index * 10` to leave gaps.
- TipTap output sanitized on render in preview using existing `dompurify`.
- `list_admins` / `revoke_admin` RPCs avoid exposing `auth.users` to clients directly.
- Activity log INSERTs use SECURITY DEFINER function so RLS on the table stays SELECT-only for admins.
- Optimistic state uses local reducers; on error → revert + `toast.error`.
