import { FastifyPluginAsync } from 'fastify';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Transaction } from '../entities/Transaction.js';
import { CreateTransactionSchema } from 'shared';
import { User } from '../entities/User.js';

export const transactionRoutes: FastifyPluginAsync<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  // Authentication hook for all routes in this plugin
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Unauthorized' });
    }
  });

  fastify.get('/', async (request) => {
    const userId = (request.user as any).sub;
    return await em.find(Transaction, { user: userId }, { orderBy: { transactionDate: 'DESC' } as any });
  });

  fastify.post('/', async (request, reply) => {
    const userId = (request.user as any).sub;
    const user = await em.findOneOrFail(User, userId);
    
    const data = CreateTransactionSchema.parse(request.body);
    const transaction = new Transaction(data.name, data.transactionDate, data.amount, data.type, user);
    
    em.persist(transaction);
    await em.flush();
    return transaction;
  });
};
