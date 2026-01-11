import { taskFormSchema } from "@/validation/task-form-schema";
import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomMutation } from "convex-helpers/server/zod4";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const zMutation = zCustomMutation(mutation, NoOp);

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").withIndex("by_order").collect();
  },
});

// Create a new task with the given text
export const createTask = zMutation({
  args: taskFormSchema.shape,
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tasks")
      .withIndex("by_order")
      .collect();
    const nextOrder =
      existing.length === 0
        ? 0
        : Math.max(...existing.map((t) => t.order ?? -1)) + 1;

    const newTaskId = await ctx.db.insert("tasks", {
      text: args.task,
      isCompleted: false,
      order: nextOrder,
    });
    return newTaskId;
  },
});

export const toggleTaskCompletion = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get("tasks", args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    await ctx.db.patch("tasks", args.id, {
      isCompleted: !task.isCompleted,
    });
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete("tasks", args.id);
  },
});

export const updateTask = mutation({
  args: { id: v.id("tasks"), text: v.string() },
  handler: async (ctx, args) => {
    const task = await ctx.db.get("tasks", args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    await ctx.db.patch("tasks", args.id, {
      text: args.text,
    });
  },
});

export const updateTaskOrder = mutation({
  args: { id: v.id("tasks"), order: v.number() },
  handler: async (ctx, args) => {
    const task = await ctx.db.get("tasks", args.id);
    if (!task) {
      throw new Error("Task not found");
    }
    await ctx.db.patch("tasks", args.id, {
      order: args.order,
    });
  },
});
