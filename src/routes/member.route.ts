import * as memberController from "@/controllers/member.controller";
import type { FastifyInstance } from "fastify";
import {
  createDepositMemberSchema,
  indexMemberSchema,
  searchMemberSchema,
  updateStatusMemberSchema,
  verifyMemberSchema,
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
  fastify.post(
    "/deposit",
    { schema: createDepositMemberSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.createDeposit,
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
};

export default memberRoutes;
