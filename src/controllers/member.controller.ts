import type { FastifyReply, FastifyRequest } from "fastify";
import * as branchService from "@/services/branch.service";
import * as memberService from "@/services/member.service";
import type {
  IndexMemberSchema,
  SearchMemberSchema,
  UpdateStatusMemberSchema,
  VerifyMemberSchema,
} from "@/schemas/member.schema";

export async function index(request: FastifyRequest<IndexMemberSchema>, reply: FastifyReply) {
  const { page } = request.query;

  try {
    const data = await memberService.getAllMembersWithPagination(page);
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

export async function indexRecap(request: FastifyRequest, reply: FastifyReply) {
  const branch = await branchService.getBranchById(request.user.branchId);
  if (!branch) {
    return reply.status(400).send({
      message: "Branch not found.",
    });
  }

  const data = await memberService.getAllMembers({
    where: { branchId: request.user.branchId, isActive: true },
    limit: branch.publishAmount,
  });

  reply.send({
    message: "Members successfully fetched.",
    data,
  });
}

export async function indexPending(request: FastifyRequest, reply: FastifyReply) {
  const data = await memberService.getAllMembers({
    where: { branchId: request.user.branchId, verified: false },
  });
  return reply.send({
    message: "Members successfully fetched.",
    data,
  });
}

export async function search(request: FastifyRequest<SearchMemberSchema>, reply: FastifyReply) {
  const { query } = request.query;

  try {
    const data = await memberService.getAllMembers({
      where: { branchId: request.user.branchId },
      query: { id: query, name: query },
    });
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

export async function updateStatus(request: FastifyRequest<UpdateStatusMemberSchema>, reply: FastifyReply) {
  const { id } = request.params;
  const { status } = request.body;

  try {
    const data = await memberService.updateMember(id, { status });
    reply.send({
      message: "Member status successfully updated.",
      data,
    });
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}

export async function verify(request: FastifyRequest<VerifyMemberSchema>, reply: FastifyReply) {
  const { id } = request.params;

  const member = await memberService.getMemberById(id);
  if (!member || member.status !== "disetujui") {
    return reply.status(400).send({
      message: "Member not found or not approved.",
    });
  }

  try {
    const data = await memberService.updateMember(id, { verified: true });
    reply.send({
      message: "Member successfully verified.",
      data,
    });
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}
