import * as memberController from "@/controllers/member.controller";
import { indexMemberSchema } from "@/schemas/member.schema";
import type { FastifyInstance } from "fastify";

const memberRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { schema: indexMemberSchema, preHandler: [fastify.authenticate] }, memberController.index);
};

export default memberRoutes;
