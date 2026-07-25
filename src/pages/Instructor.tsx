import { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, GripVertical, LogOut } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  chapter_id: string | null;
  day_number: number | null;
  order_index: number;
  status: string;
};
type Chapter = { id: string; title: string };

const DAYS = [1, 2, 3, 4, 5, 6, 7] as const;

export default function InstructorPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

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
    const [{ data: ls }, { data: ch }] = await Promise.all([
      supabase.from("lessons").select("id,title,chapter_id,day_number,order_index,status").eq("course_id", c.id).order("order_index"),
      supabase.from("chapters").select("id,title").eq("course_id", c.id).order("order_index"),
    ]);
    setLessons((ls as Lesson[]) || []);
    setChapters((ch as Chapter[]) || []);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const chapterTitle = (id: string | null) =>
    chapters.find((c) => c.id === id)?.title ?? "—";

  const grouped = useMemo(() => {
    const map: Record<string, Lesson[]> = { unassigned: [] };
    DAYS.forEach((d) => (map[`d${d}`] = []));
    for (const l of lessons) {
      const key = l.day_number ? `d${l.day_number}` : "unassigned";
      map[key].push(l);
    }
    return map;
  }, [lessons]);

  const activeLesson = activeId ? lessons.find((l) => l.id === activeId) : null;

  const onDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const overId = String(over.id);
    const lesson = lessons.find((l) => l.id === active.id);
    if (!lesson) return;
    const nextDay = overId === "unassigned" ? null : Number(overId.replace("d", ""));
    if (lesson.day_number === nextDay) return;
    const prev = lessons;
    setLessons((p) => p.map((l) => (l.id === lesson.id ? { ...l, day_number: nextDay } : l)));
    const { error } = await supabase
      .from("lessons")
      .update({ day_number: nextDay })
      .eq("id", lesson.id);
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
          Drag lessons into a day to plan the 7 class sessions. Changes save automatically.
        </p>
        <DndContext
          sensors={sensors}
          onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {DAYS.map((d) => (
              <DayColumn
                key={d}
                id={`d${d}`}
                label={`Day ${d}`}
                lessons={grouped[`d${d}`]}
                chapterTitle={chapterTitle}
              />
            ))}
            <DayColumn
              id="unassigned"
              label="Unassigned"
              lessons={grouped.unassigned}
              chapterTitle={chapterTitle}
              muted
            />
          </div>
          <DragOverlay>
            {activeLesson ? <LessonCard lesson={activeLesson} chapterTitle={chapterTitle(activeLesson.chapter_id)} dragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

function DayColumn({
  id,
  label,
  lessons,
  chapterTitle,
  muted,
}: {
  id: string;
  label: string;
  lessons: Lesson[];
  chapterTitle: (id: string | null) => string;
  muted?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`glass-card rounded-2xl p-3 min-h-[300px] transition-colors ${
        isOver ? "ring-2 ring-primary/60 bg-primary/5" : ""
      } ${muted ? "opacity-90" : ""}`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="font-display font-bold">{label}</div>
        <div className="text-xs text-foreground/50">{lessons.length}</div>
      </div>
      <div className="space-y-2">
        {lessons.length === 0 && (
          <div className="text-xs text-foreground/40 text-center py-6 border border-dashed border-border rounded-lg">
            Drop lessons here
          </div>
        )}
        {lessons.map((l) => (
          <DraggableLesson key={l.id} lesson={l} chapterTitle={chapterTitle(l.chapter_id)} />
        ))}
      </div>
    </div>
  );
}

function DraggableLesson({ lesson, chapterTitle }: { lesson: Lesson; chapterTitle: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lesson.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`${isDragging ? "opacity-40" : ""}`}
    >
      <LessonCard lesson={lesson} chapterTitle={chapterTitle} />
    </div>
  );
}

function LessonCard({
  lesson,
  chapterTitle,
  dragging,
}: {
  lesson: Lesson;
  chapterTitle: string;
  dragging?: boolean;
}) {
  return (
    <div
      className={`rounded-lg bg-card/60 hover:bg-card border border-border/50 p-2.5 cursor-grab active:cursor-grabbing flex items-start gap-2 ${
        dragging ? "shadow-2xl ring-1 ring-primary/40" : ""
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 mt-0.5 text-foreground/30 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{lesson.title}</div>
        <div className="text-[11px] text-foreground/50 truncate flex items-center gap-1.5">
          <span className="truncate">{chapterTitle}</span>
          {lesson.status === "draft" && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px]">draft</span>
          )}
        </div>
      </div>
    </div>
  );
}
