import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { RefreshToken } from '../../entities/RefreshToken.js';
import { MessageResponseSchema } from 'shared';

export const logoutRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  fastify.post('/logout', {
    schema: {
      response: {
        200: MessageResponseSchema,
      },
    },
  }, async (request, reply) => {
    const token = request.cookies.refreshToken;
    if (token) {
      const storedToken = await em.findOne(RefreshToken, { token });
      if (storedToken) {
        em.remove(storedToken);
        await em.flush();
      }
    }
    reply.clearCookie('refreshToken');
    return reply.status(200).send({ message: 'Logged out successfully' });
  });
};
