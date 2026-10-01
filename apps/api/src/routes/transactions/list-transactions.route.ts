import { z } from 'zod';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Transaction } from '../../entities/Transaction.js';
import { TransactionResponseSchema, MessageResponseSchema } from 'shared';

export const listTransactionsRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  fastify.get('/', {
    schema: {
      response: {
        200: z.array(TransactionResponseSchema),
        401: MessageResponseSchema,
      },
    },
  }, async (request) => {
    const userId = (request.user as any).sub;
    return await em.find(Transaction, { user: userId }, { orderBy: { transactionDate: 'DESC' } as any });
  });
};
