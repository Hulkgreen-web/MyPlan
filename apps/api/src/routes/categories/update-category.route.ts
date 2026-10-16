import { SqlEntityManager } from "@mikro-orm/postgresql";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { CategoriesService } from "../../services/categories.service.js";
import z from "zod";
import { CategoryResponseSchema, MessageResponseSchema, UpdateCategorySchema } from "shared";

export const updateCategoryRoute: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
    const categoriesService = new CategoriesService(em);

    fastify.patch('/:id', {
        schema: {
            params: z.object({
                id: z.string()
            }),
            body: UpdateCategorySchema,
            response: {
                200: CategoryResponseSchema,
                400: MessageResponseSchema,
                401: MessageResponseSchema,
                404: MessageResponseSchema,
            },
        },
    }, async (request) => {
        return await categoriesService.update(request.params.id, request.body);
    })
}