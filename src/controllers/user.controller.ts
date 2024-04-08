import type { FastifyReply } from "fastify/types/reply";
import type { FastifyRequest } from "fastify/types/request";
import * as userService from "@/services/user.service";

export async function index(_request: FastifyRequest, reply: FastifyReply) {
  reply.send({ message: "User successfully fetched", data: await userService.getAllUsers() });
}
