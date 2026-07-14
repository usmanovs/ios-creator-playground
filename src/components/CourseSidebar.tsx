import { useQuery } from "@tanstack/react-query";
import { NavLink, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, FileText, PlayCircle, FileType, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProgress } from "@/hooks/useUserProgress";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type Chapter = { id: string; title: string; order_index: number };
type LessonItem = {
  id: string;
  chapter_id: string;
  title: string;
  order_index: number;
  lesson_type: string;
};

interface Props {
  courseId: string;
  currentLessonId?: string;
}

const typeIcon = (t: string) => {
  if (t === "video") return PlayCircle;
  if (t === "pdf") return FileType;
  return FileText;
};

const fetchCourseNav = async (courseId: string) => {
  const [{ data: c }, { data: ch }, { data: ls }] = await Promise.all([
    supabase.from("courses").select("title").eq("id", courseId).maybeSingle(),
    supabase
      .from("chapters")
      .select("id,title,order_index")
      .eq("course_id", courseId)
      .order("order_index"),
    supabase
      .from("lessons")
      .select("id,chapter_id,title,order_index,lesson_type")
      .eq("course_id", courseId)
      .eq("status", "published")
      .order("order_index"),
  ]);
  return {
    course: (c as { title: string } | null) ?? null,
    chapters: (ch as Chapter[]) ?? [],
    lessons: (ls as LessonItem[]) ?? [],
  };
};

export default function CourseSidebar({ courseId, currentLessonId }: Props) {
  const { data } = useQuery({
    queryKey: ["course-nav", courseId],
    queryFn: () => fetchCourseNav(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });

  const { completedIds } = useUserProgress();

  const course = data?.course;
  const chapters = data?.chapters ?? [];
  const lessons = data?.lessons ?? [];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/40">
        <Link
          to={`/course/${courseId}`}
          className="flex items-center gap-2 px-2 py-2 text-sm text-foreground/70 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span className="truncate group-data-[collapsible=icon]:hidden">
            {course?.title || "Back to course"}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {chapters.map((ch) => {
          const chLessons = lessons.filter((l) => l.chapter_id === ch.id);
          if (!chLessons.length) return null;
          return (
            <SidebarGroup key={ch.id} className="py-1">
              <SidebarGroupLabel className="flex items-center gap-2 py-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{ch.title}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {chLessons.map((ls) => {
                    const Icon = typeIcon(ls.lesson_type);
                    const active = ls.id === currentLessonId;
                    return (
                      <SidebarMenuItem key={ls.id}>
                        <SidebarMenuButton asChild isActive={active} className="h-8 px-2 py-1 relative overflow-hidden">
                          <NavLink
                            to={`/lesson/${ls.id}`}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center gap-2 transition-colors duration-200",
                                isActive && "after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-4 after:w-0.5 after:rounded-full after:bg-primary"
                              )
                            }
                          >
                            <Icon className={cn("w-3.5 h-3.5 shrink-0", active && "text-primary")} />
                            <span className={cn("truncate flex-1 text-sm", active && "text-foreground font-medium")}>{ls.title}</span>
                            {completedIds?.has(ls.id) && (
                              <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                            )}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
