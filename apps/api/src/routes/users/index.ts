import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { listUsersRoute } from './list-users.route.js';

export const usersRoutes: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  await fastify.register(listUsersRoute, { em });
};
