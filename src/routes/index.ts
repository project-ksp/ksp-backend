import fp from "fastify-plugin";

export default fp(async (fastify, opts) => {
  const { prefix } = opts as { prefix: string };

  fastify.register(import("./auth.route"), { prefix: `${prefix}/auth` });
  fastify.register(import("./user.route"), { prefix: `${prefix}/users` });
  fastify.register(import("./member.route"), { prefix: `${prefix}/members` });
  fastify.register(import("./upload.route"), { prefix: `${prefix}/uploads` });
  fastify.register(import("./teller.route"), { prefix: `${prefix}/tellers` });
  fastify.register(import("./leader.route"), { prefix: `${prefix}/leaders` });
  fastify.register(import("./branch.route"), { prefix: `${prefix}/branches` });
  fastify.register(import("./document.route"), { prefix: `${prefix}/documents` });
  fastify.register(import("./deleteRequest.route"), { prefix: `${prefix}/delete-requests` });
});
