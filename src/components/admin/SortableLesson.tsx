import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export type SortableLessonItem = {
  id: string;
  title: string;
  lesson_type: string;
  status: string;
};

type Props = {
  lesson: SortableLessonItem;
  onEdit: () => void;
  onDelete: () => void;
};

/** Presentational row — also used inside <DragOverlay>. */
export function LessonRow({
  lesson,
  onEdit,
  onDelete,
  dragHandleProps,
  overlay = false,
}: {
  lesson: SortableLessonItem;
  onEdit?: () => void;
  onDelete?: () => void;
  dragHandleProps?: Record<string, unknown>;
  overlay?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center gap-2 p-3 rounded-xl bg-card/40 border border-border ${
        overlay ? "bg-card shadow-2xl ring-1 ring-primary/40 cursor-grabbing" : ""
      }`}
    >
      <button
        {...dragHandleProps}
        className="cursor-grab active:cursor-grabbing text-foreground/40 hover:text-foreground touch-none"
        aria-label="Drag"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <button
        onClick={onEdit}
        className="flex-1 truncate text-sm text-left hover:text-primary transition-colors"
      >
        {lesson.title}
      </button>
      <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10 hidden sm:inline">
        {lesson.lesson_type}
      </span>
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          lesson.status === "published"
            ? "bg-primary/20 text-primary"
            : "bg-foreground/10 text-foreground/60"
        }`}
      >
        {lesson.status}
      </span>
      {!overlay && (
        <>
          <Button variant="ghost" size="icon" asChild title="Preview">
            <Link to={`/lesson/${lesson.id}`} target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit} title="Edit">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} title="Delete">
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </>
      )}
    </div>
  );
}

export default function SortableLesson({ lesson, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id,
    data: { type: "lesson" },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-30" : ""}
    >
      <LessonRow
        lesson={lesson}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
