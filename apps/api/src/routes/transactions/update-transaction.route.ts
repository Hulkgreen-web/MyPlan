import { z } from 'zod';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Transaction } from '../../entities/Transaction.js';
import { UpdateTransactionSchema, TransactionResponseSchema, MessageResponseSchema } from 'shared';
import { TransactionsService } from '../../services/transactions.service.js';

export const updateTransactionRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  const transactionsService = new TransactionsService(em);

  fastify.patch('/:id', {
    schema: {
      params: z.object({
        id: z.string(),
      }),
      body: UpdateTransactionSchema,
      response: {
        200: TransactionResponseSchema,
        401: MessageResponseSchema,
      },
    },
  }, async (request) => {
    const userId = (request.user as any).sub;
    const { id } = request.params;
    return await transactionsService.update(userId, id, request.body);
   
  });
};
