import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  pointerWithin,
  rectIntersection,
  CollisionDetection,
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
import { ExternalLink, LogOut, Plus, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import SortableChapter from "@/components/admin/SortableChapter";
import LessonEditor, { EditableLesson } from "@/components/admin/LessonEditor";
import AdminsPanel from "@/components/admin/AdminsPanel";

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
  const [courseExpanded, setCourseExpanded] = useState(false);

  const [confirmDeleteChapter, setConfirmDeleteChapter] = useState<Chapter | null>(null);
  const [confirmDeleteLesson, setConfirmDeleteLesson] = useState<Lesson | null>(null);
  const [hydratedChapters, setHydratedChapters] = useState<Set<string>>(new Set());

  const prefetchChapterLessons = useCallback(
    async (chapterId: string) => {
      if (hydratedChapters.has(chapterId)) return;
      const ids = lessons
        .filter(
          (l) =>
            l.chapter_id === chapterId &&
            l.content_html == null &&
            l.content == null &&
            l.video_url == null
        )
        .map((l) => l.id);
      // Defer marking hydrated until lessons for this chapter exist in state,
      // otherwise a mount-time call before lessons load would mark it hydrated
      // with nothing fetched and never retry.
      const chapterHasLessons = lessons.some((l) => l.chapter_id === chapterId);
      if (!chapterHasLessons) return;
      setHydratedChapters((prev) => {
        const next = new Set(prev);
        next.add(chapterId);
        return next;
      });
      if (ids.length === 0) return;
      const { data, error } = await supabase
        .from("lessons")
        .select("id,video_url,content,content_html")
        .in("id", ids);
      if (error || !data) return;
      const byId = new Map(data.map((r: any) => [r.id, r]));
      setLessons((p) =>
        p.map((l) => (byId.has(l.id) ? { ...l, ...(byId.get(l.id) as any) } : l))
      );
    },
    [lessons, hydratedChapters]
  );

  // After lessons load, auto-prefetch content for any chapter currently open
  // in the UI (persisted in localStorage by SortableChapter).
  useEffect(() => {
    if (lessons.length === 0 || chapters.length === 0) return;
    for (const ch of chapters) {
      if (hydratedChapters.has(ch.id)) continue;
      let isOpen = true;
      try {
        const v = window.localStorage.getItem(`admin.chapter.open.${ch.id}`);
        isOpen = v === null ? true : v === "1";
      } catch {}
      if (isOpen) prefetchChapterLessons(ch.id);
    }
  }, [lessons, chapters, hydratedChapters, prefetchChapterLessons]);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      // Only redirect on explicit sign-out. Ignore transient null sessions
      // (e.g. INITIAL_SESSION before hydration) that would kick the user
      // out on page reload.
      if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
        navigate("/auth");
      }
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
    // Only fetch light columns for the list; heavy fields (content_html etc.)
    // are loaded on demand when opening/duplicating a lesson.
    const { data: ls } = await supabase
      .from("lessons")
      .select("id,course_id,chapter_id,title,order_index,lesson_type,status,day_number")
      .eq("course_id", c.id)
      .order("order_index");
    const light = (ls || []).map((l: any) => ({
      ...l,
      video_url: null,
      content: null,
      content_html: null,
    })) as Lesson[];
    setLessons(light);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
    toast.success("Chapter added");
    requestAnimationFrame(() => {
      const el = document.getElementById(`chapter-${data.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
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
        lesson_type: "text",
        status: "published",
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setLessons((p) => [...p, data as Lesson]);
    log("create", "lesson", data.id, data.title);
    setEditingLesson(data as Lesson);
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

  const moveLesson = async (
    lessonId: string,
    toChapterId: string,
    toIndex: number
  ) => {
    const src = lessons.find((l) => l.id === lessonId);
    if (!src) return;
    const fromChapterId = src.chapter_id;
    const prev = lessons;

    let nextLessons: Lesson[];
    if (fromChapterId === toChapterId) {
      const peers = lessons
        .filter((l) => l.chapter_id === toChapterId)
        .sort((a, b) => a.order_index - b.order_index);
      const oldIdx = peers.findIndex((l) => l.id === lessonId);
      if (oldIdx === -1) return;
      const reordered = arrayMove(peers, oldIdx, toIndex).map((l, i) => ({
        ...l,
        order_index: i * 10,
      }));
      const others = lessons.filter((l) => l.chapter_id !== toChapterId);
      nextLessons = [...others, ...reordered];
    } else {
      const target = lessons
        .filter((l) => l.chapter_id === toChapterId && l.id !== lessonId)
        .sort((a, b) => a.order_index - b.order_index);
      const moved = { ...src, chapter_id: toChapterId };
      target.splice(Math.max(0, Math.min(toIndex, target.length)), 0, moved);
      const reorderedTarget = target.map((l, i) => ({ ...l, order_index: i * 10 }));
      const others = lessons.filter(
        (l) => l.chapter_id !== toChapterId && l.id !== lessonId
      );
      nextLessons = [...others, ...reorderedTarget];
    }

    setLessons(nextLessons);

    const touched = nextLessons.filter((l) => {
      const before = prev.find((x) => x.id === l.id);
      return (
        !before ||
        before.order_index !== l.order_index ||
        before.chapter_id !== l.chapter_id
      );
    });
    const { error } = await (async () => {
      for (const l of touched) {
        const { error } = await supabase
          .from("lessons")
          .update({ order_index: l.order_index, chapter_id: l.chapter_id })
          .eq("id", l.id);
        if (error) return { error };
      }
      return { error: null as any };
    })();
    if (error) {
      toast.error(error.message);
      setLessons(prev);
      return;
    }
    if (fromChapterId !== toChapterId) {
      log("update", "lesson", lessonId, src.title, {
        moved_to_chapter: toChapterId,
        from_chapter: fromChapterId,
      });
    } else {
      log("reorder", "lesson", null, "lessons", {
        chapter_id: toChapterId,
      });
    }
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

  const collisionDetection: CollisionDetection = (args) => {
    const getType = (id: string | number) =>
      args.droppableContainers.find((container) => container.id === id)?.data.current?.type;
    const prioritize = (collisions: ReturnType<CollisionDetection>) => {
      const activeType = args.active.data.current?.type;
      if (activeType !== "lesson") return collisions;

      const lessonTargets = collisions.filter((collision) => getType(collision.id) === "lesson");
      if (lessonTargets.length > 0) return lessonTargets;

      const chapterDropTargets = collisions.filter(
        (collision) => getType(collision.id) === "chapter-droppable"
      );
      if (chapterDropTargets.length > 0) return chapterDropTargets;

      const chapterTargets = collisions.filter((collision) => getType(collision.id) === "chapter");
      return chapterTargets.length > 0 ? chapterTargets : collisions;
    };

    const pointer = prioritize(pointerWithin(args));
    if (pointer.length > 0) return pointer;
    const rect = prioritize(rectIntersection(args));
    if (rect.length > 0) return rect;
    return prioritize(closestCenter(args));
  };

  const onDndEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const activeType = (active.data.current as any)?.type;

    // Chapter reorder
    if (activeType === "chapter") {
      const overData = over.data.current as any;
      const overChapterId =
        overData?.type === "chapter-droppable" ? overData.chapterId : String(over.id);
      if (String(active.id) === String(overChapterId)) return;
      const oldIdx = chapters.findIndex((c) => c.id === active.id);
      const newIdx = chapters.findIndex((c) => c.id === overChapterId);
      if (oldIdx === -1 || newIdx === -1) return;
      const next = arrayMove(chapters, oldIdx, newIdx);
      reorderChapters(next.map((c) => c.id));
      return;
    }

    // Lesson move / reorder
    const activeLesson = lessons.find((l) => l.id === active.id);
    if (!activeLesson) return;

    let toChapterId: string | null = null;
    let toIndex = 0;

    const overData = over.data.current as any;
    if (overData?.type === "chapter-droppable") {
      toChapterId = overData.chapterId;
      toIndex = lessons.filter((l) => l.chapter_id === toChapterId).length;
    } else if (overData?.type === "chapter") {
      toChapterId = String(over.id);
      toIndex = lessons.filter((l) => l.chapter_id === toChapterId).length;
    } else if (overData?.type === "lesson" && overData?.sortable?.containerId) {
      toChapterId = String(overData.sortable.containerId);
      const peers = lessons
        .filter((l) => l.chapter_id === toChapterId)
        .sort((a, b) => a.order_index - b.order_index);
      const idx = peers.findIndex((l) => l.id === over.id);
      toIndex = idx === -1 ? peers.length : idx;
    } else {
      // over a chapter card itself
      const overChapter = chapters.find((c) => c.id === over.id);
      if (overChapter) {
        toChapterId = overChapter.id;
        toIndex = lessons.filter((l) => l.chapter_id === toChapterId).length;
      }
    }
    if (!toChapterId) return;
    if (
      toChapterId === activeLesson.chapter_id &&
      String(active.id) === String(over.id)
    )
      return;
    moveLesson(String(active.id), toChapterId, toIndex);
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
          <Button variant="outline" size="sm" onClick={() => navigate("/instructor")}>
            <span className="hidden md:inline">Schedule</span><span className="md:hidden">📅</span>
          </Button>
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
          <section className="glass-card rounded-xl p-4">
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setCourseExpanded((v) => !v)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">Course</span>
                <span className="font-display font-semibold">{course.title}</span>
                {courseDirty && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Unsaved</span>
                )}
              </div>
              {courseExpanded ? (
                <ChevronUp className="w-4 h-4 text-foreground/50" />
              ) : (
                <ChevronDown className="w-4 h-4 text-foreground/50" />
              )}
            </button>
            {courseExpanded && (
              <div className="mt-4 pt-4 border-t border-border/50 space-y-4">
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
              </div>
            )}
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
            <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragEnd={onDndEnd}>
              <SortableContext items={chapters.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {chapters.map((ch) => {
                    const chLessons = lessons.filter((l) => l.chapter_id === ch.id);
                    return (
                      <SortableChapter
                        key={ch.id}
                        chapter={ch}
                        lessons={chLessons}
                        onExpand={prefetchChapterLessons}
                        onRename={(t) => renameChapter(ch, t)}
                        onDelete={() => setConfirmDeleteChapter(ch)}
                        onAddLesson={() => addLesson(ch.id)}
                        onEditLesson={async (id) => {
                          const l = lessons.find((x) => x.id === id);
                          if (!l) return;
                          // Open immediately with what we have, then hydrate heavy fields.
                          setEditingLesson(l);
                          if (l.content_html == null && l.content == null && l.video_url == null) {
                            const { data: full } = await supabase
                              .from("lessons")
                              .select("video_url,content,content_html")
                              .eq("id", id)
                              .maybeSingle();
                            if (full) {
                              const hydrated: Lesson = { ...l, ...(full as any) };
                              setLessons((p) => p.map((x) => (x.id === id ? hydrated : x)));
                              setEditingLesson((cur) => (cur && cur.id === id ? hydrated : cur));
                            }
                          }
                        }}
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
