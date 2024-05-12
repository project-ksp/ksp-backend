import type { FastifyReply, FastifyRequest } from "fastify";
import * as branchService from "@/services/branch.service";
import * as memberService from "@/services/member.service";
import type {
  CalculateDepositExistingMemberSchema,
  CalculateDepositMemberSchema,
  CreateLoanMemberSchema,
  IndexMemberSchema,
  SearchMemberSchema,
  ShowMemberSchema,
  UpdateMemberSchema,
  UpdateStatusMemberSchema,
  VerifyMemberSchema,
} from "@/schemas/member.schema";
import { insertMemberSchema, updateMemberSchema } from "@/db/schemas";
import { fromError } from "zod-validation-error";
import { insertLoanSchema } from "@/db/schemas/loans.schema";

export async function index(request: FastifyRequest<IndexMemberSchema>, reply: FastifyReply) {
  const { page } = request.query;

  try {
    const data = await memberService.getAllMembersWithPagination(page, { where: { verified: true } });
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
    where: { branchId: request.user.branchId, isActive: true, verified: true },
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
      where: { branchId: request.user.branchId, verified: true },
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

export async function show(request: FastifyRequest<ShowMemberSchema>, reply: FastifyReply) {
  const { id } = request.params;
  const data = await memberService.getMemberById(id);

  if (!data) {
    return reply.status(404).send({
      message: "Member not found.",
    });
  }

  if (request.user.role !== "owner" && data.branchId !== request.user.branchId) {
    return reply.status(403).send({
      message: "Forbidden.",
    });
  }

  reply.send({
    message: "Member successfully fetched.",
    data,
  });
}

export async function createWithLoan(request: FastifyRequest<CreateLoanMemberSchema>, reply: FastifyReply) {
  const { member, loan } = request.body;

  const validatedMember = insertMemberSchema.safeParse(member);
  if (!validatedMember.success) {
    return reply.status(400).send({
      message: fromError(validatedMember.error).toString(),
    });
  }

  const validatedLoan = insertLoanSchema.safeParse(loan);
  if (!validatedLoan.success) {
    return reply.status(400).send({
      message: fromError(validatedLoan.error).toString(),
    });
  }

  try {
    const memberRet = await memberService.createMemberWithLoan({
      member: { ...validatedMember.data, userId: request.user.id },
      loan: validatedLoan.data,
    });
    reply.send({
      message: "Member successfully created.",
      data: memberRet,
    });
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}

export async function update(request: FastifyRequest<UpdateMemberSchema>, reply: FastifyReply) {
  const { id } = request.params;
  const validated = updateMemberSchema.safeParse(request.body);

  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  try {
    const member = await memberService.updateMember(id, validated.data);
    reply.send({
      message: "Member successfully updated.",
      data: member,
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

export async function calculateDeposit(request: FastifyRequest<CalculateDepositMemberSchema>, reply: FastifyReply) {
  const { loan } = request.body;

  try {
    const data = await memberService.calculateNewMemberDeposit(loan);
    reply.send({
      message: "Deposit successfully calculated.",
      data,
    });
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}

export async function calculateDepositExisting(
  request: FastifyRequest<CalculateDepositExistingMemberSchema>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { loan } = request.body;

  try {
    const data = await memberService.calculateExistingMemberDeposit(id, loan);
    reply.send({
      message: "Deposit successfully calculated.",
      data,
    });
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}
