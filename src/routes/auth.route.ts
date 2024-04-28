import * as authController from "@/controllers/auth.controller";
import type { FastifyInstance } from "fastify";

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/login", authController.authenticate);
  fastify.get("/me", { preHandler: [fastify.authenticate] }, authController.getAuthUserData);
  fastify.post(
    "/access-branch",
    { preHandler: [fastify.authorize({ roles: ["owner"] })] },
    authController.authenticateAsBranchHead,
  );
};

export default authRoutes;
