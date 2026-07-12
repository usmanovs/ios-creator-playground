import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CourseSidebar from "@/components/CourseSidebar";

type Lesson = {
  id: string;
  course_id: string;
  title: string;
  content_html: string | null;
  content: string | null;
  video_url: string | null;
  lesson_type: string;
};

const isYouTube = (url: string) => /youtube\.com|youtu\.be/.test(url);
const toYouTubeEmbed = (url: string) => {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
};

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("lessons")
        .select("id,course_id,title,content_html,content,video_url,lesson_type")
        .eq("id", lessonId)
        .maybeSingle();
      setLesson(data as Lesson | null);
      setLoading(false);
    })();
  }, [lessonId]);

  const safeHtml = useMemo(
    () => (lesson?.content_html ? DOMPurify.sanitize(lesson.content_html) : ""),
    [lesson?.content_html]
  );

  if (loading) return <div className="p-12 text-center text-foreground/60">Loading...</div>;
  if (!lesson) return <div className="p-12 text-center">Lesson not found</div>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        <div className="aurora-bg" />
        <CourseSidebar courseId={lesson.course_id} currentLessonId={lesson.id} />

        <div className="flex-1 flex flex-col relative">
          <header className="h-12 flex items-center border-b border-border/40 px-2 sticky top-0 z-10 bg-background/60 backdrop-blur">
            <SidebarTrigger />
          </header>

          <main className="flex-1">
            <div className="max-w-4xl mx-auto px-6 py-12">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">{lesson.title}</h1>

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
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LessonPage;
