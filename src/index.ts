import fastify from "fastify";
import { initDb } from "@/db";
import { env, Logger, Redis } from "@/utils";
import { middleware } from "@/modules/middleware";

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

  server.register(import("@fastify/jwt"), {
    secret: env.APP_KEY,
    sign: {
      expiresIn: "15m",
    },
  });

  server.register(import("@/routes"), {
    prefix: `/${API_VERSION}`,
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
