import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { users } from "@/db/schemas";
import fp from "fastify-plugin";
import { Redis } from "../utils";
import { db } from "../db";

const authorize = async (role: typeof users.$inferSelect.role, request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    if (request.user.role !== role) {
      throw Error("Invalid role");
    }
  } catch (error) {
    reply.code(401).send({ message: "Unauthorized" });
  }
};

const middleware = fp(async (fastify: FastifyInstance, _options: unknown) => {
  fastify.addHook("onRequest", async (request) => {
    request.redis = Redis;
    request.db = db;
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.code(401).send({ message: "Unauthorized" });
    }
  });

  fastify.decorate("authorizeOwner", async (request, reply) => {
    authorize("owner", request, reply);
  });

  fastify.decorate("authorizeTeller", async (request, reply) => {
    authorize("teller", request, reply);
  });

  fastify.decorate("authorizeBranchHead", async (request, reply) => {
    authorize("branch_head", request, reply);
  });
});

export { middleware };
