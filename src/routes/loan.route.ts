import * as loanController from "@/controllers/loan.controller";
import { updateStatusLoanSchema, verifyLoanSchema } from "@/schemas/loan.schema";
import type { FastifyInstance } from "fastify";

const loanRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/pending", { preHandler: [fastify.authenticate] }, loanController.indexPending);
  fastify.put(
    "/:id/status",
    { schema: updateStatusLoanSchema, preHandler: [fastify.authenticate] },
    loanController.updateStatus,
  );
  fastify.post("/:id/verify", { schema: verifyLoanSchema, preHandler: [fastify.authenticate] }, loanController.verify);
};

export default loanRoutes;
