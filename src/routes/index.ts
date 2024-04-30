import fp from "fastify-plugin";

export default fp(async (fastify, opts) => {
  const { prefix } = opts as { prefix: string };

  fastify.register(import("./auth.route"), { prefix: `${prefix}/auth` });
  fastify.register(import("./user.route"), { prefix: `${prefix}/users` });
  fastify.register(import("./member.route"), { prefix: `${prefix}/members` });
  fastify.register(import("./upload.route"), { prefix: `${prefix}/uploads` });
  fastify.register(import("./branch.route"), { prefix: `${prefix}/branches` });
});
