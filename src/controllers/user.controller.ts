import type { FastifyRequest, FastifyReply } from "fastify";
import * as userService from "@/services/user.service";
import type { users } from "@/db/schemas";

export async function index(_request: FastifyRequest, reply: FastifyReply) {
  reply.send({ message: "User successfully fetched", data: await userService.getAllUsers() });
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const data = request.body as typeof users.$inferInsert;
  try {
    const user = await userService.createUser(data);
    reply.send({
      message: "User successfully created",
      data: user,
    });
  } catch (error) {
    reply.status(422).send({
      message: error instanceof Error ? error.message : "An error occured.",
    });
  }
}
