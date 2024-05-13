import * as memberController from "@/controllers/member.controller";
import type { FastifyInstance } from "fastify";
import {
  indexMemberSchema,
  searchMemberSchema,
  showMemberSchema,
  createLoanMemberSchema,
  updateMemberSchema,
  updateStatusMemberSchema,
  verifyMemberSchema,
  calculateDepositMemberSchema,
  calculateDepositExistingMemberSchema,
  addLoanMemberSchema,
} from "@/schemas/member.schema";

const memberRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { schema: indexMemberSchema, preHandler: [fastify.authorize(["owner"])] }, memberController.index);
  fastify.get("/recap", { preHandler: [fastify.authorize(["branch_head", "teller"])] }, memberController.indexRecap);
  fastify.get(
    "/pending",
    { preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.indexPending,
  );
  fastify.get(
    "/search",
    { schema: searchMemberSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.search,
  );
  fastify.get("/:id", { schema: showMemberSchema, preHandler: [fastify.authenticate] }, memberController.show);
  fastify.post(
    "/loan",
    { schema: createLoanMemberSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.createWithLoan,
  );
  fastify.put(
    "/:id",
    { schema: updateMemberSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.update,
  );
  fastify.put(
    "/:id/status",
    { schema: updateStatusMemberSchema, preHandler: [fastify.authorize(["branch_head"])] },
    memberController.updateStatus,
  );
  fastify.post(
    "/:id/verify",
    { schema: verifyMemberSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.verify,
  );
  fastify.post(
    "/:id/deposit",
    { schema: addLoanMemberSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.addDeposit,
  );
  fastify.post(
    "/:id/loan",
    { schema: addLoanMemberSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.addLoan,
  );
  fastify.post(
    "/calculate-deposit",
    { schema: calculateDepositMemberSchema, preHandler: [fastify.authenticate] },
    memberController.calculateDeposit,
  );
  fastify.post(
    "/:id/calculate-deposit",
    { schema: calculateDepositExistingMemberSchema, preHandler: [fastify.authenticate] },
    memberController.calculateDepositExisting,
  );
};

export default memberRoutes;
