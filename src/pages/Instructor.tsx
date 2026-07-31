import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  CollisionDetection,
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
import { ArrowLeft, Calendar as CalendarIcon, Check, ChevronDown, ChevronUp, Copy, Eye, GripVertical, ListChecks, LogOut, StickyNote, Trash2, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LessonPreview from "@/components/admin/LessonPreview";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { classDates, isSameDay, parseDateOnly, toDateOnly } from "@/lib/schedule";

type Lesson = {
  id: string;
  title: string;
  chapter_id: string | null;
  day_number: number | null;
  order_index: number;
  schedule_order: number | null;
  status: string;
  covered: boolean;
};
type Note = {
  id: string;
  title: string;
  day_number: number | null;
  schedule_order: number;
  covered: boolean;
};
type BoardItem = {
  id: string;
  kind: "lesson" | "note";
  title: string;
  day_number: number | null;
  sort: number;
  covered: boolean;
  chapter_id: string | null;
  status: string;
};
type Chapter = { id: string; title: string };

const DAYS = [1, 2, 3, 4, 5, 6, 7] as const;
type ColumnId = `d${number}` | "unassigned";

export default function InstructorPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [homework, setHomework] = useState<Record<number, string>>({});
  const [preClass, setPreClass] = useState<Record<number, string>>({});
  const [preClass2, setPreClass2] = useState<Record<number, string>>({});
  const [preClassEditMode, setPreClassEditMode] = useState<Record<number, { 1: boolean; 2: boolean }>>({});
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [expandedOverride, setExpandedOverride] = useState<Record<number, boolean>>({});
  // Mirrors `completed` but lags behind so a day can visibly collapse before
  // the board re-sorts it to the end.
  const [sortCompleted, setSortCompleted] = useState<Record<number, boolean>>({});
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ title: string; lesson_type: string; video_url: string | null; content_html: string | null } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Let the collapse animation finish before the day column changes position.
  useEffect(() => {
    const t = setTimeout(() => setSortCompleted(completed), 650);
    return () => clearTimeout(t);
  }, [completed]);



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
    const { data: c } = await supabase.from("courses").select("id,start_date").limit(1).maybeSingle();
    if (!c) return;
    setCourseId(c.id);
    setStartDate((c as any).start_date ?? null);
    const [{ data: ls }, { data: ch }, { data: hw }, { data: nt }] = await Promise.all([
      supabase.from("lessons").select("id,title,chapter_id,day_number,order_index,schedule_order,status,covered").eq("course_id", c.id).order("order_index"),
      supabase.from("chapters").select("id,title").eq("course_id", c.id).order("order_index"),
      supabase.from("day_homework").select("day_number,content,pre_class_message,pre_class_message_2,completed"),
      supabase.from("instructor_notes").select("id,title,day_number,schedule_order,covered").order("schedule_order"),
    ]);
    setLessons((ls as Lesson[]) || []);
    setNotes((nt as Note[]) || []);
    setChapters((ch as Chapter[]) || []);
    const hwMap: Record<number, string> = {};
    const pcMap: Record<number, string> = {};
    const pc2Map: Record<number, string> = {};
    const doneMap: Record<number, boolean> = {};
    ((hw as { day_number: number; content: string; pre_class_message: string; pre_class_message_2: string; completed: boolean }[]) || []).forEach((r) => {
      hwMap[r.day_number] = r.content;
      pcMap[r.day_number] = r.pre_class_message ?? "";
      pc2Map[r.day_number] = r.pre_class_message_2 ?? "";
      doneMap[r.day_number] = r.completed ?? false;
    });
    setHomework(hwMap);
    setPreClass(pcMap);
    setPreClass2(pc2Map);
    setCompleted(doneMap);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  useEffect(() => {
    setPreClassEditMode((prev) => {
      const next: Record<number, { 1: boolean; 2: boolean }> = {};
      DAYS.forEach((d) => {
        next[d] = {
          1: prev[d]?.[1] ?? false,
          2: prev[d]?.[2] ?? false,
        };
      });
      return next;
    });
  }, [preClass, preClass2]);

  const hwTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const saveDayField = useCallback((day: number, field: "content" | "pre_class_message" | "pre_class_message_2", value: string) => {
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
  const onPreClass2Change = useCallback((day: number, value: string) => {
    setPreClass2((h) => ({ ...h, [day]: value }));
    saveDayField(day, "pre_class_message_2", value);
  }, [saveDayField]);

  const togglePreClassEditMode = useCallback((day: number, slot: 1 | 2) => {
    setPreClassEditMode((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] ?? { 1: false, 2: false }),
        [slot]: !prev[day]?.[slot],
      },
    }));
  }, []);

  const toggleCompleted = useCallback(async (day: number) => {
    const next = !completed[day];
    const prevLessons = lessons;
    const prevNotes = notes;
    const dayLessonIds = lessons.filter((l) => l.day_number === day).map((l) => l.id);
    const dayNoteIds = notes.filter((n) => n.day_number === day).map((n) => n.id);

    setCompleted((c) => ({ ...c, [day]: next }));
    // Completing a day collapses it; re-opening a day clears any manual override.
    setExpandedOverride((prev) => ({ ...prev, [day]: false }));
    // Marking a day complete implies every item scheduled that day was covered.
    setLessons((ls) => ls.map((l) => (l.day_number === day ? { ...l, covered: next } : l)));
    setNotes((ns) => ns.map((n) => (n.day_number === day ? { ...n, covered: next } : n)));
    setSavingDay(day);

    const [dayRes, lessonRes, noteRes] = await Promise.all([
      supabase.from("day_homework").upsert({ day_number: day, completed: next }, { onConflict: "day_number" }),
      dayLessonIds.length
        ? supabase.from("lessons").update({ covered: next }).in("id", dayLessonIds)
        : Promise.resolve({ error: null } as { error: null }),
      dayNoteIds.length
        ? supabase.from("instructor_notes").update({ covered: next }).in("id", dayNoteIds)
        : Promise.resolve({ error: null } as { error: null }),
    ]);
    setSavingDay((cur) => (cur === day ? null : cur));

    const error = dayRes.error || lessonRes.error || noteRes.error;
    if (error) {
      toast.error(error.message);
      setCompleted((c) => ({ ...c, [day]: !next }));
      setLessons(prevLessons);
      setNotes(prevNotes);
    }
  }, [completed, lessons, notes]);


  const toggleCovered = useCallback(async (itemId: string, kind: "lesson" | "note") => {
    if (kind === "note") {
      const current = notes.find((n) => n.id === itemId);
      if (!current) return;
      const next = !current.covered;
      setNotes((ns) => ns.map((n) => (n.id === itemId ? { ...n, covered: next } : n)));
      const { error } = await supabase.from("instructor_notes").update({ covered: next }).eq("id", itemId);
      if (error) {
        toast.error(error.message);
        setNotes((ns) => ns.map((n) => (n.id === itemId ? { ...n, covered: !next } : n)));
      }
      return;
    }
    const current = lessons.find((l) => l.id === itemId);
    if (!current) return;
    const next = !current.covered;
    setLessons((ls) => ls.map((l) => (l.id === itemId ? { ...l, covered: next } : l)));
    const { error } = await supabase.from("lessons").update({ covered: next }).eq("id", itemId);
    if (error) {
      toast.error(error.message);
      setLessons((ls) => ls.map((l) => (l.id === itemId ? { ...l, covered: !next } : l)));
    }
  }, [lessons, notes]);

  const addNote = useCallback(async (day: number | null) => {
    const maxOrder = notes
      .filter((n) => n.day_number === day)
      .reduce((m, n) => Math.max(m, n.schedule_order), 0);
    const { data, error } = await supabase
      .from("instructor_notes")
      .insert({ title: "New note", day_number: day, schedule_order: maxOrder + 1 })
      .select("id,title,day_number,schedule_order,covered")
      .maybeSingle();
    if (error || !data) {
      toast.error(error?.message ?? "Could not add note");
      return;
    }
    setNotes((ns) => [...ns, data as Note]);
  }, [notes]);

  const updateNoteTitle = useCallback(async (id: string, title: string) => {
    setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, title } : n)));
    const { error } = await supabase.from("instructor_notes").update({ title }).eq("id", id);
    if (error) toast.error(error.message);
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    const prev = notes;
    setNotes((ns) => ns.filter((n) => n.id !== id));
    const { error } = await supabase.from("instructor_notes").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      setNotes(prev);
    }
  }, [notes]);


  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const columnIds = useMemo<ColumnId[]>(
    () => ["unassigned", ...DAYS.map((d) => `d${d}` as ColumnId)],
    []
  );

  const isColumnId = useCallback(
    (id: string): id is ColumnId => columnIds.includes(id as ColumnId),
    [columnIds]
  );

  const isTopDropId = useCallback(
    (id: string) => id === "unassigned:top" || /^d[1-7]:top$/.test(id),
    []
  );

  // Prefer real lesson hits for ordering. Column/list hits are only fallbacks
  // for appending, while the explicit :top targets insert at the start of a day.
  const collisionDetection: CollisionDetection = useCallback(
    (args) => {
      const isLessonTarget = (id: string) => !isColumnId(id) && !isTopDropId(id) && id !== String(args.active.id);
      const pointerHits = pointerWithin(args);
      const lessonPointerHits = pointerHits.filter((c) => isLessonTarget(String(c.id)));
      if (lessonPointerHits.length) return lessonPointerHits;

      const topHit = pointerHits.find((c) => isTopDropId(String(c.id)));
      if (topHit) return [topHit];

      const columnHit = pointerHits.find((c) => isColumnId(String(c.id)));
      if (columnHit) return [columnHit];

      const intersections = rectIntersection(args);
      const lessonIntersectionHits = intersections.filter((c) => isLessonTarget(String(c.id)));
      if (lessonIntersectionHits.length) return lessonIntersectionHits;

      const intersectingTop = intersections.find((c) => isTopDropId(String(c.id)));
      if (intersectingTop) return [intersectingTop];

      const intersectingColumn = intersections.find((c) => isColumnId(String(c.id)));
      if (intersectingColumn) return [intersectingColumn];

      const corners = closestCorners(args);
      const lessonCornerHits = corners.filter((c) => isLessonTarget(String(c.id)));
      if (lessonCornerHits.length) return lessonCornerHits;

      const first = getFirstCollision(corners);
      return first ? corners : intersections;
    },
    [isColumnId, isTopDropId]
  );

  const chapterTitle = (id: string | null) =>
    chapters.find((c) => c.id === id)?.title ?? "—";

  const columnOfDay = (day: number | null): ColumnId =>
    day ? (`d${day}` as ColumnId) : "unassigned";

  const items = useMemo<BoardItem[]>(() => {
    const lessonItems: BoardItem[] = lessons.map((l) => ({
      id: l.id,
      kind: "lesson",
      title: l.title,
      day_number: l.day_number,
      sort: l.schedule_order ?? l.order_index,
      covered: l.covered,
      chapter_id: l.chapter_id,
      status: l.status,
    }));
    const noteItems: BoardItem[] = notes.map((n) => ({
      id: n.id,
      kind: "note",
      title: n.title,
      day_number: n.day_number,
      sort: n.schedule_order,
      covered: n.covered,
      chapter_id: null,
      status: "note",
    }));
    return [...lessonItems, ...noteItems];
  }, [lessons, notes]);

  const grouped = useMemo(() => {
    const map: Record<ColumnId, BoardItem[]> = { unassigned: [] } as any;
    DAYS.forEach((d) => (map[`d${d}` as ColumnId] = []));
    for (const it of items) map[columnOfDay(it.day_number)].push(it);
    (Object.keys(map) as ColumnId[]).forEach((k) => map[k].sort((a, b) => a.sort - b.sort));
    return map;
  }, [items]);

  const activeItem = activeId ? items.find((i) => i.id === activeId) ?? null : null;

  const findColumn = (id: string): ColumnId | null => {
    if (id.endsWith(":top")) return findColumn(id.replace(":top", ""));
    if (id === "unassigned") return "unassigned";
    if (/^d[1-7]$/.test(id)) return id as ColumnId;
    const it = items.find((x) => x.id === id);
    return it ? columnOfDay(it.day_number) : null;
  };

  const onDragEnd = async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    const fromCol = findColumn(activeIdStr);
    // Prefer the sortable container the pointer is inside; fall back to resolving from the over id.
    const overData = (over.data.current as any) ?? {};
    const overContainer = overData.sortable?.containerId as ColumnId | undefined;
    const explicitColumn = overData.columnId as ColumnId | undefined;
    const toCol = overContainer ?? explicitColumn ?? findColumn(overIdStr);
    const insertAtTop = overData.position === "start" || overIdStr.endsWith(":top");
    if (!fromCol || !toCol) return;
    if (toCol !== "unassigned") {
      const targetDay = Number(toCol.replace("d", ""));
      setExpandedOverride((prev) => (prev[targetDay] ? prev : { ...prev, [targetDay]: true }));
    }

    const prevLessons = lessons;
    const prevNotes = notes;
    const fromList = [...grouped[fromCol]];
    const toList = fromCol === toCol ? fromList : [...grouped[toCol]];

    const activeIdx = fromList.findIndex((l) => l.id === activeIdStr);
    if (activeIdx === -1) return;

    let newToList: BoardItem[];
    let newFromList: BoardItem[] = fromList;

    if (fromCol === toCol) {
      const overIdx =
        insertAtTop
          ? 0
          : overIdStr === toCol
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
        insertAtTop
          ? 0
          : overIdStr === toCol
          ? toList.length
          : toList.findIndex((l) => l.id === overIdStr);
      const insertAt = overIdx === -1 ? toList.length : overIdx;
      newToList = [...toList.slice(0, insertAt), updatedMoved, ...toList.slice(insertAt)];
      newFromList = fromList;
    }

    // Compute new schedule_order using base offsets per column so we don't clash globally
    const colBase: Record<ColumnId, number> = {} as any;
    (["unassigned", ...DAYS.map((d) => `d${d}` as ColumnId)] as ColumnId[]).forEach(
      (k, i) => (colBase[k] = i * 1000)
    );

    const updates: { id: string; kind: "lesson" | "note"; day_number: number | null; schedule_order: number }[] = [];
    const applyList = (col: ColumnId, list: BoardItem[]) => {
      list.forEach((l, i) => {
        const day = col === "unassigned" ? null : Number(col.replace("d", ""));
        const schedule_order = colBase[col] + i;
        if (l.day_number !== day || l.sort !== schedule_order) {
          updates.push({ id: l.id, kind: l.kind, day_number: day, schedule_order });
        }
      });
    };
    applyList(toCol, newToList);
    if (fromCol !== toCol) applyList(fromCol, newFromList);

    // Optimistic update
    const lessonUpdates = updates.filter((u) => u.kind === "lesson");
    const noteUpdates = updates.filter((u) => u.kind === "note");
    if (lessonUpdates.length) {
      const byId = new Map(lessonUpdates.map((u) => [u.id, u]));
      setLessons((ls) =>
        ls.map((l) => {
          const u = byId.get(l.id);
          return u ? { ...l, day_number: u.day_number, schedule_order: u.schedule_order } : l;
        })
      );
    }
    if (noteUpdates.length) {
      const byId = new Map(noteUpdates.map((u) => [u.id, u]));
      setNotes((ns) =>
        ns.map((n) => {
          const u = byId.get(n.id);
          return u ? { ...n, day_number: u.day_number, schedule_order: u.schedule_order } : n;
        })
      );
    }

    const results = await Promise.all(
      updates.map((u) =>
        supabase
          .from(u.kind === "note" ? "instructor_notes" : "lessons")
          .update({ day_number: u.day_number, schedule_order: u.schedule_order })
          .eq("id", u.id)
      )
    );
    const error = results.find((r) => r.error)?.error;
    if (error) {
      toast.error(error.message);
      setLessons(prevLessons);
      setNotes(prevNotes);
    }
  };

  const saveStartDate = useCallback(async (d: Date | undefined) => {
    if (!courseId || !d) return;
    const value = toDateOnly(d);
    const prev = startDate;
    setStartDate(value);
    const { error } = await supabase.from("courses").update({ start_date: value } as any).eq("id", courseId);
    if (error) {
      toast.error(error.message);
      setStartDate(prev);
    } else {
      toast.success("Day 1 date saved");
    }
  }, [courseId, startDate]);

  const day1 = parseDateOnly(startDate);
  const dayDates = useMemo(
    () => (day1 ? classDates(day1, DAYS.length) : null),
    [startDate],
  );

  const stats = useMemo(() => {
    const scheduled = [
      ...lessons.filter((l) => l.day_number != null),
      ...notes.filter((n) => n.day_number != null),
    ];
    const total = scheduled.length;
    const covered = scheduled.filter((i) => i.covered).length;
    const daysDone = DAYS.filter((d) => completed[d]).length;
    // Course progress is driven by completed class days, not individual items.
    const pct = DAYS.length ? Math.round((daysDone / DAYS.length) * 100) : 0;
    const nextDayIndex = DAYS.findIndex((d) => !completed[d]);
    const nextDate =
      dayDates && nextDayIndex >= 0 ? dayDates[nextDayIndex] : null;
    return { total, covered, pct, daysDone, nextDayIndex, nextDate };
  }, [lessons, notes, completed, dayDates]);



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
        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="glass-card rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-foreground/60 mb-1">
              <TrendingUp className="w-3 h-3" /> Course completed
            </div>
            <div className="font-display text-2xl font-bold leading-none">{stats.pct}%</div>
            <div className="mt-1.5 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${stats.pct}%` }}
              />
            </div>
            <div className="mt-1 text-[11px] text-foreground/50">
              {stats.daysDone} of {DAYS.length} class days completed
            </div>
          </div>

          <div className="glass-card rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-foreground/60 mb-1">
              <ListChecks className="w-3 h-3" /> Items covered
            </div>
            <div className="font-display text-2xl font-bold leading-none">
              {stats.covered}
              <span className="text-foreground/40 text-base font-semibold"> / {stats.total}</span>
            </div>
            <div className="mt-1 text-[11px] text-foreground/50">Lessons + notes on the schedule</div>
          </div>

          <div className="glass-card rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-foreground/60 mb-1">
              <Check className="w-3 h-3" /> Days completed
            </div>
            <div className="font-display text-2xl font-bold leading-none">
              {stats.daysDone}
              <span className="text-foreground/40 text-base font-semibold"> / {DAYS.length}</span>
            </div>
            <div className="mt-1 text-[11px] text-foreground/50">
              {stats.nextDate
                ? `Next class: ${format(stats.nextDate, "EEE, MMM d")}`
                : stats.nextDayIndex >= 0
                ? `Next: Day ${DAYS[stats.nextDayIndex]}`
                : "All days done 🎉"}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-foreground/60 mb-1">
              <CalendarIcon className="w-3 h-3" /> Day 1 date
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full h-8 justify-start text-left font-normal text-xs">
                  <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />
                  {day1 ? format(day1, "EEE, MMM d, yyyy") : <span className="text-muted-foreground">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={day1 ?? undefined}
                  onSelect={(d) => saveStartDate(d)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <div className="mt-1 text-[11px] text-foreground/50">
              Following days fall on Mon / Wed / Fri.
            </div>
          </div>
        </div>

        <p className="text-sm text-foreground/60 mb-4">
          Drag lessons between days, or reorder within a day. Changes save automatically.
        </p>
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {grouped["unassigned"].length > 0 && (
            <DayColumn
              id="unassigned"
              label="Unassigned"
              items={grouped["unassigned"]}
              chapterTitle={chapterTitle}
              onPreview={openPreview}
              onToggleCovered={toggleCovered}
              muted
            />
            )}
            {DAYS.map((d) => ({ d, i: DAYS.indexOf(d) }))
              .sort((a, b) => Number(sortCompleted[a.d] ?? false) - Number(sortCompleted[b.d] ?? false))
              .map(({ d, i }) => (
              <DayColumn
                key={d}
                id={`d${d}`}
                label={`Day ${d}`}
                dateLabel={dayDates ? format(dayDates[i], "EEE, MMM d") : undefined}
                isToday={dayDates ? isSameDay(dayDates[i], new Date()) : false}
                items={grouped[`d${d}` as ColumnId]}

                chapterTitle={chapterTitle}
                onPreview={openPreview}
                onToggleCovered={toggleCovered}
                onAddNote={() => addNote(d)}
                onRenameNote={updateNoteTitle}
                onDeleteNote={deleteNote}
                homework={homework[d] ?? ""}
                onHomeworkChange={(v) => onHomeworkChange(d, v)}
                preClass={preClass[d] ?? ""}
                onPreClassChange={(v) => onPreClassChange(d, v)}
                preClass2={preClass2[d] ?? ""}
                onPreClass2Change={(v) => onPreClass2Change(d, v)}
                preClassEditMode={preClassEditMode[d]?.[1] ?? false}
                preClass2EditMode={preClassEditMode[d]?.[2] ?? false}
                onTogglePreClassEditMode={() => togglePreClassEditMode(d, 1)}
                onTogglePreClass2EditMode={() => togglePreClassEditMode(d, 2)}
                homeworkSaving={savingDay === d}
                completed={completed[d] ?? false}
                onToggleCompleted={() => toggleCompleted(d)}
                collapsed={(completed[d] ?? false) && !expandedOverride[d]}
                onToggleCollapsed={() =>
                  setExpandedOverride((prev) => ({ ...prev, [d]: !prev[d] }))
                }
              />
            ))}
          </div>
          <DragOverlay>
            {activeItem ? (
              activeItem.kind === "note" ? (
                <NoteCard item={activeItem} dragging />
              ) : (
                <LessonCard item={activeItem} chapterTitle={chapterTitle(activeItem.chapter_id)} dragging />
              )
            ) : null}
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

function PreClassField({
  label,
  value,
  isEditing,
  onToggleEdit,
  onChange,
  saving,
  placeholder,
}: {
  label: string;
  value: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  onChange: (v: string) => void;
  saving: boolean;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const prevIsEditing = useRef(isEditing);
  useEffect(() => {
    if (isEditing && !prevIsEditing.current) {
      setOpen(true);
    } else if (!isEditing && prevIsEditing.current) {
      setOpen(false);
    }
    prevIsEditing.current = isEditing;
  }, [isEditing]);
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-foreground/50 font-semibold hover:text-foreground transition-colors"
        >
          {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {label}
        </button>
        <div className="flex items-center gap-2">
          {saving && <div className="text-[10px] text-foreground/40">Saving…</div>}
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(value ?? "");
                toast.success("Copied to clipboard");
              } catch {
                toast.error("Failed to copy");
              }
            }}
            className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-background/50 text-foreground/70 hover:bg-background/70 hover:text-foreground transition-colors"
            title="Copy message"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={onToggleEdit}
            className="text-[11px] px-2 py-0.5 rounded-md bg-background/50 text-primary hover:bg-background/70 transition-colors"
          >
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>
      </div>
      {open ? (
        isEditing ? (
          <AutoTextarea
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            className="min-h-[140px] text-sm bg-background/40"
            autoFocus
          />
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={onToggleEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggleEdit();
              }
            }}
            className="text-sm bg-background/40 rounded-md border border-border p-3 min-h-[56px] text-foreground/80 whitespace-pre-wrap cursor-text hover:bg-background/50 transition-colors"
          >
            {value ? value : <span className="text-foreground/40 italic">{placeholder}</span>}
          </div>
        )
      ) : (
        <button
          onClick={() => {
            setOpen(true);
            if (!value) onToggleEdit();
          }}
          className="w-full text-left text-sm bg-background/40 rounded-md border border-border p-3 text-foreground/80 whitespace-pre-wrap relative overflow-hidden max-h-[84px] hover:bg-background/50 transition-colors"
        >
          {value ? value : <span className="text-foreground/40 italic">{placeholder}</span>}
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </button>
      )}

    </div>
  );
}

function HomeworkField({
  value,
  onChange,
  saving,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  saving: boolean;
  placeholder: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 px-1">
        <div className="text-[11px] uppercase tracking-wide text-foreground/50 font-semibold">Homework</div>
        <div className="flex items-center gap-2">
          {saving && <div className="text-[10px] text-foreground/40">Saving…</div>}
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(value ?? "");
                toast.success("Copied to clipboard");
              } catch {
                toast.error("Failed to copy");
              }
            }}
            className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-background/50 text-foreground/70 hover:bg-background/70 hover:text-foreground transition-colors"
            title="Copy homework"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsEditing((e) => !e)}
            className="text-[11px] px-2 py-0.5 rounded-md bg-background/50 text-primary hover:bg-background/70 transition-colors"
          >
            {isEditing ? "Done" : "Edit"}
          </button>
        </div>
      </div>
      {isEditing ? (
        <AutoTextarea
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className="min-h-[160px] text-sm bg-background/40"
          autoFocus
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full text-left text-sm bg-background/40 rounded-md border border-border p-3 min-h-[160px] text-foreground/80 whitespace-pre-wrap hover:bg-background/50 transition-colors"
        >
          {value ? value : <span className="text-foreground/40 italic">{placeholder}</span>}
        </button>
      )}
    </div>
  );
}

function AutoTextarea({
  value,
  onChange,
  placeholder,
  className,
  autoFocus,
  onBlur,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onBlur?: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, el.offsetHeight)}px`;
  }, [value]);
  return (
    <Textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={className}
      autoFocus={autoFocus}
      rows={1}
    />
  );
}

function DayColumn({
  id,
  label,
  dateLabel,
  isToday,
  items,
  chapterTitle,
  onPreview,
  onToggleCovered,
  onAddNote,
  onRenameNote,
  onDeleteNote,
  muted,
  homework,
  onHomeworkChange,
  preClass,
  onPreClassChange,
  preClass2,
  onPreClass2Change,
  preClassEditMode,
  preClass2EditMode,
  onTogglePreClassEditMode,
  onTogglePreClass2EditMode,
  homeworkSaving,
  completed,
  onToggleCompleted,
  collapsed,
  onToggleCollapsed,
}: {
  id: string;
  label: string;
  dateLabel?: string;
  isToday?: boolean;
  items: BoardItem[];
  chapterTitle: (id: string | null) => string;
  onPreview: (id: string) => void;
  onToggleCovered?: (itemId: string, kind: "lesson" | "note") => void;
  onAddNote?: () => void;
  onRenameNote?: (id: string, title: string) => void;
  onDeleteNote?: (id: string) => void;
  muted?: boolean;
  homework?: string;
  onHomeworkChange?: (v: string) => void;
  preClass?: string;
  onPreClassChange?: (v: string) => void;
  preClass2?: string;
  onPreClass2Change?: (v: string) => void;
  preClassEditMode?: boolean;
  preClass2EditMode?: boolean;
  onTogglePreClassEditMode?: () => void;
  onTogglePreClass2EditMode?: () => void;
  homeworkSaving?: boolean;
  completed?: boolean;
  onToggleCompleted?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { columnId: id } });
  const { setNodeRef: setTopDropRef, isOver: isTopOver } = useDroppable({
    id: `${id}:top`,
    data: { columnId: id, position: "start" },
  });
  const showHomework = typeof onHomeworkChange === "function";
  const showComplete = typeof onToggleCompleted === "function";
  const [showCovered, setShowCovered] = useState(false);
  const coveredCount = items.filter((i) => i.covered).length;

  const list = (
    <SortableContext id={id} items={items.map((l) => l.id)} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="space-y-2 min-h-[72px]">
        <div
          ref={setTopDropRef}
          className={`h-3 rounded-md border border-dashed transition-colors ${
            isTopOver ? "border-primary/70 bg-primary/15" : "border-transparent"
          }`}
        />
        {items.length === 0 && (
          <div className="text-xs text-foreground/40 text-center py-6 border border-dashed border-border rounded-lg">
            Drop lessons here
          </div>
        )}
        {items.map((it) => (
          <SortableItem
            key={it.id}
            item={it}
            chapterTitle={chapterTitle(it.chapter_id)}
            onPreview={onPreview}
            onToggleCovered={onToggleCovered}
            onRenameNote={onRenameNote}
            onDeleteNote={onDeleteNote}
            revealed={showCovered}
          />
        ))}
        {onAddNote && (
          <button
            type="button"
            onClick={onAddNote}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] py-1.5 rounded-lg border border-dashed border-note/40 text-note hover:bg-note/10 transition-colors"
          >
            <StickyNote className="w-3.5 h-3.5" /> Add note
          </button>
        )}
        {coveredCount > 0 && (
          <button
            type="button"
            onClick={() => setShowCovered((s) => !s)}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            {showCovered ? "Hide covered" : `${coveredCount} covered`}
          </button>
        )}
      </div>
    </SortableContext>
  );

  return (
    <div
      ref={collapsed ? setNodeRef : undefined}
      className={`glass-card rounded-2xl p-3 transition-all duration-500 ease-in-out ${collapsed ? "min-h-0 self-start" : "min-h-[300px]"} ${
        isOver ? "ring-2 ring-primary/60 bg-primary/5" : ""
      } ${muted ? "opacity-90" : ""} ${completed ? "ring-2 ring-emerald-500/50 bg-emerald-500/5" : ""} ${
        isToday && !completed ? "ring-2 ring-primary/50" : ""
      }`}
    >
      <div className={`flex items-center justify-between px-1 ${collapsed ? "" : "mb-3"}`}>
        <div
          className={`min-w-0 flex items-center gap-2 ${onToggleCollapsed ? "cursor-pointer" : ""}`}
          onClick={onToggleCollapsed}
        >
          {onToggleCollapsed && (
            <span className="text-foreground/50">
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </span>
          )}
          <div className="min-w-0">
            <div className="font-display font-bold flex items-center gap-2">
              {label}
              {isToday && (
                <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-semibold uppercase">
                  Today
                </span>
              )}
            </div>
            {dateLabel && <div className="text-[11px] text-foreground/50">{dateLabel}</div>}
          </div>
        </div>
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
          <div className="text-xs text-foreground/50">{items.length}</div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: collapsed ? "0fr" : "1fr",
          opacity: collapsed ? 0 : 1,
          transition: "grid-template-rows 0.55s ease-in-out, opacity 0.4s ease-in-out",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          {typeof onPreClassChange === "function" && (
            <PreClassField
              label="Pre-class message 1"
              value={preClass ?? ""}
              isEditing={preClassEditMode ?? false}
              onToggleEdit={onTogglePreClassEditMode!}
              onChange={onPreClassChange!}
              saving={homeworkSaving ?? false}
              placeholder="Message to send to students before class…"
            />
          )}
          {typeof onPreClass2Change === "function" && (
            <PreClassField
              label="Pre-class message 2"
              value={preClass2 ?? ""}
              isEditing={preClass2EditMode ?? false}
              onToggleEdit={onTogglePreClass2EditMode!}
              onChange={onPreClass2Change!}
              saving={homeworkSaving ?? false}
              placeholder="Second message to send to students before class…"
            />
          )}
          {typeof onPreClassChange === "function" ? (
            <div className="mt-3 pt-3 border-t border-border/60">{list}</div>
          ) : (
            list
          )}
          {showHomework && (
            <div className="mt-3 pt-3 border-t border-border/60">
              <HomeworkField
                value={homework ?? ""}
                onChange={onHomeworkChange!}
                saving={homeworkSaving ?? false}
                placeholder="Add homework for this day…"
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

function SortableItem({
  item,
  chapterTitle,
  onPreview,
  onToggleCovered,
  onRenameNote,
  onDeleteNote,
  revealed,
}: {
  item: BoardItem;
  chapterTitle: string;
  onPreview: (id: string) => void;
  onToggleCovered?: (id: string, kind: "lesson" | "note") => void;
  onRenameNote?: (id: string, title: string) => void;
  onDeleteNote?: (id: string) => void;
  revealed?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const collapsed = item.covered && !revealed;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    marginTop: collapsed ? 0 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <AnimatedCard covered={item.covered} revealed={revealed}>
        {item.kind === "note" ? (
          <NoteCard
            item={item}
            dragHandleProps={{ ...attributes, ...listeners }}
            onToggleCovered={onToggleCovered ? () => onToggleCovered(item.id, "note") : undefined}
            onRename={onRenameNote ? (title) => onRenameNote(item.id, title) : undefined}
            onDelete={onDeleteNote ? () => onDeleteNote(item.id) : undefined}
          />
        ) : (
          <LessonCard
            item={item}
            chapterTitle={chapterTitle}
            dragHandleProps={{ ...attributes, ...listeners }}
            onPreview={() => onPreview(item.id)}
            onToggleCovered={onToggleCovered ? () => onToggleCovered(item.id, "lesson") : undefined}
          />
        )}
      </AnimatedCard>
    </div>
  );
}

/**
 * Smoothly collapses a card to zero height when it's marked covered (and not
 * revealed), so the instructor can't accidentally double-toggle it. Expands
 * back when revealed or un-checked. Uses the grid-template-rows 1fr/0fr trick
 * so no height measuring is required.
 */
function AnimatedCard({
  covered,
  revealed,
  children,
}: {
  covered: boolean;
  revealed?: boolean;
  children: ReactNode;
}) {
  const collapsed = covered && !revealed;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: collapsed ? "0fr" : "1fr",
        opacity: collapsed ? 0 : 1,
        pointerEvents: collapsed ? "none" : "auto",
        transition:
          "grid-template-rows 0.45s ease-in-out, opacity 0.35s ease-in-out",
      }}
    >
      <div style={{ overflow: "hidden", minHeight: collapsed ? 0 : undefined }}>
        {children}
      </div>
    </div>
  );
}

function CoveredCheckbox({
  covered,
  onToggle,
  tone,
}: {
  covered: boolean;
  onToggle: () => void;
  tone: "default" | "note";
}) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      onPointerDown={(e) => e.stopPropagation()}
      className={`mt-0.5 w-4 h-4 shrink-0 rounded border flex items-center justify-center transition-colors ${
        covered
          ? "bg-emerald-500 border-emerald-500 text-white"
          : tone === "note"
          ? "border-note/50 hover:border-note bg-background/40"
          : "border-foreground/30 hover:border-primary bg-background/40"
      }`}
      aria-label={covered ? "Mark not covered" : "Mark covered"}
      title={covered ? "Covered — click to uncheck" : "Mark as covered"}
    >
      {covered && <Check className="w-3 h-3" strokeWidth={3} />}
    </button>
  );
}

function LessonCard({
  item,
  chapterTitle,
  dragging,
  dragHandleProps,
  onPreview,
  onToggleCovered,
}: {
  item: BoardItem;
  chapterTitle: string;
  dragging?: boolean;
  dragHandleProps?: any;
  onPreview?: () => void;
  onToggleCovered?: () => void;
}) {
  return (
    <div
      className={`rounded-lg bg-card/60 hover:bg-card border border-muted-foreground/30 p-2.5 flex items-start gap-2 ${
        dragging ? "shadow-2xl ring-1 ring-primary/40" : ""
      } ${item.covered ? "bg-emerald-500/5 border-emerald-500/20" : ""}`}
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
        <CoveredCheckbox covered={item.covered} onToggle={onToggleCovered} tone="default" />
      )}
      <div className="min-w-0 flex-1 flex items-center gap-2">
        <div className={`text-sm font-medium truncate flex-1 min-w-[50%] ${item.covered ? "line-through text-foreground/60" : ""}`}>{item.title}</div>
        <div className="text-[11px] text-foreground/50 truncate flex items-center gap-1.5 shrink-0 max-w-[40%]">
          <span className="truncate">{chapterTitle}</span>
          {item.status === "draft" && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] shrink-0">draft</span>
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

function NoteCard({
  item,
  dragging,
  dragHandleProps,
  onToggleCovered,
  onRename,
  onDelete,
}: {
  item: BoardItem;
  dragging?: boolean;
  dragHandleProps?: any;
  onToggleCovered?: () => void;
  onRename?: (title: string) => void;
  onDelete?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.title);
  useEffect(() => setValue(item.title), [item.title]);

  return (
    <div
      className={`rounded-lg border-l-4 border border-note/40 border-l-note bg-note/10 hover:bg-note/15 p-2.5 flex items-start gap-2 ${
        dragging ? "shadow-2xl ring-1 ring-note/50" : ""
      } ${item.covered ? "opacity-80" : ""}`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing touch-none"
        {...dragHandleProps}
        aria-label="Drag"
      >
        <GripVertical className="w-3.5 h-3.5 mt-0.5 text-note/60 shrink-0" />
      </button>
      {onToggleCovered && (
        <CoveredCheckbox covered={item.covered} onToggle={onToggleCovered} tone="note" />
      )}
      <div className="min-w-0 flex-1 flex items-center gap-2">
        {editing && onRename ? (
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPointerDown={(e) => e.stopPropagation()}
            onBlur={() => {
              setEditing(false);
              if (value.trim() !== item.title) onRename(value.trim());
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") { setValue(item.title); setEditing(false); }
            }}
            className="flex-1 min-w-0 bg-background/50 border border-note/40 rounded px-1.5 py-0.5 text-sm outline-none focus:border-note"
          />
        ) : (
          <button
            type="button"
            onClick={() => onRename && setEditing(true)}
            onPointerDown={(e) => e.stopPropagation()}
            className={`text-sm font-medium truncate flex-1 text-left ${item.covered ? "line-through text-foreground/60" : ""}`}
          >
            {item.title || "Untitled note"}
          </button>
        )}
        <span className="px-1.5 py-0.5 rounded bg-note/20 text-note text-[10px] shrink-0 flex items-center gap-1">
          <StickyNote className="w-3 h-3" /> Note
        </span>
      </div>
      {onDelete && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1 rounded hover:bg-destructive/10 text-foreground/50 hover:text-destructive shrink-0"
          aria-label="Delete note"
          title="Delete note"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
