import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getBudgetRoute } from "./budget.get.route.js";
import { SqlEntityManager } from "@mikro-orm/postgresql";
import { updateBudgetRoute } from "./update.budget.route.js";
import { resetBudgetRoute } from "./reset.budget.route.js";

export const budgetRoutes: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
  // Authentication hook for all transaction routes
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ message: 'Unauthorized' });
    }
  });

  await fastify.register(getBudgetRoute, { em });
  await fastify.register(updateBudgetRoute, { em });
  await fastify.register(resetBudgetRoute, { em });
};
