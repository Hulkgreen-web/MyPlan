import { SqlEntityManager } from "@mikro-orm/postgresql";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { CategoriesService } from "../../services/categories.service.js";
import { CategoryResponseSchema, MessageResponseSchema } from "shared";
import z from "zod";

export const listCategoriesRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
    const categoriesService = new CategoriesService(em);

    fastify.get('/', {
        schema: {
            response: {
                200: z.array(CategoryResponseSchema),
                401: MessageResponseSchema,
            },
        },
    }, async (request) => {
        return await categoriesService.findAll();
    });
}