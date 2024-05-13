import type { FastifyRequest, FastifyReply } from "fastify";
import * as userService from "@/services/user.service";
import { userInsertSchema } from "@/db/schemas";
import { fromError } from "zod-validation-error";

export async function index(request: FastifyRequest, reply: FastifyReply) {
  reply.send({
    message: "User successfully fetched",
    data:
      request.user.role === "owner"
        ? await userService.getAllUsers()
        : await userService.getAllUsersInBranch(request.user.branchId),
  });
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const validated = userInsertSchema.safeParse(request.body);
  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  try {
    const user = await userService.createUser(validated.data);
    reply.send({
      message: "User successfully created",
      data: user,
    });
  } catch (error) {
    reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occured.",
    });
  }
}

export async function download(_request: FastifyRequest, reply: FastifyReply) {
  const data = await userService.generateCSV();
  reply.header("Content-Disposition", 'attachment; filename="users.csv"').send(data);
}
