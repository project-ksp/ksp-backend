import bcrypt from "bcrypt";
import type { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";

const authRoutes: FastifyPluginAsyncJsonSchemaToTs = async (fastify, _) => {
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
            required: ["message", "token", "refreshToken"],
            properties: {
              message: { type: "string" },
              token: { type: "string" },
              refreshToken: { type: "string" },
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

      const refreshToken = await reply.jwtSign({ id: user.id }, { expiresIn: "7d" });

      reply.send({
        message: "Login successful",
        token,
        refreshToken,
      });
    },
  );

  fastify.post(
    "/refresh",
    {
      schema: {
        headers: {
          type: "object",
          required: ["authorization"],
          properties: {
            authorization: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
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

      const token = await reply.jwtSign({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      reply.send({
        message: "Token refreshed",
        token,
      });
    },
  );
};

export default authRoutes;
