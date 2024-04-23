import * as branchController from "@/controllers/branch.controller";
import type { FastifyInstance } from "fastify";

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post("/", { preHandler: [fastify.authorize({ roles: ["owner"] })] }, branchController.create);
};

export default authRoutes;
