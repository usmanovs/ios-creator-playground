import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ExternalLink, LogOut, Plus, BookOpen } from "lucide-react";
import SortableChapter from "@/components/admin/SortableChapter";
import LessonEditor, { EditableLesson } from "@/components/admin/LessonEditor";
import AdminsPanel from "@/components/admin/AdminsPanel";
import ActivityLogPanel from "@/components/admin/ActivityLogPanel";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";

type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  cover_image: string | null;
};
type Chapter = { id: string; course_id: string; title: string; order_index: number };
type Lesson = EditableLesson;

const log = (action: string, entity_type: string, entity_id: string | null, entity_label: string, metadata: any = {}) =>
  supabase.rpc("log_activity", {
    _action: action,
    _entity_type: entity_type,
    _entity_id: entity_id as any,
    _entity_label: entity_label,
    _metadata: metadata,
  });

export default function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [course, setCourse] = useState<Course | null>(null);
  const [courseOriginal, setCourseOriginal] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [savingCourse, setSavingCourse] = useState(false);

  const [confirmDeleteChapter, setConfirmDeleteChapter] = useState<Chapter | null>(null);
  const [confirmDeleteLesson, setConfirmDeleteLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth");
    });
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      setIsAdmin(!!roles?.some((r: any) => r.role === "admin"));
      setReady(true);
    })();
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const load = useCallback(async () => {
    const { data: c } = await supabase
      .from("courses")
      .select("id,title,description,image_url,cover_image")
      .limit(1)
      .maybeSingle();
    setCourse(c as Course | null);
    setCourseOriginal(c as Course | null);
    if (!c) return;
    const { data: ch } = await supabase
      .from("chapters")
      .select("*")
      .eq("course_id", c.id)
      .order("order_index");
    setChapters((ch as Chapter[]) || []);
    const { data: ls } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", c.id)
      .order("order_index");
    setLessons((ls as Lesson[]) || []);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  if (!ready) return <div className="p-10 text-foreground/60">Loading…</div>;
  if (!isAdmin)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="glass-card rounded-2xl p-8 max-w-md text-center space-y-4">
          <h1 className="font-display text-xl font-bold">Not authorized</h1>
          <p className="text-foreground/60">Your account does not have admin access.</p>
          <Button onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}>
            Sign out
          </Button>
        </div>
      </div>
    );

  const courseDirty =
    !!course && !!courseOriginal &&
    (course.title !== courseOriginal.title ||
      (course.description ?? "") !== (courseOriginal.description ?? "") ||
      (course.image_url ?? "") !== (courseOriginal.image_url ?? ""));

  const saveCourse = async () => {
    if (!course) return;
    setSavingCourse(true);
    const { error } = await supabase
      .from("courses")
      .update({
        title: course.title,
        description: course.description,
        image_url: course.image_url,
      })
      .eq("id", course.id);
    setSavingCourse(false);
    if (error) return toast.error(error.message);
    setCourseOriginal(course);
    log("update", "course", course.id, course.title);
    toast.success("Course saved");
  };

  const addChapter = async () => {
    if (!course) return;
    const next = (chapters.at(-1)?.order_index ?? -1) + 10;
    const { data, error } = await supabase
      .from("chapters")
      .insert({ course_id: course.id, title: "New chapter", order_index: next })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setChapters((p) => [...p, data as Chapter]);
    log("create", "chapter", data.id, data.title);
  };

  const renameChapter = async (ch: Chapter, title: string) => {
    setChapters((p) => p.map((x) => (x.id === ch.id ? { ...x, title } : x)));
    const { error } = await supabase.from("chapters").update({ title }).eq("id", ch.id);
    if (error) {
      toast.error(error.message);
      setChapters((p) => p.map((x) => (x.id === ch.id ? { ...x, title: ch.title } : x)));
      return;
    }
    log("update", "chapter", ch.id, title);
  };

  const deleteChapter = async (ch: Chapter) => {
    const prev = { chapters, lessons };
    setChapters((p) => p.filter((x) => x.id !== ch.id));
    setLessons((p) => p.filter((l) => l.chapter_id !== ch.id));
    await supabase.from("lessons").delete().eq("chapter_id", ch.id);
    const { error } = await supabase.from("chapters").delete().eq("id", ch.id);
    if (error) {
      toast.error(error.message);
      setChapters(prev.chapters);
      setLessons(prev.lessons);
      return;
    }
    log("delete", "chapter", ch.id, ch.title);
    toast.success("Chapter deleted");
  };

  const reorderChapters = async (orderedIds: string[]) => {
    const map = new Map(chapters.map((c) => [c.id, c]));
    const next = orderedIds.map((id, i) => ({ ...(map.get(id) as Chapter), order_index: i * 10 }));
    setChapters(next);
    await Promise.all(
      next.map((c) =>
        supabase.from("chapters").update({ order_index: c.order_index }).eq("id", c.id)
      )
    );
    log("reorder", "chapter", null, "chapters", { order: orderedIds });
  };

  const addLesson = async (chapterId: string) => {
    if (!course) return;
    const inCh = lessons.filter((l) => l.chapter_id === chapterId);
    const next = (inCh.at(-1)?.order_index ?? -1) + 10;
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        course_id: course.id,
        chapter_id: chapterId,
        title: "New lesson",
        order_index: next,
        lesson_type: "video",
        status: "draft",
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setLessons((p) => [...p, data as Lesson]);
    log("create", "lesson", data.id, data.title);
    setEditingLesson(data as Lesson);
  };

  const duplicateLesson = async (id: string) => {
    const src = lessons.find((l) => l.id === id);
    if (!src || !course) return;
    const inCh = lessons.filter((l) => l.chapter_id === src.chapter_id);
    const next = (inCh.at(-1)?.order_index ?? -1) + 10;
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        course_id: course.id,
        chapter_id: src.chapter_id,
        title: `${src.title} (copy)`,
        order_index: next,
        lesson_type: src.lesson_type,
        status: "draft",
        video_url: src.video_url,
        content: src.content,
        content_html: src.content_html,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setLessons((p) => [...p, data as Lesson]);
    log("create", "lesson", data.id, data.title, { duplicated_from: id });
    toast.success("Lesson duplicated");
  };

  const deleteLesson = async (l: Lesson) => {
    const prev = lessons;
    setLessons((p) => p.filter((x) => x.id !== l.id));
    const { error } = await supabase.from("lessons").delete().eq("id", l.id);
    if (error) {
      toast.error(error.message);
      setLessons(prev);
      return;
    }
    log("delete", "lesson", l.id, l.title);
    toast.success("Lesson deleted");
  };

  const reorderLessons = async (chapterId: string, orderedIds: string[]) => {
    const peers = lessons.filter((l) => l.chapter_id === chapterId);
    const others = lessons.filter((l) => l.chapter_id !== chapterId);
    const map = new Map(peers.map((l) => [l.id, l]));
    const reordered = orderedIds.map((id, i) => ({ ...(map.get(id) as Lesson), order_index: i * 10 }));
    setLessons([...others, ...reordered]);
    await Promise.all(
      reordered.map((l) =>
        supabase.from("lessons").update({ order_index: l.order_index }).eq("id", l.id)
      )
    );
    log("reorder", "lesson", null, "lessons", { chapter_id: chapterId, order: orderedIds });
  };

  const saveLessonPatch = async (patch: Partial<Lesson>): Promise<void> => {
    if (!editingLesson) return;
    const updated = { ...editingLesson, ...patch } as Lesson;
    setEditingLesson(updated);
    setLessons((p) => p.map((x) => (x.id === updated.id ? updated : x)));
    const { error } = await supabase.from("lessons").update(patch).eq("id", updated.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (patch.status && patch.status !== editingLesson.status) {
      await log(patch.status === "published" ? "publish" : "unpublish", "lesson", updated.id, updated.title);
    } else {
      await log("update", "lesson", updated.id, updated.title);
    }
  };

  // Sensors for chapter drag
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onChapterDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = chapters.findIndex((c) => c.id === active.id);
    const newIdx = chapters.findIndex((c) => c.id === over.id);
    const next = arrayMove(chapters, oldIdx, newIdx);
    reorderChapters(next.map((c) => c.id));
  };

  const totalLessons = lessons.length;
  const publishedLessons = lessons.filter((l) => l.status === "published").length;
  const draftLessons = totalLessons - publishedLessons;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="aurora-bg" />

      {/* Sticky header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <h1 className="font-display text-lg md:text-xl font-bold truncate flex-1">
            {course?.title || "Admin"}
          </h1>
          {courseDirty && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
              Unsaved
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => course && window.open(`/course/${course.id}`, "_blank")}>
            <ExternalLink className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Preview</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}
          >
            <LogOut className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Sign out</span>
          </Button>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Chapters" value={chapters.length} />
          <StatCard label="Lessons" value={totalLessons} />
          <StatCard label="Published" value={publishedLessons} accent="primary" />
          <StatCard label="Drafts" value={draftLessons} />
        </section>

        {/* Course info */}
        {course && (
          <section className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-xl font-bold">Course</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Cover image URL</Label>
                <Input
                  value={course.image_url ?? ""}
                  onChange={(e) => setCourse({ ...course, image_url: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={course.description ?? ""}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                rows={3}
              />
            </div>
            <Button onClick={saveCourse} disabled={!courseDirty || savingCourse}>
              {savingCourse ? "Saving…" : courseDirty ? "Save course" : "Saved"}
            </Button>
          </section>
        )}

        {/* Chapters */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Chapters</h2>
            <Button onClick={addChapter}>
              <Plus className="w-4 h-4 mr-2" /> Add chapter
            </Button>
          </div>

          {chapters.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-8 h-8" />}
              title="No chapters yet"
              description="Create your first chapter to start organizing lessons."
              ctaLabel="Add chapter"
              onCta={addChapter}
            />
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onChapterDragEnd}>
              <SortableContext items={chapters.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {chapters.map((ch) => {
                    const chLessons = lessons.filter((l) => l.chapter_id === ch.id);
                    return (
                      <SortableChapter
                        key={ch.id}
                        chapter={ch}
                        lessons={chLessons}
                        onRename={(t) => renameChapter(ch, t)}
                        onDelete={() => setConfirmDeleteChapter(ch)}
                        onAddLesson={() => addLesson(ch.id)}
                        onReorderLessons={(ids) => reorderLessons(ch.id, ids)}
                        onEditLesson={(id) => {
                          const l = lessons.find((x) => x.id === id);
                          if (l) setEditingLesson(l);
                        }}
                        onDuplicateLesson={duplicateLesson}
                        onDeleteLesson={(id) => {
                          const l = lessons.find((x) => x.id === id);
                          if (l) setConfirmDeleteLesson(l);
                        }}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>

        {/* Admins */}
        {userId && <AdminsPanel currentUserId={userId} />}

        {/* Activity log */}
        <ActivityLogPanel />
      </div>

      <LessonEditor
        lesson={editingLesson}
        onClose={() => setEditingLesson(null)}
        onSave={saveLessonPatch}
      />

      <ConfirmDialog
        open={!!confirmDeleteChapter}
        onOpenChange={(o) => !o && setConfirmDeleteChapter(null)}
        title={`Delete chapter "${confirmDeleteChapter?.title}"?`}
        description="This will also delete all lessons in this chapter."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (confirmDeleteChapter) deleteChapter(confirmDeleteChapter);
          setConfirmDeleteChapter(null);
        }}
      />

      <ConfirmDialog
        open={!!confirmDeleteLesson}
        onOpenChange={(o) => !o && setConfirmDeleteLesson(null)}
        title={`Delete lesson "${confirmDeleteLesson?.title}"?`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (confirmDeleteLesson) deleteLesson(confirmDeleteLesson);
          setConfirmDeleteLesson(null);
        }}
      />
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: "primary" }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="text-xs uppercase tracking-wide text-foreground/50">{label}</div>
      <div className={`font-display text-2xl font-bold ${accent === "primary" ? "text-primary" : ""}`}>
        {value}
      </div>
    </div>
  );
}
