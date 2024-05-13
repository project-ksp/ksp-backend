import type { FastifyReply, FastifyRequest } from "fastify";
import type { ShowLeaderSchema, UpdateLeaderSchema } from "@/schemas/leader.schema";
import * as leaderService from "@/services/leader.service";
import { insertLeaderSchema, updateLeaderSchema } from "@/db/schemas";
import { fromError } from "zod-validation-error";

export async function index(request: FastifyRequest, reply: FastifyReply) {
  const data = await leaderService.getAllLeaders({
    where: { branchId: request.user.branchId },
  });

  reply.send({
    message: "Leaders successfully fetched",
    data,
  });
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const validated = insertLeaderSchema.safeParse(request.body);
  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  const { data } = validated;
  data.branchId = request.user.branchId;

  try {
    const leader = await leaderService.createLeader(data);
    reply.send({
      message: "Leader successfully created",
      data: leader,
    });
  } catch (error) {
    reply.status(500).send({
      message: error instanceof Error ? error.message : "Failed to create leader",
    });
  }
}

export async function show(request: FastifyRequest<ShowLeaderSchema>, reply: FastifyReply) {
  const { id } = request.params;
  const leader = await leaderService.getLeaderById(id, request.user.branchId);

  if (!leader) {
    return reply.status(404).send({
      message: "Leader not found",
    });
  }

  reply.send({
    message: "Leader successfully fetched",
    data: leader,
  });
}

export async function update(request: FastifyRequest<UpdateLeaderSchema>, reply: FastifyReply) {
  const { id } = request.params;
  const validated = updateLeaderSchema.safeParse(request.body);

  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  try {
    const leader = await leaderService.updateLeader(id, validated.data);
    reply.send({
      message: "Leader successfully updated",
      data: leader,
    });
  } catch (error) {
    reply.status(500).send({
      message: error instanceof Error ? error.message : "Failed to update leader",
    });
  }
}
