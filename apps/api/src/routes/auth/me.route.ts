import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { User } from '../../entities/User.js';
import { MeResponseSchema, MessageResponseSchema } from 'shared';

export const meRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  fastify.get('/me', {
    schema: {
      response: {
        200: MeResponseSchema,
        401: MessageResponseSchema,
      },
    },
  }, async (request, reply) => {
    try {
      await request.jwtVerify();
      const user = await em.findOne(User, { id: (request.user as any).sub });
      if (!user) {
        return reply.status(401).send({ message: 'Unauthorized' });
      }
      return reply.status(200).send({ user });
    } catch (err) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  });
};
