import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Eye, X } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  prevLessonTitle?: string | null;
  onPrevLesson?: () => void;
  nextLessonTitle?: string | null;
  onNextLesson?: () => void;
};

const eq = (a: any, b: any) => (a ?? "") === (b ?? "");

export default function LessonEditor({ lesson, onClose, onSave, prevLessonTitle, onPrevLesson, nextLessonTitle, onNextLesson }: Props) {
  const [draft, setDraft] = useState<EditableLesson | null>(lesson);
  const [original, setOriginal] = useState<EditableLesson | null>(lesson);
  const [confirmClose, setConfirmClose] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const autosaveTimer = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(lesson);
    setOriginal(lesson);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
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

  const dayMissing = !!draft && !draft.day_number;

  const persist = async () => {
    if (!draft || !dirty) return false;
    if (!draft.day_number) return false;
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
    return true;
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
        persist().then((ok) =>
          ok ? toast.success("Saved") : dayMissing && toast.error("Please select a day before saving")
        );
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
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="flex items-center gap-3">
                Edit lesson
                <span className={`text-xs px-2 py-0.5 rounded-full ${dirty ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                  {dirty ? "Unsaved" : "Saved"}
                </span>
                <span className="text-xs text-foreground/40 hidden md:inline">⌘S to save · Esc to close</span>
              </DialogTitle>
              <div className="flex items-center gap-2 mr-8">
                {onPrevLesson && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    onClick={async () => {
                      if (dirty && !dayMissing) await persist();
                      onPrevLesson();
                    }}
                    title={prevLessonTitle ? `Previous: ${prevLessonTitle}` : "Previous lesson"}
                  >
                    ← Previous
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="shrink-0"
                  onClick={() => setShowPreview(true)}
                  title="Preview lesson"
                >
                  <Eye className="h-4 w-4 mr-1" /> Preview
                </Button>
                {onNextLesson && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    onClick={async () => {
                      if (dirty && !dayMissing) await persist();
                      onNextLesson();
                    }}
                    title={nextLessonTitle ? `Next: ${nextLessonTitle}` : "Next lesson"}
                  >
                    Next lesson →
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {draft && (
            <div ref={scrollRef} className="overflow-y-auto flex-1 pr-1">
              {/* Form */}
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-12 md:col-span-5 space-y-1">
                    <Label className="text-xs text-muted-foreground">Title</Label>
                    <Input
                      className="h-9"
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <Select
                      value={draft.lesson_type}
                      onValueChange={(v) => setDraft({ ...draft, lesson_type: v })}
                    >
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-6 md:col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Day <span className="text-destructive">*</span></Label>
                    <Select
                      value={draft.day_number ? String(draft.day_number) : ""}
                      onValueChange={(v) =>
                        setDraft({ ...draft, day_number: Number(v) })
                      }
                    >
                      <SelectTrigger className={`h-9 ${dayMissing ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                          <SelectItem key={d} value={String(d)}>Day {d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {dayMissing && (
                      <p className="text-xs text-destructive">Required</p>
                    )}
                  </div>
                  <div className="col-span-12 md:col-span-3 space-y-1">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <RadioGroup
                      value={draft.status}
                      onValueChange={(v) => setDraft({ ...draft, status: v })}
                      className="flex gap-4 h-9 items-center"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="draft" id="status-draft" />
                        <Label htmlFor="status-draft" className="cursor-pointer font-normal text-sm">Draft</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="published" id="status-published" />
                        <Label htmlFor="status-published" className="cursor-pointer font-normal text-sm">Published</Label>
                      </div>
                    </RadioGroup>
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
            </div>
          )}

          {/* On-demand preview overlay */}
          {draft && showPreview && (
            <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col rounded-lg">
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-foreground/70">Lesson Preview</span>
                <div className="flex items-center gap-2">
                  {onPrevLesson && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        if (dirty && !dayMissing) await persist();
                        onPrevLesson();
                      }}
                      title={prevLessonTitle ? `Previous: ${prevLessonTitle}` : "Previous lesson"}
                    >
                      ← Previous
                    </Button>
                  )}
                  {onNextLesson && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        if (dirty && !dayMissing) await persist();
                        onNextLesson();
                      }}
                      title={nextLessonTitle ? `Next: ${nextLessonTitle}` : "Next lesson"}
                    >
                      Next lesson →
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowPreview(false)}
                    title="Close preview"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <LessonPreview
                  lessonType={draft.lesson_type}
                  videoUrl={draft.video_url}
                  contentHtml={draft.content_html}
                  title={draft.title}
                />
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" onClick={tryClose}>
              Close
            </Button>
            <Button
              onClick={async () => {
                if (await persist()) toast.success("Saved");
              }}
              disabled={!dirty || dayMissing}
            >
              Save
            </Button>
            <Button
              onClick={async () => {
                if (await persist()) {
                  toast.success("Saved");
                  onClose();
                }
              }}
              disabled={!dirty || dayMissing}
            >
              Save and Close
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
