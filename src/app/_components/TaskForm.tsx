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
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const formSchema = z.object({
  task: z.string().min(2, {
    message: "Task must be at least 2 characters.",
  }),
});

export default function TaskForm() {
  const createTask = useMutation(api.tasks.createTask);

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
  );
}
