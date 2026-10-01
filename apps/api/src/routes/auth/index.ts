import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { registerRoute } from './register.route.js';
import { loginRoute } from './login.route.js';
import { refreshRoute } from './refresh.route.js';
import { logoutRoute } from './logout.route.js';
import { meRoute } from './me.route.js';

export const authRoutes: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  await fastify.register(registerRoute, { em });
  await fastify.register(loginRoute, { em });
  await fastify.register(refreshRoute, { em });
  await fastify.register(logoutRoute, { em });
  await fastify.register(meRoute, { em });
};
