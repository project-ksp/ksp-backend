import * as authController from "@/controllers/auth.controller";
import type { FastifyInstance } from "fastify";

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/login", authController.authenticate);
  fastify.get("/me", { preHandler: [fastify.authenticate] }, authController.getAuthUserData);
};

export default authRoutes;
