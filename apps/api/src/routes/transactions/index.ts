import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { listTransactionsRoute } from './list-transactions.route.js';
import { createTransactionRoute } from './create-transaction.route.js';
import { updateTransactionRoute } from './update-transaction.route.js';

export const transactionRoutes: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  // Authentication hook for all transaction routes
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Unauthorized' });
    }
  });

  await fastify.register(listTransactionsRoute, { em });
  await fastify.register(createTransactionRoute, { em });
  await fastify.register(updateTransactionRoute, { em });
};
