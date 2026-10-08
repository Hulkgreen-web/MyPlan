import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { CreateTransactionSchema, TransactionResponseSchema, MessageResponseSchema } from 'shared';
import { TransactionsService } from '../../services/transactions.service.js';

export const createTransactionRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  const transactionsService = new TransactionsService(em);

  fastify.post('/', {
    schema: {
      body: CreateTransactionSchema,
      response: {
        200: TransactionResponseSchema,
        400: MessageResponseSchema,
        401: MessageResponseSchema,
      },
    },
  }, async (request) => {
    const userId = (request.user as any).sub;
    return await transactionsService.create(userId, request.body);
  });
};
