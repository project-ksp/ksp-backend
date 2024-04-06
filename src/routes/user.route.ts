import * as userController from "@/controllers/user.controller";
import type { FastifyInstance } from "fastify";

const userRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", userController.index);
};

export default userRoutes;
