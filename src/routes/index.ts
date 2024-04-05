import fp from "fastify-plugin";

export default fp(async (fastify, opts) => {
  const { prefix } = opts as { prefix: string };

  fastify.register(import("./auth.route"), { prefix });
});
