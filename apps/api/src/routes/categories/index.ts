import { SqlEntityManager } from "@mikro-orm/postgresql";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { listCategoriesRoute } from "./list-categories.route.js";
import { createCategoryRoute } from "./create-category.route.js";
import { updateCategoryRoute } from "./update-category.route.js";

export const categoriesRoutes: FastifyPluginAsyncZod<{ em: SqlEntityManager }> = async (fastify, { em }) => {
    fastify.addHook('preHandler', async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.status(401).send({ message: 'Unauthorized' });
        }
    });

    await fastify.register(listCategoriesRoute, { em });
    await fastify.register(createCategoryRoute, { em });
    await fastify.register(updateCategoryRoute, { em });
};