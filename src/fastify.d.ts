/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { db } from "./db";
import type { Redis } from "./utils";

declare module "fastify" {
  interface FastifyRequest {
    db: typeof db;
    redis: typeof Redis;
  }

  interface FastifyInstance extends FastifyJwtNamespace<> {}
}
