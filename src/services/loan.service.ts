import { db } from "@/db";
import { deposits, loans } from "@/db/schemas";
import { eq } from "drizzle-orm";
import * as memberService from "./member.service";

export async function verifyLoan(id: number) {
  const loan = await db.query.loans.findFirst({
    where: eq(loans.id, id),
    with: {
      deposit: true,
    },
  });
  if (!loan) {
    throw new Error("Loan not found.");
  }
  if (loan.verified) {
    throw new Error("Loan already verified.");
  }

  const loanTx = await db.transaction(async (tx) => {
    await tx
      .update(deposits)
      .set(await memberService.calculateExistingMemberDeposit(loan.deposit.memberId, loan.loan))
      .where(eq(deposits.id, loan.depositId));
    await tx.update(loans).set({ verified: true }).where(eq(loans.id, id));

    return await db.query.loans.findFirst({
      where: eq(loans.id, id),
      with: {
        deposit: true,
      },
    });
  });
  if (!loanTx) {
    throw new Error("Loan not found.");
  }

  return loanTx;
}
