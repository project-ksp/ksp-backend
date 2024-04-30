import type { FastifyReply, FastifyRequest } from "fastify";
import * as memberService from "@/services/member.service";

export async function index(_request: FastifyRequest, reply: FastifyReply) {
  reply.send({
    message: "Members successfully fetched.",
    data: await memberService.getAllMembers(),
  });
}
