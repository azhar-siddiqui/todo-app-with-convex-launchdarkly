"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

export default function TaskList() {
  const tasks = useQuery(api.tasks.get);
  const isCompletedToggle = useMutation(api.tasks.toggleTaskCompletion);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const updateTask = useMutation(api.tasks.updateTask);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  return (
    <ul className="w-full mx-auto max-w-xl border h-[calc(100vh-8rem)] mt-4 overflow-y-auto flex flex-col gap-y-2 p-4 rounded-md">
      {tasks?.map(({ _id, text, isCompleted }) => (
        <li
          className={cn(
            "border py-2 px-4 flex items-center justify-between gap-x-4 rounded-md",
            isCompleted && "bg-green-100"
          )}
          key={_id}
        >
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
                if (e.key === "Enter") {
                  updateTask({ id: _id, text: editingText });
                  setEditingId(null);
                } else if (e.key === "Escape") {
                  setEditingId(null);
                }
              }}
              className="flex-1 capitalize"
              autoFocus
            />
          ) : (
            <span
              className={cn(
                "flex-1 capitalize",
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
              onClick={() => {
                setEditingId(_id);
                setEditingText(text);
              }}
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
      ))}
    </ul>
  );
}
