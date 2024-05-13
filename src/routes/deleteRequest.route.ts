import * as deleteRequestController from "@/controllers/deleteRequest.controller";
import {
  createDeleteRequestSchema,
  removeDeleteRequestSchema,
  updateStatusDeleteRequestSchema,
} from "@/schemas/deleteRequest.schema";
import type { FastifyInstance } from "fastify";

const deleteRequestRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { preHandler: [fastify.authorize(["branch_head", "teller"])] }, deleteRequestController.index);
  fastify.post(
    "/",
    { schema: createDeleteRequestSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    deleteRequestController.create,
  );
  fastify.put(
    "/:id/status",
    { schema: updateStatusDeleteRequestSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    deleteRequestController.updateStatus,
  );
  fastify.delete(
    "/:id",
    { schema: removeDeleteRequestSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    deleteRequestController.remove,
  );
};

export default deleteRequestRoutes;
