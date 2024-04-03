import fp from "fastify-plugin";

export default fp(async (fastify, _) => {
  fastify.register(import("./auth.route"), {
    prefix: "/v1/",
  });
});
