import type { FastifyReply, FastifyRequest } from "fastify";
import * as branchService from "@/services/branch.service";
import * as memberService from "@/services/member.service";
import * as pdfService from "@/services/pdf.service";
import * as loanService from "@/services/loan.service";
import * as depositService from "@/services/deposit.service";
import type {
  AddLoanMemberSchema,
  CalculateDepositExistingMemberSchema,
  CalculateDepositMemberSchema,
  CreateDepositMemberSchema,
  CreateLoanMemberSchema,
  MemberIdParamSchema,
  IndexMemberSchema,
  SearchMemberSchema,
  ShowMemberSchema,
  UpdateMemberSchema,
} from "@/schemas/member.schema";
import {
  addDepositSchema,
  insertMemberSchema,
  updateMemberSchema,
  updateDepositSchema,
  updateLoanSchema,
} from "@/db/schemas";
import { fromError } from "zod-validation-error";
import { addLoanSchema, insertLoanSchema } from "@/db/schemas/loans.schema";

export async function index(request: FastifyRequest<IndexMemberSchema>, reply: FastifyReply) {
  const { page } = request.query;

  try {
    let data;

    if (page) {
      data = await memberService.getAllMembersWithPagination(page);
    } else {
      // If the page parameter is not provided, fetch all members
      data = await memberService.getAllMembers({});
    }

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

export async function memberBookData(request: FastifyRequest, reply: FastifyReply) {
  const branch = await branchService.getBranchById(request.user.branchId);
  if (!branch) {
    return reply.status(400).send({
      message: "Branch not found.",
    });
  }

  const allMembers = await Promise.all([
    memberService.getAllMembersWithDeletion({
      where: { branchId: request.user.branchId, isActive: true },
      limit: branch.publishAmount,
    }),
    memberService.getAllMembersWithDeletion({
      where: { branchId: request.user.branchId, isActive: false },
    }),
  ]);
  allMembers[1] = allMembers[1].filter((member) => member.deleteRequests?.status === "disetujui");

  const data = allMembers[0].concat(allMembers[1]);

  reply.send({
    message: "Members successfully fetched.",
    data,
  });
}

export async function indexPending(request: FastifyRequest, reply: FastifyReply) {
  const data = await memberService.getAllMembers({
    where: { branchId: request.user.branchId },
  });
  return reply.send({
    message: "Members successfully fetched.",
    data,
  });
}

export async function indexInactive(request: FastifyRequest, reply: FastifyReply) {
  const data = await memberService.getAllMembers({
    where: { branchId: request.user.branchId, isActive: false },
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
      query: { name: query, id: query, nik: query },
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

  reply.send({
    message: "Member successfully fetched.",
    data,
  });
}

export async function createWithDeposit(request: FastifyRequest<CreateDepositMemberSchema>, reply: FastifyReply) {
  const { member, deposit } = request.body;

  const validatedMember = insertMemberSchema.safeParse(member);
  if (!validatedMember.success) {
    return reply.status(400).send({
      message: fromError(validatedMember.error).toString(),
    });
  }

  const validatedDeposit = addDepositSchema.safeParse(deposit);
  if (!validatedDeposit.success) {
    return reply.status(400).send({
      message: fromError(validatedDeposit.error).toString(),
    });
  }

  try {
    const memberRet = await memberService.createMemberWithDeposit({
      member: { ...validatedMember.data, branchId: request.user.branchId, userId: request.user.id },
      deposit: { ...validatedDeposit.data, principalDeposit: 50000 },
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

export async function createWithLoan(request: FastifyRequest<CreateLoanMemberSchema>, reply: FastifyReply) {
  const { member, loan, mandatoryDeposit } = request.body;

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
      member: { ...validatedMember.data, branchId: request.user.branchId, userId: request.user.id },
      loan: { ...validatedLoan.data, branchId: request.user.branchId },
      mandatoryDeposit: mandatoryDeposit ?? 0,
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
  const { member, deposit, loans } = request.body;
  const { role } = request.user;
  const validatedDataMember = updateMemberSchema.safeParse(member);
  const validatedDataDeposit = updateDepositSchema.safeParse(deposit);
  const validatedLoans = loans.map((loan) => updateLoanSchema.safeParse(loan));

  if (!validatedDataMember.success) {
    return reply.status(400).send({
      message: fromError(validatedDataMember.error).toString(),
    });
  }

  if (role !== "branch_head") {
    try {
      const member = await memberService.updateMember(id, validatedDataMember.data);
      reply.send({
        message: "Member successfully updated.",
        data: member,
      });
    } catch (error) {
      return reply.status(400).send({
        message: error instanceof Error ? error.message : "An error occurred.",
      });
    }

    return;
  }

  if (!validatedDataDeposit.success) {
    return reply.status(400).send({
      message: fromError(validatedDataDeposit.error).toString(),
    });
  }

  const failedLoan = validatedLoans.find((loan) => !loan.success);
  if (failedLoan) {
    return reply.status(400).send({
      message: fromError(failedLoan.error).toString(),
    });
  }

  const { id: depositId } = validatedDataDeposit.data;
  delete validatedDataDeposit.data.id;
  const loansId = validatedLoans.map((loan) => loan.data?.id);
  validatedLoans.forEach((loan) => delete loan.data?.id);
  if (!depositId) {
    return reply.status(400).send({
      message: "Deposit ID is required.",
    });
  }

  if (loansId.some((id) => !id)) {
    return reply.status(400).send({
      message: "Loan ID is required.",
    });
  }

  let isActive = true;

  if (validatedDataDeposit.data.principalDeposit < 50000) {
    isActive = false;
  }

  try {
    const member = await memberService.updateMember(id, { ...validatedDataMember.data, isActive });
    const depositData = await depositService.updateDeposit(depositId, validatedDataDeposit.data);
    const loansData = await Promise.all(
      loansId.map(async (id, index) => loanService.updateLoan(id ?? 0, validatedLoans[index]?.data)),
    );
    reply.send({
      message: "Member successfully updated.",
      data: { member, deposit: depositData, loans: loansData },
    });
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}

export async function addDeposit(request: FastifyRequest<AddLoanMemberSchema>, reply: FastifyReply) {
  const { id } = request.params;
  const validated = addDepositSchema.safeParse(request.body);
  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  try {
    const data = await memberService.addDepositToMember(id, validated.data);
    reply.send({
      message: "Deposit successfully added to member.",
      data,
    });
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}

export async function addLoan(request: FastifyRequest<AddLoanMemberSchema>, reply: FastifyReply) {
  const { id } = request.params;
  const { loan, mandatoryDeposit } = request.body;
  const validated = addLoanSchema.safeParse(loan);
  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  try {
    const data = await memberService.addLoanToMember(id, validated.data, mandatoryDeposit);
    reply.send({
      message: "Loan successfully added to member.",
      data,
    });
  } catch (error) {
    return reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}

export async function calculateDeposit(request: FastifyRequest<CalculateDepositMemberSchema>, reply: FastifyReply) {
  const { loan, mandatoryDeposit } = request.body;

  try {
    const data = await memberService.calculateNewMemberDeposit(loan, mandatoryDeposit);
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
  const { loan, mandatoryDeposit } = request.body;

  try {
    const data = await memberService.calculateExistingMemberDeposit(id, loan, mandatoryDeposit);
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

export async function getMemberCard(request: FastifyRequest<MemberIdParamSchema>, reply: FastifyReply) {
  const stream = await pdfService.generateMemberCard(request.params.id);
  reply.header("Content-Type", "application/pdf");
  reply.send(stream);
}

export async function getDepositForm(request: FastifyRequest<MemberIdParamSchema>, reply: FastifyReply) {
  const stream = await pdfService.generateDepositForm(request.params.id);
  reply.header("Content-Type", "application/pdf");
  reply.send(stream);
}

export async function getLoanForm(request: FastifyRequest<MemberIdParamSchema>, reply: FastifyReply) {
  const stream = await pdfService.generateLoanForm(request.params.id);
  reply.header("Content-Type", "application/pdf");
  reply.send(stream);
}

export async function getRegistrationForm(request: FastifyRequest<MemberIdParamSchema>, reply: FastifyReply) {
  const stream = await pdfService.generateRegistrationForm(request.params.id);
  reply.header("Content-Type", "application/pdf");
  reply.send(stream);
}

export async function getMemberListBook(request: FastifyRequest<MemberIdParamSchema>, reply: FastifyReply) {
  const stream = await pdfService.generateMemberListBook(request.user.branchId);
  reply.header("Content-Type", "application/pdf");
  reply.send(stream);
}
