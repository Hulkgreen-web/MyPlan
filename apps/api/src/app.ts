import 'reflect-metadata';
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { MikroORM, SqlEntityManager } from '@mikro-orm/postgresql';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import config from './mikro-orm.config.js';
import { authRoutes } from './routes/auth/index.js';
import { transactionRoutes } from './routes/transactions/index.js';
import { usersRoutes } from './routes/users/index.js';

export const buildApp = async (orm?: MikroORM): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: {
      transport: {
        target: "@fastify/one-line-logger",
      },
    },
  }).withTypeProvider<ZodTypeProvider>();

  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  
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
    if ((error as any).validation) {
      return reply.status(400).send({
        message: 'Validation error',
        errors: (error as any).validation?.errors || (error as any).validation,
      });
    }
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      return reply.status(error.statusCode).send({ message: error.message });
    }
    fastify.log.error(error);
    reply.status(500).send({ message: 'Internal Server Error' });
  });

  // Database initialization
  const actualOrm = orm || await MikroORM.init(config);

  if (!orm && process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    await actualOrm.schema.update();
  }

  const em = actualOrm.em.fork() as SqlEntityManager;

  // Register Routes
  await fastify.register(authRoutes, { em, prefix: '/auth' });
  await fastify.register(transactionRoutes, { em, prefix: '/transactions' });
  await fastify.register(usersRoutes, { em, prefix: '/users' });

  return fastify;
};
