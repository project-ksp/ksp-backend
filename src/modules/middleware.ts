import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Redis } from "../utils";
import { db } from "../db";

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

  fastify.decorate("authorize", (options) => {
    return async (request, reply) => {
      try {
        await request.jwtVerify();
        if (options && options.roles && !options.roles.includes(request.user.role)) {
          throw new Error("Unauthorized");
        }
      } catch (error) {
        reply.code(401).send({ message: "Unauthorized" });
      }
    };
  });
});

export { middleware };
