import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
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
  onReorderLessons: (orderedIds: string[]) => void;
  onEditLesson: (id: string) => void;
  onDuplicateLesson: (id: string) => void;
  onDeleteLesson: (id: string) => void;
};

export default function SortableChapter({
  chapter,
  lessons,
  onRename,
  onDelete,
  onAddLesson,
  onReorderLessons,
  onEditLesson,
  onDuplicateLesson,
  onDeleteLesson,
}: Props) {
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState(chapter.title);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: chapter.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = lessons.findIndex((l) => l.id === active.id);
    const newIdx = lessons.findIndex((l) => l.id === over.id);
    const next = arrayMove(lessons, oldIdx, newIdx);
    onReorderLessons(next.map((l) => l.id));
  };

  return (
    <div ref={setNodeRef} style={style} className="glass-card rounded-2xl p-4 md:p-6 space-y-4">
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
        <div className="space-y-2 pl-2 md:pl-8">
          {lessons.length === 0 ? (
            <EmptyState
              title="No lessons yet"
              description="Add your first lesson to this chapter."
              ctaLabel="Add lesson"
              onCta={onAddLesson}
            />
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={lessons.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                {lessons.map((l) => (
                  <SortableLesson
                    key={l.id}
                    lesson={l}
                    onEdit={() => onEditLesson(l.id)}
                    onDuplicate={() => onDuplicateLesson(l.id)}
                    onDelete={() => onDeleteLesson(l.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
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
