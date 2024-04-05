import bcrypt from "bcrypt";
import type { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";

const authRoutes: FastifyPluginAsyncJsonSchemaToTs = async (fastify, _) => {
  fastify.get("/me", async (request, reply) => {
    const { id } = (await request.jwtVerify()) satisfies { id: number };

    const user = await request.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
    if (!user) {
      reply.status(401).send({
        message: "Invalid user ID",
      });
      return;
    }

    const { password, ...rest } = user;

    reply.send({
      message: "Successfully authenticated",
      data: rest,
    });
  });
  fastify.post(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string" },
            password: { type: "string" },
          },
        },
        response: {
          default: {
            type: "object",
            required: ["message", "token"],
            properties: {
              message: { type: "string" },
              token: { type: "string" },
            },
          },
          401: {
            type: "object",
            required: ["message"],
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body;

      const user = await request.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username),
      });

      if (!user || !bcrypt.compareSync(password, user.password)) {
        reply.status(401).send({
          message: "Invalid username or password",
        });
        return;
      }

      const token = await reply.jwtSign({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      reply
        .setCookie("token", token, {
          httpOnly: true,
        })
        .send({
          message: "Login successful",
          token,
        });
    },
  );
};

export default authRoutes;
