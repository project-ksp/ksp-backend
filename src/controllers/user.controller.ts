import type { FastifyRequest, FastifyReply } from "fastify";
import * as userService from "@/services/user.service";
import { roleEnum, type users } from "@/db/schemas";
import { z } from "zod";
import { fromError } from "zod-validation-error";

export async function index(_request: FastifyRequest, reply: FastifyReply) {
  reply.send({ message: "User successfully fetched", data: await userService.getAllUsers() });
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const validator = z.object({
    branchId: z.number().int().nonnegative().optional(),
    role: z.enum(roleEnum.enumValues),
    name: z.string().min(1).max(255),
  });
  const validated = validator.safeParse(request.body);
  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }
  if (validated.data.role !== "owner" && !validated.data.branchId) {
    return reply.status(400).send({
      message: "Branch ID is required for non-owner user",
    });
  }

  try {
    const user = await userService.createUser(
      validated.data as Omit<typeof users.$inferInsert, "username" | "password">,
    );
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
