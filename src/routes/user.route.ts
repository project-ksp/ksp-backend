import * as userController from "@/controllers/user.controller";
import type { FastifyInstance } from "fastify";

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { preHandler: [fastify.authenticate] }, userController.index);
};

export default userRoutes;
