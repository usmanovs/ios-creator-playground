import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CourseSidebar from "@/components/CourseSidebar";
import { Skeleton } from "@/components/ui/skeleton";

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
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => fetchLesson(lessonId!),
    enabled: !!lessonId,
    staleTime: 5 * 60 * 1000,
  });

  const safeHtml = useMemo(
    () => (lesson?.content_html ? DOMPurify.sanitize(lesson.content_html) : ""),
    [lesson?.content_html]
  );

  // Sidebar needs a courseId; use the last-known one while a new lesson loads
  const courseId = lesson?.course_id;

  // Prefetch previous and next lessons for instant navigation
  useEffect(() => {
    if (!courseId || !lessonId) return;
    const nav = queryClient.getQueryData<CourseNav>(["course-nav", courseId]);
    if (!nav) return;

    const ordered = [...nav.lessons].sort((a, b) => {
      const ai = nav.chapters.find((c) => c.id === a.chapter_id)?.order_index ?? 0;
      const bi = nav.chapters.find((c) => c.id === b.chapter_id)?.order_index ?? 0;
      return ai - bi || a.order_index - b.order_index;
    });
    const idx = ordered.findIndex((l) => l.id === lessonId);
    if (idx === -1) return;

    const neighbors = [ordered[idx - 1], ordered[idx + 1]].filter(Boolean);
    for (const n of neighbors) {
      queryClient.prefetchQuery({
        queryKey: ["lesson", n!.id],
        queryFn: () => fetchLesson(n!.id),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [courseId, lessonId, queryClient]);

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
            <div className="max-w-4xl mx-auto px-6 py-12">
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
