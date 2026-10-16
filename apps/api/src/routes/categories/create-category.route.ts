import { SqlEntityManager } from "@mikro-orm/postgresql";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { CategoriesService } from "../../services/categories.service.js";
import { CategoryResponseSchema, CreateCategorySchema, MessageResponseSchema } from "shared";

export const createCategoryRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
    const categoriesService = new CategoriesService(em);

    fastify.post('/', {
        schema: {
            body: CreateCategorySchema,
            response: {
                200: CategoryResponseSchema,
                400: MessageResponseSchema,
                401: MessageResponseSchema,
            },
        },
    }, async (request) => {
        return await categoriesService.create(request.body);
    });
}