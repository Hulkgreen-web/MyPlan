import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { RefreshToken } from '../../entities/RefreshToken.js';
import { RefreshResponseSchema, MessageResponseSchema } from 'shared';

export const refreshRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  fastify.post('/refresh', {
    schema: {
      response: {
        200: RefreshResponseSchema,
        401: MessageResponseSchema,
      },
    },
  }, async (request, reply) => {
    const token = request.cookies.refreshToken;
    if (!token) return reply.status(401).send({ message: 'No refresh token' });

    const storedToken = await em.findOne(RefreshToken, { token }, { populate: ['user'] });
    if (!storedToken || storedToken.expiresAt < new Date()) {
      return reply.status(401).send({ message: 'Invalid or expired refresh token' });
    }

    const user = storedToken.user;
    if (!user) {
      return reply.status(401).send({ message: 'User not found' });
    }
    const accessToken = fastify.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: '15m' });

    return reply.status(200).send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
    });
  });
};
