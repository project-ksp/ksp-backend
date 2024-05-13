import * as loanController from "@/controllers/loan.controller";
import { updateStatusLoanSchema, verifyLoanSchema } from "@/schemas/loan.schema";
import type { FastifyInstance } from "fastify";

const loanRoutes = async (fastify: FastifyInstance) => {
  fastify.put(
    "/:id/status",
    { schema: updateStatusLoanSchema, preHandler: [fastify.authorize(["owner", "branch_head"])] },
    loanController.updateStatus,
  );
  fastify.post(
    "/:id/verify",
    { schema: verifyLoanSchema, preHandler: [fastify.authorize(["owner", "branch_head"])] },
    loanController.verify,
  );
};

export default loanRoutes;
