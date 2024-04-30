import { insertBranchHeadSchema, insertBranchSchema } from "@/db/schemas";
import * as branchHeadService from "@/services/branchHead.service";
import * as branchService from "@/services/branch.service";
import * as uploadService from "@/services/upload.service";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { branchHeads, branches } from "@/db/schemas";
import { ZodError, z } from "zod";

export async function index(_request: FastifyRequest, reply: FastifyReply) {
  const branches = await branchService.getAllBranches();
  reply.send({
    message: "Branches successfully fetched.",
    data: branches,
  });
}

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const data = request.body as {
    branch: any;
    branchHead: any;
  };

  let branchData: typeof branches.$inferInsert;
  let branchHeadData: typeof branchHeads.$inferInsert;

  try {
    branchData = insertBranchSchema.parse(data.branch) as typeof branchData;
    branchHeadData = insertBranchHeadSchema.parse(data.branchHead) as typeof branchHeadData;
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof ZodError ? error.issues : "Invalid data",
    });
  }

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

export async function updatePublishAmount(request: FastifyRequest, reply: FastifyReply) {
  const validator = z.object({
    id: z.number(),
    publishAmount: z.number(),
  });
  const validated = validator.safeParse(request.body);
  if (!validated.success) {
    return reply.status(400).send({
      message: "Invalid data",
    });
  }

  const { id, publishAmount } = validated.data;
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
