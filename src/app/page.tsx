"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  task: z.string().min(2, {
    message: "Task must be at least 2 characters.",
  }),
});

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const createTask = useMutation(api.tasks.createTask);
  const isCompletedToggle = useMutation(api.tasks.toggleTaskCompletion);
  const deleteTask = useMutation(api.tasks.deleteTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createTask(values);
    form.reset();
  }

  return (
    <div className="min-h-screen pt-4 w-full mx-auto max-w-xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-end gap-x-2"
        >
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Task</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your task"
                    {...field}
                    autoFocus
                    autoComplete="off"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-fit">
            Submit
          </Button>
        </form>
      </Form>

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
    </div>
  );
}
