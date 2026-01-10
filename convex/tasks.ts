import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// Create a new task with the given text
export const createTask = mutation({
  args: { task: v.string() },
  handler: async (ctx, args) => {
    const newTaskId = await ctx.db.insert("tasks", {
      text: args.task,
      isCompleted: false,
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
