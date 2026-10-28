import { SqlEntityManager } from "@mikro-orm/postgresql";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { BudgetResponseSchema, MessageResponseSchema } from "shared";
import { BudgetsService } from "../../services/budgets.service.js";

export const getBudgetRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager}> = async (fastify, { em }) => {
    const budgetsService = new BudgetsService(em);

    fastify.get('/', {
        schema: {
            response: {
                200: BudgetResponseSchema,
                401: MessageResponseSchema,
                404: MessageResponseSchema,
            },
        },
    }, async (request) => {
        const userId = (request.user as any).sub;
        return await budgetsService.findById(userId);
    });
}