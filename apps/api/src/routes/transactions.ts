import { FastifyPluginAsync } from 'fastify';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Transaction } from '../entities/Transaction.js';
import { CreateTransactionSchema } from 'shared';

export const transactionRoutes: FastifyPluginAsync<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  fastify.get('/', async () => {
    return await em.find(Transaction, {}, { orderBy: { transactionDate: 'DESC' } as any });
  });

  fastify.post('/', async (request, reply) => {
    const data = CreateTransactionSchema.parse(request.body);
    const transaction = new Transaction(data.name, data.transactionDate, data.amount, data.type);
    em.persist(transaction);
    await em.flush();
    return transaction;
  });
};