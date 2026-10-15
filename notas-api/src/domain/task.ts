import { z } from 'zod';

export const TaskStatusSchema = z.enum(['open', 'done']);
export const TaskFilterSchema = z.enum(['all', 'open', 'done']);

export const CreateTaskInputSchema = z.object({
  title: z.string().trim().min(1).max(255),
});

export const TaskSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(255),
  status: TaskStatusSchema,
});

export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type TaskFilter = z.infer<typeof TaskFilterSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;
export type Task = z.infer<typeof TaskSchema>;
