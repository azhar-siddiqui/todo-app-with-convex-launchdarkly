import z from "zod";

export const taskFormSchema = z.object({
  task: z
    .string()
    .trim()
    .nonempty({
      message: "Task cannot be empty.",
    })
    .min(3, {
      message: "Task must be at least 3 characters.",
    }),
});
