import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from "lucide-react";
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
};

export default function SortableChapter({
  chapter,
  lessons,
  onRename,
  onDelete,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
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
      return next;
    });
  };
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
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => title !== chapter.title && onRename(title)}
          className="font-display text-lg font-bold"
        />
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-destructive" />
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
