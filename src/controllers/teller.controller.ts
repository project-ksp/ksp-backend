import type { FastifyReply, FastifyRequest } from "fastify";
import type { ShowTellerSchema, UpdateTellerSchema } from "@/schemas/teller.schema";
import * as tellerService from "@/services/teller.service";
import { insertTellerSchema, updateTellerSchema } from "@/db/schemas";
import { fromError } from "zod-validation-error";

export async function index(request: FastifyRequest, reply: FastifyReply) {
  reply.send({
    message: "Tellers successfully fetched",
    data: await tellerService.getAllTellers({
      where: { branchId: request.user.branchId },
    }),
  });
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const validated = insertTellerSchema.safeParse(request.body);
  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  const { data } = validated;
  data.branchId = request.user.branchId;

  try {
    const teller = await tellerService.createTeller(data);
    reply.send({
      message: "Teller successfully created",
      data: teller,
    });
  } catch (error) {
    reply.status(500).send({
      message: error instanceof Error ? error.message : "Failed to create teller",
    });
  }
}

export async function show(request: FastifyRequest<ShowTellerSchema>, reply: FastifyReply) {
  const { id } = request.params;
  reply.send({
    message: "Teller successfully fetched",
    data: await tellerService.getTellerById(id),
  });
}

export async function update(request: FastifyRequest<UpdateTellerSchema>, reply: FastifyReply) {
  const { id } = request.params;
  const validated = updateTellerSchema.safeParse(request.body);

  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  try {
    const teller = await tellerService.updateTeller(id, validated.data);
    reply.send({
      message: "Teller successfully updated",
      data: teller,
    });
  } catch (error) {
    reply.status(500).send({
      message: error instanceof Error ? error.message : "Failed to update teller",
    });
  }
}
