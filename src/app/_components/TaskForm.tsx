"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { taskFormSchema } from "@/validation/task-form-schema";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { ZodIssue } from "zod/v3";
import { api } from "../../../convex/_generated/api";

export default function TaskForm() {
  const createTask = useMutation(api.tasks.createTask);

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      task: "",
    },
  });

  async function onSubmit(values: z.infer<typeof taskFormSchema>) {
    try {
      await createTask(values);
      form.reset();
    } catch (error) {
      handleTodoCreationError(error);
    }
  }
  const handleTodoCreationError = (error: unknown) => {
    if (error instanceof ConvexError && error.data.ZodError) {
      const zodError = error.data.ZodError as ZodIssue[];
      const taskError = zodError.find((err) => err.path.includes("task"));
      if (taskError) {
        form.setError("task", { message: taskError.message });
      }
    } else {
      form.setError("task", { message: "Failed to create task" });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-x-2 max-w-xl sm:mx-auto"
      >
        <FormField
          control={form.control}
          name="task"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormLabel>
                {fieldState.error ? fieldState.error.message : "Task"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your task"
                  {...field}
                  autoFocus
                  autoComplete="off"
                  className={`w-full ${
                    fieldState.error &&
                    "border-red-500 placeholder:text-red-500"
                  }`}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
