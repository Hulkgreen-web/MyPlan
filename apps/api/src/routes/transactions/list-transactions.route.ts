import { z } from 'zod';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { TransactionResponseSchema, MessageResponseSchema } from 'shared';
import { TransactionsService } from '../../services/transactions.service.js';

export const listTransactionsRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  const transactionsService = new TransactionsService(em);

  fastify.get('/', {
    schema: {
      response: {
        200: z.array(TransactionResponseSchema),
        401: MessageResponseSchema,
      },
    },
  }, async (request) => {
    const userId = (request.user as any).sub;
    return await transactionsService.findAll(userId);
  });
};
