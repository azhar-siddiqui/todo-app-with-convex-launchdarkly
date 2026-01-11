"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import SortableTaskList from "./SortableTaskList";

export default function TaskList() {
  const tasks = useQuery(api.tasks.get);
  const updateTaskOrder = useMutation(api.tasks.updateTaskOrder);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks?.findIndex((task) => task._id === active.id);
      const newIndex = tasks?.findIndex((task) => task._id === over.id);

      if (oldIndex !== undefined && newIndex !== undefined && tasks) {
        const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
        // Update the order in the database. Assuming tasks have an 'order' field.
        // For each task, call updateTaskOrder({ id: task._id, order: index });
        // You need to implement this mutation in your Convex backend.
        reorderedTasks.forEach((task, index) => {
          updateTaskOrder({ id: task._id, order: index });
        });
      }
    }
  }

  return (
    <ul className="w-full max-w-xl sm:mx-auto border h-[calc(100vh-8rem)] mt-4 overflow-y-auto flex flex-col gap-y-2 p-4 rounded-md">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext
          items={tasks?.map((task) => task._id) || []}
          strategy={verticalListSortingStrategy}
        >
          {tasks?.map(({ _id, text, isCompleted }) => (
            <SortableTaskList
              key={_id}
              _id={_id}
              text={text}
              isCompleted={isCompleted}
              editingId={editingId}
              setEditingId={setEditingId}
              editingText={editingText}
              setEditingText={setEditingText}
            />
          ))}
        </SortableContext>
      </DndContext>
    </ul>
  );
}
