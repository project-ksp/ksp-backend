import * as tellerController from "@/controllers/teller.controller";
import { showTellerSchema, updateTellerSchema } from "@/schemas/teller.schema";
import type { FastifyInstance } from "fastify";

const tellerRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { preHandler: [fastify.authorize(["branch_head", "teller"])] }, tellerController.index);
  fastify.get(
    "/:id",
    { schema: showTellerSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    tellerController.show,
  );
  fastify.post("/", { preHandler: [fastify.authorize(["branch_head", "teller"])] }, tellerController.create);
  fastify.put(
    "/:id",
    { schema: updateTellerSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    tellerController.update,
  );
};

export default tellerRoutes;
