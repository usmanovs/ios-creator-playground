import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ArrowRight } from "lucide-react";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CourseSidebar from "@/components/CourseSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUserProgress } from "@/hooks/useUserProgress";

type Lesson = {
  id: string;
  course_id: string;
  title: string;
  content_html: string | null;
  content: string | null;
  video_url: string | null;
  lesson_type: string;
};

type CourseNav = {
  course: { title: string } | null;
  chapters: { id: string; title: string; order_index: number }[];
  lessons: { id: string; chapter_id: string; title: string; order_index: number; lesson_type: string }[];
};

const isYouTube = (url: string) => /youtube\.com|youtu\.be/.test(url);
const toYouTubeEmbed = (url: string) => {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
};

const fetchLesson = async (lessonId: string): Promise<Lesson | null> => {
  const { data } = await supabase
    .from("lessons")
    .select("id,course_id,title,content_html,content,video_url,lesson_type")
    .eq("id", lessonId)
    .maybeSingle();
  return (data as Lesson | null) ?? null;
};

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, completedIds } = useUserProgress();
  const [toggling, setToggling] = useState(false);
  const [nextLesson, setNextLesson] = useState<{ id: string; title: string } | null>(null);

  const { data: lesson, isLoading, isFetching } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => fetchLesson(lessonId!),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
  });

  const safeHtml = useMemo(
    () => (lesson?.content_html ? DOMPurify.sanitize(lesson.content_html) : ""),
    [lesson?.content_html]
  );

  const courseId = lesson?.course_id;

  const navigating = isFetching && !!lesson && lesson.id !== lessonId;

  const completed = !!lessonId && completedIds?.has(lessonId);

  const markComplete = async () => {
    if (!user || !lessonId) return;
    setToggling(true);
    const { error } = await supabase
      .from("user_progress")
      .insert({ user_id: user.id, lesson_id: lessonId });
    setToggling(false);
    if (error) {
      toast.error("Failed to mark complete");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["progress", user.id] });
    toast.success("Lesson completed!");
  };

  const markIncomplete = async () => {
    if (!user || !lessonId) return;
    setToggling(true);
    const { error } = await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);
    setToggling(false);
    if (error) {
      toast.error("Failed to update progress");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["progress", user.id] });
    toast.success("Progress updated");
  };

  // Fetch the full course nav so "Next lesson" always works, even on direct nav.
  const { data: navData } = useQuery({
    queryKey: ["course-nav", courseId],
    queryFn: async (): Promise<CourseNav | null> => {
      if (!courseId) return null;
      const { data } = await supabase
        .from("courses")
        .select("title")
        .eq("id", courseId)
        .maybeSingle();
      const { data: chapters } = await supabase
        .from("chapters")
        .select("id,title,order_index")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id,chapter_id,title,order_index,lesson_type")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });
      return {
        course: data ? { title: (data as { title: string }).title } : null,
        chapters: (chapters as CourseNav["chapters"]) ?? [],
        lessons: (lessons as CourseNav["lessons"]) ?? [],
      };
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!courseId || !lessonId || !navData) {
      setNextLesson(null);
      return;
    }

    const ordered = [...navData.lessons].sort((a, b) => {
      const ai = navData.chapters.find((c) => c.id === a.chapter_id)?.order_index ?? 0;
      const bi = navData.chapters.find((c) => c.id === b.chapter_id)?.order_index ?? 0;
      return ai - bi || a.order_index - b.order_index;
    });
    const idx = ordered.findIndex((l) => l.id === lessonId);
    if (idx === -1) {
      setNextLesson(null);
      return;
    }

    const next = ordered[idx + 1];
    setNextLesson(next ? { id: next.id, title: next.title } : null);

    const neighbors = [ordered[idx - 1], ordered[idx + 1]].filter(Boolean);
    for (const n of neighbors) {
      queryClient.prefetchQuery({
        queryKey: ["lesson", n!.id],
        queryFn: () => fetchLesson(n!.id),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [courseId, lessonId, navData, queryClient]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        <div className="aurora-bg" />
        {courseId && <CourseSidebar courseId={courseId} currentLessonId={lessonId} />}

        <div className="flex-1 flex flex-col relative min-w-0">
          <header className="h-12 flex items-center border-b border-border/40 px-2 sticky top-0 z-10 bg-background/60 backdrop-blur">
            <SidebarTrigger />
          </header>

          <main className="flex-1">
            <div className={cn("max-w-4xl mx-auto px-6 py-12 transition-opacity duration-300", navigating && "opacity-50")}>
              {navigating && (
                <div className="h-1 w-full rounded-full overflow-hidden bg-primary/20 mb-8">
                  <div className="h-full w-1/3 bg-primary rounded-full animate-[loading-bar_1.5s_ease-in-out_infinite]" />
                </div>
              )}
              {isLoading && !lesson ? (
                <>
                  <Skeleton className="h-10 w-2/3 mb-8" />
                  <Skeleton className="aspect-video w-full rounded-2xl" />
                </>
              ) : !lesson ? (
                <div className="p-12 text-center">Lesson not found</div>
              ) : (
                <>
                  <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">
                    {lesson.title}
                  </h1>

                  <div className="glass-card p-6 md:p-8">
                    {lesson.lesson_type === "video" && lesson.video_url && (
                      <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                        {isYouTube(lesson.video_url) ? (
                          <iframe
                            src={toYouTubeEmbed(lesson.video_url)}
                            title={lesson.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video src={lesson.video_url} controls className="w-full h-full" />
                        )}
                      </div>
                    )}

                    {lesson.lesson_type === "pdf" && lesson.video_url && (
                      <iframe
                        src={lesson.video_url}
                        title={lesson.title}
                        className="w-full h-[80vh] rounded-2xl bg-white"
                      />
                    )}

                    {lesson.lesson_type === "text" && (
                      <article
                        className="prose prose-invert max-w-none prose-headings:font-display prose-a:text-primary"
                        dangerouslySetInnerHTML={{ __html: safeHtml }}
                      />
                    )}

                    {lesson.lesson_type === "video" && !lesson.video_url && (
                      <p className="text-foreground/50">No video provided.</p>
                    )}
                  </div>

                  <div className="mt-8 flex items-center gap-3">
                    {user ? (
                      completed ? (
                        <>
                          <Badge variant="secondary" className="gap-1 text-primary">
                            <Check className="w-3 h-3" />
                            Completed
                          </Badge>
                          <Button
                            variant="outline"
                            onClick={markIncomplete}
                            disabled={toggling}
                          >
                            Mark as incomplete
                          </Button>
                        </>
                      ) : (
                        <Button onClick={markComplete} disabled={toggling}>
                          Mark as complete
                        </Button>
                      )
                    ) : (
                      <Button asChild variant="outline">
                        <Link to="/auth">Sign in to track progress</Link>
                      </Button>
                    )}

                    {nextLesson && (
                      <Button
                        variant="default"
                        className="ml-auto gap-2"
                        onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                      >
                        Next lesson
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {nextLesson && (
                    <p className="mt-2 text-right text-xs text-foreground/40 ml-auto">
                      {nextLesson.title}
                    </p>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LessonPage;
