import * as authController from "@/controllers/auth.controller";
import { accessBranchSchema, loginSchema } from "@/schemas/auth.schema";
import type { FastifyInstance } from "fastify";

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/login", { schema: loginSchema }, authController.authenticate);
  fastify.get("/me", { preHandler: [fastify.authenticate] }, authController.getAuthUserData);
  fastify.get("/overview", { preHandler: [fastify.authorize(["owner"])] }, authController.overview);
  fastify.post(
    "/access-branch",
    {
      schema: accessBranchSchema,
      preHandler: [fastify.authorize(["owner"])],
    },
    authController.authenticateAsBranchHead,
  );
};

export default authRoutes;
