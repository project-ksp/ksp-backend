import type {
  CreateDeleteRequestSchema,
  RemoveDeleteRequestSchema,
  UpdateStatusDeleteRequestSchema,
} from "@/schemas/deleteRequest.schema";
import type { FastifyReply, FastifyRequest } from "fastify";
import * as deleteRequestService from "@/services/deleteRequest.service";
import * as uploadService from "@/services/upload.service";

export async function index(_request: FastifyRequest, reply: FastifyReply) {
  reply.send({
    message: "Delete request list retrieved successfully.",
    data: await deleteRequestService.getAllRequests(),
  });
}

export async function create(request: FastifyRequest<CreateDeleteRequestSchema>, reply: FastifyReply) {
  if (!uploadService.isTemporaryFileExists(request.body.proofUrl)) {
    reply.status(400).send({
      message: "Proof URL is invalid.",
    });
    return;
  }

  try {
    const data = await deleteRequestService.createRequest(request.body);
    reply.send({
      message: "Delete request created successfully.",
      data,
    });
  } catch (error) {
    reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}

export async function updateStatus(request: FastifyRequest<UpdateStatusDeleteRequestSchema>, reply: FastifyReply) {
  try {
    const data = await deleteRequestService.updateStatus(request.params.id, request.body.status);
    reply.send({
      message: "Delete request status updated successfully.",
      data,
    });
  } catch (error) {
    reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}

export async function remove(request: FastifyRequest<RemoveDeleteRequestSchema>, reply: FastifyReply) {
  try {
    await deleteRequestService.deleteMember(request.params.id);
    reply.send({
      message: "Member removed successfully.",
    });
  } catch (error) {
    reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}
