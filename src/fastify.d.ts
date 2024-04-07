/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { db } from "./db";
import type { Redis } from "./utils";
import type { users } from "./db/schemas";

declare module "fastify" {
  interface FastifyRequest {
    db: typeof db;
    redis: typeof Redis;
    user: Omit<typeof users.$inferSelect, "password">;
  }

  interface FastifyInstance extends FastifyJwtNamespace<> {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeOwner: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeTeller: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorizeBranchHead: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
