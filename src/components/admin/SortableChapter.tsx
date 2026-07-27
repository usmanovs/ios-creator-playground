import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronDown, ChevronRight, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SortableLesson, { SortableLessonItem } from "./SortableLesson";
import EmptyState from "./EmptyState";

export type ChapterItem = { id: string; title: string };

type Props = {
  chapter: ChapterItem;
  lessons: SortableLessonItem[];
  onRename: (title: string) => void;
  onDelete: () => void;
  onAddLesson: () => void;
  onEditLesson: (id: string) => void;
  onDeleteLesson: (id: string) => void;
  onExpand?: (chapterId: string) => void;
};

export default function SortableChapter({
  chapter,
  lessons,
  onRename,
  onDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onExpand,
}: Props) {
  const storageKey = `admin.chapter.open.${chapter.id}`;
  const [open, setOpenState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const v = window.localStorage.getItem(storageKey);
    return v === null ? true : v === "1";
  });
  const setOpen = (v: boolean | ((p: boolean) => boolean)) => {
    setOpenState((prev) => {
      const next = typeof v === "function" ? (v as (p: boolean) => boolean)(prev) : v;
      try { window.localStorage.setItem(storageKey, next ? "1" : "0"); } catch {}
      if (next) onExpand?.(chapter.id);
      return next;
    });
  };
  useEffect(() => {
    if (open) onExpand?.(chapter.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [title, setTitle] = useState(chapter.title);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: chapter.id,
    data: { type: "chapter" },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `chapter-drop-${chapter.id}`,
    data: { type: "chapter-droppable", chapterId: chapter.id },
  });

  const setChapterRefs = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    setDropRef(node);
  };

  return (
    <div
      id={`chapter-${chapter.id}`}
      ref={setChapterRefs}
      style={style}
      className={`glass-card rounded-2xl p-4 md:p-6 space-y-4 transition-colors ${
        isOver ? "bg-primary/5 ring-1 ring-primary/30" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-foreground/40 hover:text-foreground touch-none"
          aria-label="Drag chapter"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-foreground/60 hover:text-foreground"
          aria-label="Toggle"
        >
          {open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        <div className="group/chapter relative flex items-center min-w-0">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title !== chapter.title && onRename(title)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="font-display text-lg font-bold bg-transparent border-0 border-b border-transparent px-1 py-0.5 focus-visible:ring-0 focus-visible:border-primary/50 focus-visible:bg-primary/5 hover:border-primary/30 focus-visible:rounded-md transition-colors w-auto min-w-[6rem] max-w-xs"
          />
          <Pencil className="w-3.5 h-3.5 text-foreground/30 opacity-0 group-hover/chapter:opacity-100 transition-opacity ml-1.5 pointer-events-none" />
          <span className="ml-2 inline-flex items-center justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {lessons.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto text-foreground/40 hover:text-destructive" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {open && (
        <div
          className="space-y-2 pl-2 md:pl-8 rounded-xl transition-colors"
        >
          <SortableContext
            id={chapter.id}
            items={lessons.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            {lessons.length === 0 ? (
              <EmptyState
                title="No lessons yet"
                description="Add your first lesson or drop one here."
                ctaLabel="Add lesson"
                onCta={onAddLesson}
              />
            ) : (
              lessons.map((l) => (
                <SortableLesson
                  key={l.id}
                  lesson={l}
                  onEdit={() => onEditLesson(l.id)}
                  onDelete={() => onDeleteLesson(l.id)}
                />
              ))
            )}
          </SortableContext>
          {lessons.length > 0 && (
            <Button variant="outline" size="sm" onClick={onAddLesson}>
              <Plus className="w-3 h-3 mr-2" /> Add lesson
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
