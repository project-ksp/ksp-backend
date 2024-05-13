import { UpdateStatusLoanSchema, VerifyLoanSchema } from "@/schemas/loan.schema";
import type { FastifyReply, FastifyRequest } from "fastify";
import * as loanService from "@/services/loan.service";

export async function indexPending(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await loanService.getAllLoans({ where: { verified: false } });
    reply.send({
      message: "Loans successfully fetched.",
      data,
    });
  } catch (error) {
    reply.status(400).send({
      message: error instanceof Error ? error.message : "An error occurred.",
    });
  }
}

export async function updateStatus(request: FastifyRequest<UpdateStatusLoanSchema>, reply: FastifyReply) {
  const { id } = request.params;
  const { status } = request.body;

  try {
    const data = await loanService.updateLoan(id, { status });
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
