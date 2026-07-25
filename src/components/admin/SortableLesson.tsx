import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ExternalLink, Pencil, Trash2, Copy } from "lucide-react";
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
  onDuplicate: () => void;
  onDelete: () => void;
};

export default function SortableLesson({ lesson, onEdit, onDuplicate, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id,
    data: { type: "lesson" },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center gap-2 p-3 rounded-xl bg-card/40 border border-border ${
        isDragging ? "z-50 ring-1 ring-primary/40 bg-card" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
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
      <Button variant="ghost" size="icon" asChild title="Preview">
        <Link to={`/lesson/${lesson.id}`} target="_blank" rel="noreferrer">
          <ExternalLink className="w-4 h-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" onClick={onEdit} title="Edit">
        <Pencil className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDuplicate} title="Duplicate">
        <Copy className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete} title="Delete">
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  );
}
