import type { FastifyReply } from "fastify/types/reply";
import type { FastifyRequest } from "fastify/types/request";

export async function index(request: FastifyRequest, reply: FastifyReply) {
  const users = await request.db.query.users.findMany();
  reply.send({ message: "User successfully fetched", data: users });
}
