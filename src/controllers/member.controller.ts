import type { FastifyReply, FastifyRequest } from "fastify";
import * as memberService from "@/services/member.service";
import { z } from "zod";
import { fromError } from "zod-validation-error";

export async function index(request: FastifyRequest, reply: FastifyReply) {
  const validator = z.object({
    page: z.preprocess(Number, z.number()).optional(),
  });
  const validated = validator.safeParse(request.query);
  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  const { page } = validated.data;

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
