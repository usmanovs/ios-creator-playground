import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Check, Eye, GripVertical, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LessonPreview from "@/components/admin/LessonPreview";
import { Textarea } from "@/components/ui/textarea";

type Lesson = {
  id: string;
  title: string;
  chapter_id: string | null;
  day_number: number | null;
  order_index: number;
  status: string;
  covered: boolean;
};
type Chapter = { id: string; title: string };

const DAYS = [1, 2, 3, 4, 5, 6, 7] as const;
type ColumnId = `d${number}` | "unassigned";

export default function InstructorPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [homework, setHomework] = useState<Record<number, string>>({});
  const [preClass, setPreClass] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ title: string; lesson_type: string; video_url: string | null; content_html: string | null } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const openPreview = useCallback(async (id: string) => {
    setPreviewId(id);
    setPreviewData(null);
    setPreviewLoading(true);
    const { data, error } = await supabase
      .from("lessons")
      .select("title,lesson_type,video_url,content_html")
      .eq("id", id)
      .maybeSingle();
    setPreviewLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data) setPreviewData(data as any);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      setIsAdmin(!!roles?.some((r: any) => r.role === "admin"));
      setReady(true);
    })();
  }, [navigate]);

  const load = useCallback(async () => {
    const { data: c } = await supabase.from("courses").select("id").limit(1).maybeSingle();
    if (!c) return;
    const [{ data: ls }, { data: ch }, { data: hw }] = await Promise.all([
      supabase.from("lessons").select("id,title,chapter_id,day_number,order_index,status,covered").eq("course_id", c.id).order("order_index"),
      supabase.from("chapters").select("id,title").eq("course_id", c.id).order("order_index"),
      supabase.from("day_homework").select("day_number,content,pre_class_message,completed"),
    ]);
    setLessons((ls as Lesson[]) || []);
    setChapters((ch as Chapter[]) || []);
    const hwMap: Record<number, string> = {};
    const pcMap: Record<number, string> = {};
    const doneMap: Record<number, boolean> = {};
    ((hw as { day_number: number; content: string; pre_class_message: string; completed: boolean }[]) || []).forEach((r) => {
      hwMap[r.day_number] = r.content;
      pcMap[r.day_number] = r.pre_class_message ?? "";
      doneMap[r.day_number] = r.completed ?? false;
    });
    setHomework(hwMap);
    setPreClass(pcMap);
    setCompleted(doneMap);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const hwTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const saveDayField = useCallback((day: number, field: "content" | "pre_class_message", value: string) => {
    const key = `${day}:${field}`;
    if (hwTimers.current[key]) clearTimeout(hwTimers.current[key]);
    hwTimers.current[key] = setTimeout(async () => {
      setSavingDay(day);
      const payload: any = { day_number: day, [field]: value };
      const { error } = await supabase
        .from("day_homework")
        .upsert(payload, { onConflict: "day_number" });
      setSavingDay((cur) => (cur === day ? null : cur));
      if (error) toast.error(error.message);
    }, 600);
  }, []);
  const onHomeworkChange = useCallback((day: number, value: string) => {
    setHomework((h) => ({ ...h, [day]: value }));
    saveDayField(day, "content", value);
  }, [saveDayField]);
  const onPreClassChange = useCallback((day: number, value: string) => {
    setPreClass((h) => ({ ...h, [day]: value }));
    saveDayField(day, "pre_class_message", value);
  }, [saveDayField]);

  const toggleCompleted = useCallback(async (day: number) => {
    const next = !completed[day];
    setCompleted((c) => ({ ...c, [day]: next }));
    setSavingDay(day);
    const { error } = await supabase
      .from("day_homework")
      .upsert({ day_number: day, completed: next }, { onConflict: "day_number" });
    setSavingDay((cur) => (cur === day ? null : cur));
    if (error) {
      toast.error(error.message);
      setCompleted((c) => ({ ...c, [day]: !next }));
    }
  }, [completed]);

  const toggleCovered = useCallback(async (lessonId: string) => {
    const current = lessons.find((l) => l.id === lessonId);
    if (!current) return;
    const next = !current.covered;
    setLessons((ls) => ls.map((l) => (l.id === lessonId ? { ...l, covered: next } : l)));
    const { error } = await supabase.from("lessons").update({ covered: next }).eq("id", lessonId);
    if (error) {
      toast.error(error.message);
      setLessons((ls) => ls.map((l) => (l.id === lessonId ? { ...l, covered: !next } : l)));
    }
  }, [lessons]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const chapterTitle = (id: string | null) =>
    chapters.find((c) => c.id === id)?.title ?? "—";

  const columnOf = (l: Lesson): ColumnId =>
    l.day_number ? (`d${l.day_number}` as ColumnId) : "unassigned";

  const grouped = useMemo(() => {
    const map: Record<ColumnId, Lesson[]> = { unassigned: [] } as any;
    DAYS.forEach((d) => (map[`d${d}` as ColumnId] = []));
    for (const l of lessons) map[columnOf(l)].push(l);
    // preserve order_index within each column
    (Object.keys(map) as ColumnId[]).forEach((k) =>
      map[k].sort((a, b) => a.order_index - b.order_index)
    );
    return map;
  }, [lessons]);

  const activeLesson = activeId ? lessons.find((l) => l.id === activeId) : null;

  const findColumn = (id: string): ColumnId | null => {
    if (id === "unassigned" || id.startsWith("d")) {
      // could be column id itself
      if (id === "unassigned") return "unassigned";
      if (/^d[1-7]$/.test(id)) return id as ColumnId;
    }
    const l = lessons.find((x) => x.id === id);
    return l ? columnOf(l) : null;
  };

  const persist = async (updates: { id: string; day_number: number | null; order_index: number }[]) => {
    // update each row; run in parallel
    const results = await Promise.all(
      updates.map((u) =>
        supabase
          .from("lessons")
          .update({ day_number: u.day_number, order_index: u.order_index })
          .eq("id", u.id)
      )
    );
    const err = results.find((r) => r.error)?.error;
    if (err) toast.error(err.message);
  };

  const onDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    const fromCol = findColumn(activeIdStr);
    const toCol = findColumn(overIdStr);
    if (!fromCol || !toCol) return;

    const prev = lessons;
    const fromList = [...grouped[fromCol]];
    const toList = fromCol === toCol ? fromList : [...grouped[toCol]];

    const activeIdx = fromList.findIndex((l) => l.id === activeIdStr);
    if (activeIdx === -1) return;

    let newToList: Lesson[];
    let newFromList: Lesson[] = fromList;

    if (fromCol === toCol) {
      const overIdx =
        overIdStr === toCol
          ? toList.length - 1
          : toList.findIndex((l) => l.id === overIdStr);
      if (overIdx === -1 || overIdx === activeIdx) return;
      newToList = arrayMove(toList, activeIdx, overIdx);
      newFromList = newToList;
    } else {
      const [moved] = fromList.splice(activeIdx, 1);
      const updatedMoved = {
        ...moved,
        day_number: toCol === "unassigned" ? null : Number(toCol.replace("d", "")),
      };
      const overIdx =
        overIdStr === toCol
          ? toList.length
          : toList.findIndex((l) => l.id === overIdStr);
      const insertAt = overIdx === -1 ? toList.length : overIdx;
      newToList = [...toList.slice(0, insertAt), updatedMoved, ...toList.slice(insertAt)];
      newFromList = fromList;
    }

    // Compute new order_index using base offsets per column so we don't clash globally
    const colBase: Record<ColumnId, number> = {} as any;
    (["unassigned", ...DAYS.map((d) => `d${d}` as ColumnId)] as ColumnId[]).forEach(
      (k, i) => (colBase[k] = i * 1000)
    );

    const updates: { id: string; day_number: number | null; order_index: number }[] = [];
    const applyList = (col: ColumnId, list: Lesson[]) => {
      list.forEach((l, i) => {
        const day = col === "unassigned" ? null : Number(col.replace("d", ""));
        const order_index = colBase[col] + i;
        if (l.day_number !== day || l.order_index !== order_index) {
          updates.push({ id: l.id, day_number: day, order_index });
        }
      });
    };
    applyList(toCol, newToList);
    if (fromCol !== toCol) applyList(fromCol, newFromList);

    // Optimistic update
    const byId = new Map(lessons.map((l) => [l.id, l]));
    updates.forEach((u) => {
      const cur = byId.get(u.id);
      if (cur) byId.set(u.id, { ...cur, day_number: u.day_number, order_index: u.order_index });
    });
    setLessons(Array.from(byId.values()));

    const { error } = await (async () => {
      const results = await Promise.all(
        updates.map((u) =>
          supabase
            .from("lessons")
            .update({ day_number: u.day_number, order_index: u.order_index })
            .eq("id", u.id)
        )
      );
      return { error: results.find((r) => r.error)?.error };
    })();
    if (error) {
      toast.error(error.message);
      setLessons(prev);
    }
  };

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="aurora-bg" />
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Admin</span>
          </Button>
          <h1 className="font-display text-lg md:text-xl font-bold flex-1">Instructor · Class Schedule</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}
          >
            <LogOut className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Sign out</span>
          </Button>
        </div>
      </div>

      <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 py-6">
        <p className="text-sm text-foreground/60 mb-4">
          Drag lessons between days, or reorder within a day. Changes save automatically.
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {DAYS.map((d) => (
              <DayColumn
                key={d}
                id={`d${d}`}
                label={`Day ${d}`}
                lessons={grouped[`d${d}` as ColumnId]}
                chapterTitle={chapterTitle}
                onPreview={openPreview}
                onToggleCovered={toggleCovered}
                homework={homework[d] ?? ""}
                onHomeworkChange={(v) => onHomeworkChange(d, v)}
                preClass={preClass[d] ?? ""}
                onPreClassChange={(v) => onPreClassChange(d, v)}
                homeworkSaving={savingDay === d}
                completed={completed[d] ?? false}
                onToggleCompleted={() => toggleCompleted(d)}
              />
            ))}
            <DayColumn
              id="unassigned"
              label="Unassigned"
              lessons={grouped.unassigned}
              chapterTitle={chapterTitle}
              onPreview={openPreview}
              onToggleCovered={toggleCovered}
              muted
            />
          </div>
          <DragOverlay>
            {activeLesson ? <LessonCard lesson={activeLesson} chapterTitle={chapterTitle(activeLesson.chapter_id)} dragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Dialog open={!!previewId} onOpenChange={(o) => { if (!o) { setPreviewId(null); setPreviewData(null); } }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Lesson preview</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1">
            {previewLoading && <div className="text-sm text-foreground/50 p-4">Loading…</div>}
            {previewData && (
              <LessonPreview
                title={previewData.title}
                lessonType={previewData.lesson_type}
                videoUrl={previewData.video_url}
                contentHtml={previewData.content_html}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DayColumn({
  id,
  label,
  lessons,
  chapterTitle,
  onPreview,
  onToggleCovered,
  muted,
  homework,
  onHomeworkChange,
  preClass,
  onPreClassChange,
  homeworkSaving,
  completed,
  onToggleCompleted,
}: {
  id: string;
  label: string;
  lessons: Lesson[];
  chapterTitle: (id: string | null) => string;
  onPreview: (id: string) => void;
  onToggleCovered?: (lessonId: string) => void;
  muted?: boolean;
  homework?: string;
  onHomeworkChange?: (v: string) => void;
  preClass?: string;
  onPreClassChange?: (v: string) => void;
  homeworkSaving?: boolean;
  completed?: boolean;
  onToggleCompleted?: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const showHomework = typeof onHomeworkChange === "function";
  const showComplete = typeof onToggleCompleted === "function";
  return (
    <div
      ref={setNodeRef}
      className={`glass-card rounded-2xl p-3 min-h-[300px] transition-colors ${
        isOver ? "ring-2 ring-primary/60 bg-primary/5" : ""
      } ${muted ? "opacity-90" : ""} ${completed ? "ring-2 ring-emerald-500/50 bg-emerald-500/5" : ""}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="font-display font-bold">{label}</div>
        <div className="flex items-center gap-2">
          {showComplete && (
            <button
              onClick={onToggleCompleted}
              title={completed ? "Mark day not completed" : "Mark day completed"}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                completed
                  ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                  : "bg-background/50 text-foreground/60 hover:bg-background/70 hover:text-foreground"
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${completed ? "" : "opacity-60"}`} />
              {completed ? "Done" : "Complete"}
            </button>
          )}
          <div className="text-xs text-foreground/50">{lessons.length}</div>
        </div>
      </div>
      {typeof onPreClassChange === "function" && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <div className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">Pre-class message</div>
            {homeworkSaving && <div className="text-[10px] text-foreground/40">Saving…</div>}
          </div>
          <Textarea
            value={preClass ?? ""}
            onChange={(e) => onPreClassChange!(e.target.value)}
            placeholder="Message to send to students before class…"
            className="min-h-[80px] text-sm bg-background/40"
          />
        </div>
      )}
      <SortableContext items={lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {lessons.length === 0 && (
            <div className="text-xs text-foreground/40 text-center py-6 border border-dashed border-border rounded-lg">
              Drop lessons here
            </div>
          )}
          {lessons.map((l) => (
            <SortableLesson key={l.id} lesson={l} chapterTitle={chapterTitle(l.chapter_id)} onPreview={onPreview} onToggleCovered={onToggleCovered} />
          ))}
        </div>
      </SortableContext>
      {showHomework && (
        <div className="mt-3 pt-3 border-t border-border/60">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <div className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">Homework</div>
            {homeworkSaving && <div className="text-[10px] text-foreground/40">Saving…</div>}
          </div>
          <Textarea
            value={homework ?? ""}
            onChange={(e) => onHomeworkChange!(e.target.value)}
            placeholder="Add homework for this day…"
            className="min-h-[160px] text-sm bg-background/40"
          />
        </div>
      )}
    </div>
  );
}



function SortableLesson({ lesson, chapterTitle, onPreview, onToggleCovered }: { lesson: Lesson; chapterTitle: string; onPreview: (id: string) => void; onToggleCovered?: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <LessonCard
        lesson={lesson}
        chapterTitle={chapterTitle}
        dragHandleProps={{ ...attributes, ...listeners }}
        onPreview={() => onPreview(lesson.id)}
        onToggleCovered={onToggleCovered ? () => onToggleCovered(lesson.id) : undefined}
      />
    </div>
  );
}

function LessonCard({
  lesson,
  chapterTitle,
  dragging,
  dragHandleProps,
  onPreview,
  onToggleCovered,
}: {
  lesson: Lesson;
  chapterTitle: string;
  dragging?: boolean;
  dragHandleProps?: any;
  onPreview?: () => void;
  onToggleCovered?: () => void;
}) {
  return (
    <div
      className={`rounded-lg bg-card/60 hover:bg-card border border-border/50 p-2.5 flex items-start gap-2 ${
        dragging ? "shadow-2xl ring-1 ring-primary/40" : ""
      } ${lesson.covered ? "bg-emerald-500/5 border-emerald-500/30" : ""}`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing touch-none"
        {...dragHandleProps}
        aria-label="Drag"
      >
        <GripVertical className="w-3.5 h-3.5 mt-0.5 text-foreground/30 shrink-0" />
      </button>
      {onToggleCovered && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleCovered(); }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
            lesson.covered
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-foreground/30 hover:border-primary bg-background/40"
          }`}
          aria-label={lesson.covered ? "Mark not covered" : "Mark covered"}
          title={lesson.covered ? "Covered — click to uncheck" : "Mark as covered"}
        >
          {lesson.covered && <Check className="w-3 h-3" strokeWidth={3} />}
        </button>
      )}
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-medium truncate ${lesson.covered ? "line-through text-foreground/60" : ""}`}>{lesson.title}</div>
        <div className="text-[11px] text-foreground/50 truncate flex items-center gap-1.5">
          <span className="truncate">{chapterTitle}</span>
          {lesson.status === "draft" && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px]">draft</span>
          )}
        </div>
      </div>
      {onPreview && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPreview(); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-primary/10 text-foreground/60 hover:text-primary shrink-0"
          aria-label="Preview lesson"
          title="Preview"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

}
