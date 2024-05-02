import { insertBranchHeadSchema, insertBranchSchema } from "@/db/schemas";
import * as branchHeadService from "@/services/branchHead.service";
import * as branchService from "@/services/branch.service";
import * as uploadService from "@/services/upload.service";
import { z } from "zod";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { UpdatePublishSchema } from "@/schemas/branch.schema";
import { fromError } from "zod-validation-error";

export async function index(_request: FastifyRequest, reply: FastifyReply) {
  const branches = await branchService.getAllBranches();
  reply.send({
    message: "Branches successfully fetched.",
    data: branches,
  });
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const validator = z.object({
    branch: insertBranchSchema,
    branchHead: insertBranchHeadSchema,
  });
  const validated = validator.safeParse(request.body);
  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  const { branch: branchData, branchHead: branchHeadData } = validated.data;

  if (!uploadService.isTemporaryFileExists(branchHeadData.profilePictureUrl)) {
    return reply.status(400).send({
      message: "Profile picture does not exist",
    });
  }

  if (!uploadService.isTemporaryFileExists(branchHeadData.idPictureUrl)) {
    return reply.status(400).send({
      message: "ID picture does not exist",
    });
  }

  try {
    const branch = await branchService.createBranch(branchData);

    branchHeadData.branchId = branch.id;
    const branchHead = await branchHeadService.createBranchHead(branchHeadData);

    reply.send({
      message: "Branch created successfully",
      data: { branch, branchHead },
    });
  } catch (error) {
    reply.status(500).send({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function updatePublish(request: FastifyRequest<UpdatePublishSchema>, reply: FastifyReply) {
  const { id } = request.query;
  const { publishAmount } = request.body;

  try {
    const branch = await branchService.updateBranch({ id, publishAmount });
    reply.send({
      message: "Branch updated successfully",
      data: branch,
    });
  } catch (error) {
    reply.status(500).send({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
