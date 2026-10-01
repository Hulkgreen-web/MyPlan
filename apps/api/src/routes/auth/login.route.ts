import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import bcrypt from 'bcrypt';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { User } from '../../entities/User.js';
import { RefreshToken } from '../../entities/RefreshToken.js';
import { LoginSchema, LoginResponseSchema, MessageResponseSchema } from 'shared';

export const loginRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  fastify.post('/login', {
    schema: {
      body: LoginSchema,
      response: {
        200: LoginResponseSchema,
        401: MessageResponseSchema,
      },
    },
  }, async (request, reply) => {
    const data = request.body;
    const user = await em.findOne(User, { email: data.email });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      return reply.status(401).send({ message: 'Invalid credentials' });
    }

    const accessToken = fastify.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: '15m' });
    const refreshTokenValue = fastify.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

    const refreshToken = new RefreshToken(
      refreshTokenValue,
      user,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );
    em.persist(refreshToken);
    await em.flush();

    reply.setCookie('refreshToken', refreshTokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return reply.status(200).send({ message: 'Login successful', user, accessToken });
  });
};
