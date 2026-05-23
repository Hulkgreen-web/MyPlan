import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import { MikroORM } from '@mikro-orm/postgresql';
import config from './mikro-orm.config.js';
import { authRoutes } from './routes/auth.js';
import { todoRoutes } from './routes/todos.js';
import { transactionRoutes } from './routes/transactions.js';

const start = async () => {
  const fastify = Fastify({ logger: true });
  
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

  // Database initialization
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();

  // Register Routes
  await fastify.register(authRoutes, { em, prefix: '/auth' });
  await fastify.register(todoRoutes, { em, prefix: '/todos' });
  await fastify.register(transactionRoutes, { em, prefix: '/transactions' });

  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
