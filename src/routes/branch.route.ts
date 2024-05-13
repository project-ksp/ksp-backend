import * as branchController from "@/controllers/branch.controller";
import { updateBranchPublishSchema } from "@/schemas/branch.schema";
import type { FastifyInstance } from "fastify";

const branchRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { preHandler: [fastify.authenticate] }, branchController.index);
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

export default branchRoutes;
