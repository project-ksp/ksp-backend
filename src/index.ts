import fastify from "fastify";
import { initDb } from "@/db";
import { testRoutes } from "@/routes";
import { env, Logger, Redis } from "@/utils";
import { middleware } from "@/modules/middleware";

// eslint-disable-next-line @typescript-eslint/naming-convention
const API_VERSION = "v1";

export const main = async () => {
  const server = fastify({
    bodyLimit: 1_000_000,
    trustProxy: true,
  });

  await initDb();
  await Redis.initialize();

  server.register(middleware);
  server.register(import("@fastify/cors"), {
    maxAge: 600,
    origin: true,
    credentials: true,
  });

  // Routes
  server.register(testRoutes, {
    prefix: `/${API_VERSION}/test`,
  });

  server.listen({ host: env.HOST, port: env.PORT }, (error, address) => {
    if (error) {
      Logger.error("INIT", error.message);
      throw new Error(error.message);
    }

    Logger.info("INIT", `Server listening at ${address}`);
  });

  return server;
};

main();
