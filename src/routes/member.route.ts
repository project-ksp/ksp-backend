import * as memberController from "@/controllers/member.controller";
import type { FastifyInstance } from "fastify";
import {
  indexMemberSchema,
  searchMemberSchema,
  showMemberSchema,
  createLoanMemberSchema,
  updateMemberSchema,
  calculateDepositMemberSchema,
  calculateDepositExistingMemberSchema,
  addLoanMemberSchema,
  createDepositMemberSchema,
  memberIdParamSchema,
} from "@/schemas/member.schema";

const memberRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { schema: indexMemberSchema, preHandler: [fastify.authorize(["owner"])] }, memberController.index);
  fastify.get("/recap", { preHandler: [fastify.authorize(["branch_head", "teller"])] }, memberController.indexRecap);
  fastify.get(
    "/all-members",
    { preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.memberBookData,
  );
  fastify.get(
    "/pending",
    { preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.indexPending,
  );
  fastify.get(
    "/inactive",
    { preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.indexInactive,
  );
  fastify.get(
    "/search",
    { schema: searchMemberSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.search,
  );
  fastify.get("/:id", { schema: showMemberSchema, preHandler: [fastify.authenticate] }, memberController.show);
  fastify.post(
    "/deposit",
    { schema: createDepositMemberSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.createWithDeposit,
  );
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
  fastify.get(
    "/:id/card",
    { schema: memberIdParamSchema, preHandler: [fastify.authenticate] },
    memberController.getMemberCard,
  );
  fastify.get(
    "/:id/deposit-form",
    { schema: memberIdParamSchema, preHandler: [fastify.authenticate] },
    memberController.getDepositForm,
  );
  fastify.get(
    "/:id/loan-form",
    { schema: memberIdParamSchema, preHandler: [fastify.authenticate] },
    memberController.getLoanForm,
  );
  fastify.get(
    "/:id/registration-form",
    { schema: memberIdParamSchema, preHandler: [fastify.authenticate] },
    memberController.getRegistrationForm,
  );
  fastify.get(
    "/list-book",
    { preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.getMemberListBook,
  );
};

export default memberRoutes;
