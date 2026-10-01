import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Transaction } from '../../entities/Transaction.js';
import { User } from '../../entities/User.js';
import { CreateTransactionSchema, TransactionResponseSchema, MessageResponseSchema } from 'shared';

export const createTransactionRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
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
    const user = await em.findOneOrFail(User, userId);

    const data = request.body;
    const transaction = new Transaction(data.name, data.transactionDate, data.amount, data.type, user);

    em.persist(transaction);
    await em.flush();
    return transaction;
  });
};
