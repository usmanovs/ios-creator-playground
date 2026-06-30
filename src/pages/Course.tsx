import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { FileText, PlayCircle, FileType } from "lucide-react";

type Course = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
};
type Chapter = { id: string; title: string; order_index: number };
type Lesson = {
  id: string;
  chapter_id: string | null;
  title: string;
  order_index: number;
  lesson_type: string;
};

const typeIcon = (t: string) => {
  if (t === "video") return <PlayCircle className="w-4 h-4 text-primary" />;
  if (t === "pdf") return <FileType className="w-4 h-4 text-accent" />;
  return <FileText className="w-4 h-4 text-foreground/60" />;
};

const Course = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      const [c, ch, ls] = await Promise.all([
        supabase.from("courses").select("id,title,description,image_url").eq("id", courseId).maybeSingle(),
        supabase.from("chapters").select("id,title,order_index").eq("course_id", courseId).order("order_index"),
        supabase
          .from("lessons")
          .select("id,chapter_id,title,order_index,lesson_type")
          .eq("course_id", courseId)
          .eq("status", "published")
          .order("order_index"),
      ]);
      setCourse(c.data as Course | null);
      setChapters((ch.data ?? []) as Chapter[]);
      setLessons((ls.data ?? []) as Lesson[]);
      setLoading(false);
    })();
  }, [courseId]);

  if (loading) return <div className="p-12 text-center text-foreground/60">Loading...</div>;
  if (!course) return <div className="p-12 text-center">Course not found</div>;

  return (
    <div className="min-h-screen relative">
      <div className="aurora-bg" />
      <div className="relative max-w-4xl mx-auto px-6 py-16">
        <div className="glass-card overflow-hidden mb-10">
          {course.image_url && (
            <img src={course.image_url} alt={course.title} className="w-full h-64 object-cover" />
          )}
          <div className="p-8">
            <h1 className="font-display text-4xl font-bold mb-3">{course.title}</h1>
            {course.description && <p className="text-foreground/70">{course.description}</p>}
          </div>
        </div>

        <div className="space-y-6">
          {chapters.map((ch, i) => {
            const chLessons = lessons.filter((l) => l.chapter_id === ch.id);
            return (
              <div key={ch.id} className="glass-card p-6">
                <h2 className="font-display text-xl font-bold mb-4">
                  <span className="text-primary mr-2">{i + 1}.</span>
                  {ch.title}
                </h2>
                <ul className="divide-y divide-white/5">
                  {chLessons.map((l) => (
                    <li key={l.id}>
                      <Link
                        to={`/lesson/${l.id}`}
                        className="flex items-center gap-3 py-3 hover:text-primary transition-colors"
                      >
                        {typeIcon(l.lesson_type)}
                        <span className="flex-grow">{l.title}</span>
                        <span className="text-xs text-foreground/40 uppercase">{l.lesson_type}</span>
                      </Link>
                    </li>
                  ))}
                  {chLessons.length === 0 && (
                    <li className="py-3 text-sm text-foreground/40">No lessons yet</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Course;
