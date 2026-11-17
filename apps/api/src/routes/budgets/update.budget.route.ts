import { SqlEntityManager } from "@mikro-orm/postgresql";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { BudgetsService } from "../../services/budgets.service.js";
import { BudgetResponseSchema, MessageResponseSchema, UpdateBudgetSchema } from "shared";

export const updateBudgetRoute: FastifyPluginAsyncZod<{ em : SqlEntityManager }> = async (fastify, { em }) => {
    const budgetsService = new BudgetsService(em);

    fastify.patch('/', {
        schema: {
            body: UpdateBudgetSchema,
            response: {
                200: BudgetResponseSchema,
                401: MessageResponseSchema,
                404: MessageResponseSchema,
                500: MessageResponseSchema,
            },
        },
    }, async (request) => {
        const userId = (request.user as any).sub;
        return await budgetsService.addMoneyToBudget(userId, request.body);
    });
}