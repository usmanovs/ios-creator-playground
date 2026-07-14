import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BookOpen, ChevronRight, Play, FileText, HelpCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useUserProgress } from "@/hooks/useUserProgress";
import { cn } from "@/lib/utils";

const LESSON_META: Record<string, { icon: typeof Play; label: string }> = {
  video: { icon: Play, label: "Video lesson" },
  text: { icon: FileText, label: "Reading" },
  quiz: { icon: HelpCircle, label: "Quiz" },
};

export const COURSE_ID = "4dcdf780-0842-449d-a1c2-bfa7acf280ce";

export default function CoursePage() {
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const { user, completedIds } = useUserProgress();

  useEffect(() => {
    (async () => {
      const { data: c } = await supabase
        .from("courses")
        .select("id,title,description,image_url")
        .eq("id", COURSE_ID)
        .maybeSingle();
      setCourse(c);

      const { data: ch } = await supabase
        .from("chapters")
        .select("id,title,order_index")
        .eq("course_id", COURSE_ID)
        .order("order_index");
      setChapters(ch || []);

      const { data: ls } = await supabase
        .from("lessons")
        .select("id,chapter_id,title,order_index,lesson_type")
        .eq("course_id", COURSE_ID)
        .eq("status", "published")
        .order("order_index");
      setLessons(ls || []);
    })();
  }, []);

  const getLessons = (chapterId: string) =>
    lessons.filter((l) => l.chapter_id === chapterId);

  const totalLessons = lessons.length;
  const completedCount = completedIds?.size ?? 0;
  const percent = totalLessons
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  const nextLessonId = (() => {
    if (!completedIds || totalLessons === 0) return null;
    for (const ch of chapters) {
      for (const ls of getLessons(ch.id)) {
        if (!completedIds.has(ls.id)) return ls.id;
      }
    }
    return null;
  })();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="aurora-bg" />
      <div className="relative max-w-5xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {course?.title || "Course"}
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl">
            {course?.description}
          </p>
        </div>

        {user ? (
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-display text-xl font-bold">Your progress</h2>
                <p className="text-sm text-foreground/60">
                  {completedCount} of {totalLessons} lessons completed
                </p>
              </div>
              <div className="text-3xl font-display font-bold text-primary">
                {percent}%
              </div>
            </div>
            <Progress value={percent} className="h-2 mb-4" />
            {nextLessonId ? (
              <Button asChild>
                <Link to={`/lesson/${nextLessonId}`}>Continue learning</Link>
              </Button>
            ) : (
              <p className="text-sm text-foreground/60">All lessons completed!</p>
            )}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-foreground/60">
              Sign in to track your progress and keep learning.
            </p>
            <Button asChild variant="outline">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {chapters.map((ch) => (
            <div key={ch.id} className="glass-card rounded-2xl p-5">
              <h2 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {ch.title}
              </h2>
              <div className="space-y-2">
                {getLessons(ch.id).map((ls, idx) => {
                  const meta = LESSON_META[ls.lesson_type] ?? LESSON_META.text;
                  const Icon = meta.icon;
                  const isCompleted = completedIds?.has(ls.id);
                  return (
                    <NavLink
                      key={ls.id}
                      to={`/lesson/${ls.id}`}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 group",
                          "hover:bg-card/60 hover:translate-x-0.5",
                          isActive
                            ? "bg-primary/10 border border-primary/30 shadow-[inset_2px_0_0_0_hsl(var(--primary))]"
                            : "bg-card/40 border border-transparent"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-md border flex items-center justify-center font-display text-sm font-bold transition-colors",
                            isActive
                              ? "bg-primary/20 border-primary/40 text-primary"
                              : "bg-primary/10 border-primary/20 text-primary group-hover:bg-primary/20 group-hover:border-primary/40"
                          )}>
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={cn(
                              "flex items-center gap-2 font-medium truncate",
                              isActive ? "text-foreground" : "text-foreground/90 group-hover:text-foreground"
                            )}>
                              <Icon className={cn("w-3.5 h-3.5 flex-shrink-0", isActive ? "text-primary" : "text-primary/70")} />
                              <span className="truncate">{ls.title}</span>
                            </div>
                            <div className="text-xs text-foreground/50 mt-0 ml-5">
                              {meta.label}
                            </div>
                          </div>
                          {isCompleted ? (
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          ) : (
                            <ChevronRight className={cn(
                              "w-4 h-4 flex-shrink-0 transition-all",
                              isActive ? "text-primary translate-x-0.5" : "text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5"
                            )} />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
