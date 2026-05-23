import { FastifyPluginAsync } from 'fastify';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Todo } from '../entities/Todo.js';
import { CreateTodoSchema } from 'shared';

export const todoRoutes: FastifyPluginAsync<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  fastify.get('/', async () => {
    return await em.find(Todo, {}, { orderBy: { createdAt: 'DESC' } as any });
  });

  fastify.post('/', async (request, reply) => {
    const data = CreateTodoSchema.parse(request.body);
    const todo = new Todo(data.title, data.description);
    em.persist(todo);
    await em.flush();
    return todo;
  });

  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const todo = await em.findOneOrFail(Todo, id);
    const data = request.body as any;
    
    if (data.completed !== undefined) todo.completed = data.completed;
    if (data.title !== undefined) todo.title = data.title;
    
    await em.flush();
    return todo;
  });

  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const todo = await em.findOneOrFail(Todo, id);
    em.remove(todo);
    await em.flush();
    return { success: true };
  });
};
