import * as branchController from "@/controllers/branch.controller";
import { updateBranchPublishSchema } from "@/schemas/branch.schema";
import type { FastifyInstance } from "fastify";

const authRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { preHandler: [fastify.authorize(["owner"])] }, branchController.index);
  fastify.post("/", { preHandler: [fastify.authorize(["owner"])] }, branchController.create);
  fastify.put(
    "/:id/publish",
    {
      schema: updateBranchPublishSchema,
      preHandler: [fastify.authorize(["owner"])],
    },
    branchController.updatePublish,
  );
};

export default authRoutes;
