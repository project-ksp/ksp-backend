import type { FastifyReply, FastifyRequest } from "fastify";
import * as memberService from "@/services/member.service";
import type { IndexMemberSchema } from "@/schemas/member.schema";

export async function index(request: FastifyRequest<IndexMemberSchema>, reply: FastifyReply) {
  const { page } = request.query;

  try {
    const data = await memberService.getAllMembers(page);
    reply.send({
      message: "Members successfully fetched.",
      data,
    });
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}
