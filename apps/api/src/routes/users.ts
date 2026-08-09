import { SqlEntityManager } from "@mikro-orm/postgresql";
import fastify, { FastifyPluginAsync } from "fastify";
import { User } from "../entities/User.js";

export const usersRoutes: FastifyPluginAsync<{ em: SqlEntityManager }> = async (fastify, { em }) => {

    fastify.get("/", async () => {
        const users = await em.findAll(User);
        return users;
    });
}