import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Transaction } from '../entities/Transaction.js';
import { CreateTransactionSchema, UpdateTransactionSchema } from 'shared';
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

  type ParamsType = { id: string };

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

  fastify.patch('/:id', async (request: FastifyRequest<{ Params: ParamsType }>, reply) => {
    const userId = (request.user as any).sub;
    const { id } = request.params as ParamsType;
    const transactionToUpdate = await em.findOneOrFail(Transaction, { id, user: userId});
    const data = UpdateTransactionSchema.parse(request.body);

    em.assign(transactionToUpdate, data);
    await em.flush();
    return transactionToUpdate;
  });
  
}
