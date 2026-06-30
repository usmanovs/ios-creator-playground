import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  LogOut,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  cover_image: string | null;
};
type Chapter = { id: string; course_id: string; title: string; order_index: number };
type Lesson = {
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
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Auth check
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
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      const admin = !!roles?.some((r: any) => r.role === "admin");
      setIsAdmin(admin);
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
          <p className="text-foreground/60">
            Your account does not have admin access.
          </p>
          <Button onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}>
            Sign out
          </Button>
        </div>
      </div>
    );

  const saveCourse = async () => {
    if (!course) return;
    const { error } = await supabase
      .from("courses")
      .update({
        title: course.title,
        description: course.description,
        image_url: course.image_url,
        cover_image: course.cover_image,
      })
      .eq("id", course.id);
    if (error) return toast.error(error.message);
    toast.success("Course saved");
  };

  const addChapter = async () => {
    if (!course) return;
    const next = (chapters.at(-1)?.order_index ?? -1) + 1;
    const { error } = await supabase
      .from("chapters")
      .insert({ course_id: course.id, title: "New chapter", order_index: next });
    if (error) return toast.error(error.message);
    load();
  };

  const renameChapter = async (ch: Chapter, title: string) => {
    const { error } = await supabase.from("chapters").update({ title }).eq("id", ch.id);
    if (error) return toast.error(error.message);
    setChapters((p) => p.map((x) => (x.id === ch.id ? { ...x, title } : x)));
  };

  const deleteChapter = async (ch: Chapter) => {
    if (!confirm(`Delete chapter "${ch.title}" and all its lessons?`)) return;
    await supabase.from("lessons").delete().eq("chapter_id", ch.id);
    const { error } = await supabase.from("chapters").delete().eq("id", ch.id);
    if (error) return toast.error(error.message);
    load();
  };

  const moveChapter = async (ch: Chapter, dir: -1 | 1) => {
    const idx = chapters.findIndex((c) => c.id === ch.id);
    const swap = chapters[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("chapters").update({ order_index: swap.order_index }).eq("id", ch.id),
      supabase.from("chapters").update({ order_index: ch.order_index }).eq("id", swap.id),
    ]);
    load();
  };

  const addLesson = async (chapterId: string) => {
    if (!course) return;
    const inCh = lessons.filter((l) => l.chapter_id === chapterId);
    const next = (inCh.at(-1)?.order_index ?? -1) + 1;
    const { error } = await supabase.from("lessons").insert({
      course_id: course.id,
      chapter_id: chapterId,
      title: "New lesson",
      order_index: next,
      lesson_type: "video",
      status: "draft",
    });
    if (error) return toast.error(error.message);
    load();
  };

  const deleteLesson = async (l: Lesson) => {
    if (!confirm(`Delete lesson "${l.title}"?`)) return;
    const { error } = await supabase.from("lessons").delete().eq("id", l.id);
    if (error) return toast.error(error.message);
    load();
  };

  const moveLesson = async (l: Lesson, dir: -1 | 1) => {
    const peers = lessons.filter((x) => x.chapter_id === l.chapter_id);
    const idx = peers.findIndex((x) => x.id === l.id);
    const swap = peers[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("lessons").update({ order_index: swap.order_index }).eq("id", l.id),
      supabase.from("lessons").update({ order_index: l.order_index }).eq("id", swap.id),
    ]);
    load();
  };

  const saveLesson = async () => {
    if (!editingLesson) return;
    const { id, course_id, ...patch } = editingLesson;
    const { error } = await supabase.from("lessons").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Lesson saved");
    setEditingLesson(null);
    load();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="aurora-bg" />
      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-3xl font-bold">Admin</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/course/${course?.id}`)}>
              View site
            </Button>
            <Button
              variant="outline"
              onClick={async () => { await supabase.auth.signOut(); navigate("/auth"); }}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>

        {/* Course info */}
        {course && (
          <section className="glass-card rounded-2xl p-6 mb-8 space-y-4">
            <h2 className="font-display text-xl font-bold">Course</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={course.title}
                  onChange={(e) => setCourse({ ...course, title: e.target.value })}
                />
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
            <Button onClick={saveCourse}>Save course</Button>
          </section>
        )}

        {/* Chapters */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Chapters</h2>
            <Button onClick={addChapter}>
              <Plus className="w-4 h-4 mr-2" /> Add chapter
            </Button>
          </div>

          {chapters.map((ch, i) => {
            const chLessons = lessons.filter((l) => l.chapter_id === ch.id);
            return (
              <div key={ch.id} className="glass-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <button
                      className="text-foreground/40 hover:text-foreground disabled:opacity-20"
                      disabled={i === 0}
                      onClick={() => moveChapter(ch, -1)}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      className="text-foreground/40 hover:text-foreground disabled:opacity-20"
                      disabled={i === chapters.length - 1}
                      onClick={() => moveChapter(ch, 1)}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <Input
                    value={ch.title}
                    onChange={(e) =>
                      setChapters((p) =>
                        p.map((x) => (x.id === ch.id ? { ...x, title: e.target.value } : x))
                      )
                    }
                    onBlur={(e) => renameChapter(ch, e.target.value)}
                    className="font-display text-lg font-bold"
                  />
                  <Button variant="ghost" size="icon" onClick={() => deleteChapter(ch)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>

                <div className="space-y-2 pl-8">
                  {chLessons.map((l, li) => (
                    <div
                      key={l.id}
                      className="flex items-center gap-2 p-3 rounded-xl bg-card/40"
                    >
                      <div className="flex flex-col">
                        <button
                          className="text-foreground/40 hover:text-foreground disabled:opacity-20"
                          disabled={li === 0}
                          onClick={() => moveLesson(l, -1)}
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          className="text-foreground/40 hover:text-foreground disabled:opacity-20"
                          disabled={li === chLessons.length - 1}
                          onClick={() => moveLesson(l, 1)}
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="flex-1 truncate">{l.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10">
                        {l.lesson_type}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          l.status === "published"
                            ? "bg-primary/20 text-primary"
                            : "bg-foreground/10 text-foreground/60"
                        }`}
                      >
                        {l.status}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingLesson(l)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteLesson(l)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addLesson(ch.id)}>
                    <Plus className="w-3 h-3 mr-2" /> Add lesson
                  </Button>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* Lesson editor */}
      <Dialog open={!!editingLesson} onOpenChange={(o) => !o && setEditingLesson(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit lesson</DialogTitle>
          </DialogHeader>
          {editingLesson && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingLesson.title}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={editingLesson.lesson_type}
                    onValueChange={(v) =>
                      setEditingLesson({ ...editingLesson, lesson_type: v })
                    }
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
                    value={editingLesson.status}
                    onValueChange={(v) =>
                      setEditingLesson({ ...editingLesson, status: v })
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Video / PDF URL</Label>
                <Input
                  value={editingLesson.video_url ?? ""}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, video_url: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>HTML content (for text lessons)</Label>
                <Textarea
                  rows={8}
                  value={editingLesson.content_html ?? ""}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, content_html: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Plain notes</Label>
                <Textarea
                  rows={3}
                  value={editingLesson.content ?? ""}
                  onChange={(e) =>
                    setEditingLesson({ ...editingLesson, content: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLesson(null)}>
              Cancel
            </Button>
            <Button onClick={saveLesson}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
