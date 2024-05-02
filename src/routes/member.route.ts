import * as memberController from "@/controllers/member.controller";
import { indexMemberSchema, searchMemberSchema } from "@/schemas/member.schema";
import type { FastifyInstance } from "fastify";

const memberRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { schema: indexMemberSchema, preHandler: [fastify.authenticate] }, memberController.index);
  fastify.get(
    "/search",
    { schema: searchMemberSchema, preHandler: [fastify.authorize(["branch_head", "teller"])] },
    memberController.search,
  );
};

export default memberRoutes;
