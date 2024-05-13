import { VerifyLoanSchema } from "@/schemas/loan.schema";
import type { FastifyReply, FastifyRequest } from "fastify";
import * as loanService from "@/services/loan.service";

export async function verify(request: FastifyRequest<VerifyLoanSchema>, reply: FastifyReply) {
  try {
    const data = await loanService.verifyLoan(request.params.id);
    reply.send({
      message: "Loan successfully verified.",
      data,
    });
  } catch (error) {
    reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}
