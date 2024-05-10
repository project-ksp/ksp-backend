import type { FastifyReply, FastifyRequest } from "fastify";
import * as branchService from "@/services/branch.service";
import * as memberService from "@/services/member.service";
import * as depositService from "@/services/deposit.service";
import type {
  CreateDepositMemberSchema,
  IndexMemberSchema,
  SearchMemberSchema,
  UpdateStatusMemberSchema,
  VerifyMemberSchema,
} from "@/schemas/member.schema";
import { insertMemberSchema } from "@/db/schemas";
import { fromError } from "zod-validation-error";
import { insertDepositSchema } from "@/db/schemas/deposits.schema";
import { z } from "zod";
import { insertMonthlyDepositSchema } from "@/db/schemas/monthlyDeposits.schema";
import { db } from "@/db";

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

export async function createDeposit(request: FastifyRequest<CreateDepositMemberSchema>, reply: FastifyReply) {
  const validatedMember = insertMemberSchema.safeParse(request.body.member);
  if (!validatedMember.success) {
    return reply.status(400).send({
      message: fromError(validatedMember.error).toString(),
    });
  }

  const validatedDeposit = insertDepositSchema.safeParse(request.body.deposit);
  if (!validatedDeposit.success) {
    return reply.status(400).send({
      message: fromError(validatedDeposit.error).toString(),
    });
  }

  const validatedMonthlyDeposits = z.array(insertMonthlyDepositSchema).safeParse(request.body.monthlyDeposits);
  if (!validatedMonthlyDeposits.success) {
    return reply.status(400).send({
      message: fromError(validatedMonthlyDeposits.error).toString(),
    });
  }

  Object.assign(validatedMember.data, { branchId: request.user.branchId, userId: request.user.id });
  const member = await memberService.createMember(validatedMember.data);

  Object.assign(validatedDeposit.data, { memberId: member.id });
  const deposit = await depositService.createDeposit(validatedDeposit.data);

  await Promise.all(
    validatedMonthlyDeposits.data.map((monthlyDeposit) => {
      Object.assign(monthlyDeposit, { depositId: deposit.id });
      return depositService.createMonthlyDeposit(monthlyDeposit);
    }),
  );

  reply.send({
    message: "Deposit successfully created.",
    data: await db.query.members.findFirst({
      with: {
        deposits: {
          with: {
            monthlyDeposits: true,
          },
        },
      },
      where: (members, { eq }) => eq(members.id, member.id),
    }),
  });
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
