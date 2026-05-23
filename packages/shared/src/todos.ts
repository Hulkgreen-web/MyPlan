import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const CreateTodoSchema = TodoSchema.pick({
  title: true,
  description: true,
  completed: true
}).partial({
  completed: true
});

export const UpdateTodoSchema = CreateTodoSchema.partial();

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodo = z.infer<typeof CreateTodoSchema>;
export type UpdateTodo = z.infer<typeof UpdateTodoSchema>;
