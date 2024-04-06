import * as authController from "@/controllers/auth.controller";
import type { FastifyInstance } from "fastify";

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/me", authController.getAuthUserData);
  fastify.post("/login", authController.authenticate);
};

export default authRoutes;
