import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const COURSE_ID = "4dcdf780-0842-449d-a1c2-bfa7acf280ce";

export default function CoursePage() {
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);

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
        .select("id,title,position")
        .eq("course_id", COURSE_ID)
        .order("position");
      setChapters(ch || []);

      const { data: ls } = await supabase
        .from("lessons")
        .select("id,chapter_id,title,position,lesson_type")
        .eq("course_id", COURSE_ID)
        .order("position");
      setLessons(ls || []);
    })();
  }, []);

  const getLessons = (chapterId: string) =>
    lessons.filter((l) => l.chapter_id === chapterId);

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

        <div className="space-y-8">
          {chapters.map((ch) => (
            <div key={ch.id} className="glass-card rounded-2xl p-6">
              <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {ch.title}
              </h2>
              <div className="space-y-2">
                {getLessons(ch.id).map((ls) => (
                  <Link
                    key={ls.id}
                    to={`/lesson/${ls.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-card/40 transition-colors group"
                  >
                    <span className="text-foreground/80 group-hover:text-foreground">
                      {ls.title}
                    </span>
                    <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
