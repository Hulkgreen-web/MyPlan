import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { UsersListResponseSchema } from 'shared';
import { User } from '../../entities/User.js';

export const listUsersRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  fastify.get('/', {
    schema: {
      response: {
        200: UsersListResponseSchema,
      },
    },
  }, async () => {
    const users = await em.findAll(User);
    return users;
  });
};
