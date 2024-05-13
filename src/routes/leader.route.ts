import * as leaderController from "@/controllers/leader.controller";
import { showLeaderSchema, updateLeaderSchema } from "@/schemas/leader.schema";
import type { FastifyInstance } from "fastify";

const leaderRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { preHandler: [fastify.authorize(["branch_head", "teller"])] }, leaderController.index);
  fastify.get(
    "/:id",
    { schema: showLeaderSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    leaderController.show,
  );
  fastify.post("/", { preHandler: [fastify.authorize(["branch_head", "teller"])] }, leaderController.create);
  fastify.put(
    "/:id",
    { schema: updateLeaderSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    leaderController.update,
  );
};

export default leaderRoutes;
