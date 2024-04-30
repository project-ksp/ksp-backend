import * as memberController from "@/controllers/member.controller";
import type { FastifyInstance } from "fastify";

const memberRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/", { preHandler: [fastify.authenticate] }, memberController.index);
};

export default memberRoutes;
