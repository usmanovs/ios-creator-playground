import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "./RichTextEditor";
import LessonPreview from "./LessonPreview";
import YouTubeUrlField from "./YouTubeUrlField";
import ConfirmDialog from "./ConfirmDialog";
import { toast } from "sonner";

export type EditableLesson = {
  id: string;
  course_id: string;
  chapter_id: string | null;
  title: string;
  order_index: number;
  lesson_type: string;
  status: string;
  video_url: string | null;
  content: string | null;
  content_html: string | null;
  day_number: number | null;
};

type Props = {
  lesson: EditableLesson | null;
  onClose: () => void;
  onSave: (patch: Partial<EditableLesson>) => Promise<void>;
};

const eq = (a: any, b: any) => (a ?? "") === (b ?? "");

export default function LessonEditor({ lesson, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<EditableLesson | null>(lesson);
  const [original, setOriginal] = useState<EditableLesson | null>(lesson);
  const [confirmClose, setConfirmClose] = useState(false);
  const autosaveTimer = useRef<number | null>(null);

  useEffect(() => {
    setDraft(lesson);
    setOriginal(lesson);
  }, [lesson?.id]);

  const dirty =
    draft && original
      ? !(
          eq(draft.title, original.title) &&
          eq(draft.lesson_type, original.lesson_type) &&
          eq(draft.status, original.status) &&
          eq(draft.video_url, original.video_url) &&
          eq(draft.content, original.content) &&
          eq(draft.content_html, original.content_html) &&
          eq(draft.day_number, original.day_number)
        )
      : false;

  const persist = async () => {
    if (!draft || !dirty) return;
    await onSave({
      title: draft.title,
      lesson_type: draft.lesson_type,
      status: draft.status,
      video_url: draft.video_url,
      content: draft.content,
      content_html: draft.content_html,
      day_number: draft.day_number,
    });
    setOriginal(draft);
  };

  // Autosave (debounced 2s)
  useEffect(() => {
    if (!dirty) return;
    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    autosaveTimer.current = window.setTimeout(() => {
      persist();
    }, 2000);
    return () => {
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  // Cmd/Ctrl+S
  useEffect(() => {
    if (!draft) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        persist().then(() => toast.success("Saved"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, dirty]);

  const tryClose = () => {
    if (dirty) setConfirmClose(true);
    else onClose();
  };

  return (
    <>
      <Dialog open={!!lesson} onOpenChange={(o) => !o && tryClose()}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              Edit lesson
              <span className={`text-xs px-2 py-0.5 rounded-full ${dirty ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                {dirty ? "Unsaved" : "Saved"}
              </span>
              <span className="text-xs text-foreground/40 hidden md:inline">⌘S to save · Esc to close</span>
            </DialogTitle>
          </DialogHeader>

          {draft && (
            <div className="grid md:grid-cols-2 gap-4 overflow-y-auto flex-1 pr-1">
              {/* Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={draft.lesson_type}
                      onValueChange={(v) => setDraft({ ...draft, lesson_type: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={draft.status}
                      onValueChange={(v) => setDraft({ ...draft, status: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Day</Label>
                    <Select
                      value={draft.day_number ? String(draft.day_number) : "none"}
                      onValueChange={(v) =>
                        setDraft({ ...draft, day_number: v === "none" ? null : Number(v) })
                      }
                    >
                      <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                          <SelectItem key={d} value={String(d)}>Day {d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {(draft.lesson_type === "video" || draft.lesson_type === "pdf") && (
                  <YouTubeUrlField
                    value={draft.video_url ?? ""}
                    onChange={(v) => setDraft({ ...draft, video_url: v })}
                    label={draft.lesson_type === "pdf" ? "PDF URL" : "Video URL"}
                  />
                )}
                {draft.lesson_type === "text" && (
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <RichTextEditor
                      value={draft.content_html ?? ""}
                      onChange={(html) => setDraft({ ...draft, content_html: html })}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Private notes</Label>
                  <Textarea
                    rows={3}
                    value={draft.content ?? ""}
                    onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  />
                </div>
              </div>

              {/* Preview */}
              <LessonPreview
                lessonType={draft.lesson_type}
                videoUrl={draft.video_url}
                contentHtml={draft.content_html}
                title={draft.title}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={tryClose}>
              Close
            </Button>
            <Button
              onClick={async () => {
                await persist();
                toast.success("Saved");
                onClose();
              }}
              disabled={!dirty}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmClose}
        onOpenChange={setConfirmClose}
        title="Discard unsaved changes?"
        description="You have edits that haven't been saved."
        confirmLabel="Discard"
        destructive
        onConfirm={() => {
          setConfirmClose(false);
          onClose();
        }}
      />
    </>
  );
}
