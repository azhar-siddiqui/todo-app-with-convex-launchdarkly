import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "convex/react";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface SortableTaskListProps {
  _id: Id<"tasks">;
  text: string;
  isCompleted: boolean;
  editingId: string | null;
  setEditingId: Dispatch<SetStateAction<string | null>>;
  editingText: string;
  setEditingText: Dispatch<SetStateAction<string>>;
}

export default function SortableTaskList({
  _id,
  text,
  isCompleted,
  editingId,
  setEditingId,
  editingText,
  setEditingText,
}: Readonly<SortableTaskListProps>) {
  const isCompletedToggle = useMutation(api.tasks.toggleTaskCompletion);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const updateTask = useMutation(api.tasks.updateTask);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: _id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const startEdit = () => {
    setEditingId(_id);
    setEditingText(text);
  };

  const saveEdit = () => {
    const trimmed = editingText.trim();
    if (trimmed && trimmed !== text) {
      updateTask({ id: _id, text: trimmed });
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "border py-2 px-4 pl-0 flex items-center justify-between rounded-md",
        isCompleted && "bg-green-100",
        isDragging && "opacity-50"
      )}
    >
      <Button
        type="button"
        {...attributes}
        {...listeners}
        variant="link"
        className="cursor-grab active:cursor-grabbing"
        size="icon-sm"
      >
        <GripVertical />
      </Button>
      <Checkbox
        id={`task-${_id}`}
        checked={isCompleted}
        onCheckedChange={() => isCompletedToggle({ id: _id })}
      />
      {editingId === _id ? (
        <Input
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          onBlur={() => {
            updateTask({ id: _id, text: editingText });
            setEditingId(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") cancelEdit();
          }}
          autoFocus
          className="flex-1 capitalize mx-4"
        />
      ) : (
        <span
          className={cn(
            "flex-1 capitalize mx-4",
            isCompleted && "line-through text-muted-foreground"
          )}
        >
          {text}
        </span>
      )}
      <div className="flex gap-x-2">
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full cursor-pointer"
          onClick={startEdit}
        >
          <Pencil className="text-border cursor-pointer" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full cursor-pointer"
          onClick={() => deleteTask({ id: _id })}
        >
          <Trash2 className="text-border cursor-pointer" />
        </Button>
      </div>
    </li>
  );
}
