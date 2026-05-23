import 'reflect-metadata';
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { MikroORM, SqlEntityManager } from '@mikro-orm/postgresql';
import config from './mikro-orm.config.js';
import { authRoutes } from './routes/auth.js';
import { todoRoutes } from './routes/todos.js';
import { transactionRoutes } from './routes/transactions.js';

export const buildApp = async (orm?: MikroORM): Promise<FastifyInstance> => {
  const fastify = Fastify({ logger: false });
  
  // Plugins
  await fastify.register(cors, {
    origin: true,
    credentials: true
  });
  
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret'
  });

  await fastify.register(cookie, {
    secret: 'cookie-secret',
    parseOptions: {}
  });

  fastify.setErrorHandler((error, request, reply) => {
    if (error.constructor.name === 'ZodError') {
      return reply.status(400).send({
        message: 'Validation error',
        errors: (error as any).errors,
      });
    }
    fastify.log.error(error);
    reply.status(500).send({ message: 'Internal Server Error' });
  });

  // Database initialization
  const actualOrm = orm || await MikroORM.init(config);
  const em = actualOrm.em.fork() as SqlEntityManager;

  // Register Routes
  await fastify.register(authRoutes, { em, prefix: '/auth' });
  await fastify.register(todoRoutes, { em, prefix: '/todos' });
  await fastify.register(transactionRoutes, { em, prefix: '/transactions' });

  return fastify;
};
