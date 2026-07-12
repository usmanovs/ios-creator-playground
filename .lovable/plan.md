## Goal
Allow admins to paste (Cmd/Ctrl+V) or drag-and-drop images directly into the lesson content editor. Images upload to backend storage and the resulting URL is inserted inline into the lesson HTML.

## Changes

1. **Create storage bucket `lesson-images`** (public read).
   - RLS on `storage.objects`:
     - Public `SELECT` on this bucket (so images render for any lesson viewer).
     - `INSERT/UPDATE/DELETE` restricted to authenticated admins (using existing `has_role(auth.uid(), 'admin')`).

2. **`src/lib/uploadLessonImage.ts` (new)** — helper that:
   - Accepts a `File`/`Blob`, generates a unique path `${crypto.randomUUID()}.${ext}`.
   - Uploads via `supabase.storage.from('lesson-images').upload(...)`.
   - Returns the public URL.

3. **`src/components/admin/RichTextEditor.tsx`** — extend the TipTap editor with:
   - `handlePaste`: detect image items in clipboard, upload, insert `<img>` at cursor.
   - `handleDrop`: same for dropped image files.
   - Show a lightweight "Uploading…" toast (sonner) during upload; toast error on failure.
   - Existing "Image URL" button stays as fallback.

## Files
- New: `src/lib/uploadLessonImage.ts`
- Edit: `src/components/admin/RichTextEditor.tsx`
- Migration: create bucket + policies

No changes to lesson rendering — pasted images become normal `<img>` tags in `content_html`, already sanitized by DOMPurify on the view side.
