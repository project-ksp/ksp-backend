import { insertMonthlyLoanSchema, type monthlyLoans } from "@/db/schemas";
import type { CreateMonthlyLoanSchema } from "@/schemas/monthlyLoan.schema";
import { fromError } from "zod-validation-error";
import type { FastifyReply, FastifyRequest } from "fastify";
import * as memberService from "@/services/member.service";
import * as monthlyLoanService from "@/services/monthlyLoan.service";

export async function create(request: FastifyRequest<CreateMonthlyLoanSchema>, reply: FastifyReply) {
  const validated = insertMonthlyLoanSchema.safeParse(request.body);
  if (!validated.success) {
    return reply.status(400).send({
      message: fromError(validated.error).toString(),
    });
  }

  const { id } = request.params;
  const member = await memberService.getMemberById(id);

  if (!member) {
    return reply.status(404).send({
      message: "Member not found",
    });
  }

  const data: typeof monthlyLoans.$inferInsert = { ...validated.data, depositId: member.deposits[0]!.id };
  const loan = await monthlyLoanService.createLoan(data);

  reply.send({
    message: "Loan created successfully",
    data: loan,
  });
}
