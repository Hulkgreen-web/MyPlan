import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import bcrypt from 'bcrypt';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { User } from '../../entities/User.js';
import { RegisterSchema, MessageResponseSchema } from 'shared';

export const registerRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  fastify.post('/register', {
    schema: {
      body: RegisterSchema,
      response: {
        201: MessageResponseSchema,
        400: MessageResponseSchema,
      },
    },
  }, async (request, reply) => {
    const data = request.body;

    const existing = await em.findOne(User, { email: data.email });
    if (existing) return reply.status(400).send({ message: 'User already exists' });

    const user = new User(data.email, data.name);
    user.password = await bcrypt.hash(data.password, 10);

    em.persist(user);
    await em.flush();
    return reply.status(201).send({ message: `User with email ${user.email} created successfully` });
  });
};
