import * as userController from "@/controllers/user.controller";
import type { FastifyInstance } from "fastify";

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { preHandler: [fastify.authenticate] }, userController.index);
  fastify.post("/", { preHandler: [fastify.authorize(["owner"])] }, userController.create);
  fastify.get("/export", { preHandler: [fastify.authorize(["owner"])] }, userController.download);
};

export default userRoutes;
