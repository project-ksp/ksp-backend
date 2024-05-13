import { db } from "@/db";
import { deposits, loans } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import * as memberService from "./member.service";

export async function getAllLoans({ where = {} }: { where?: Partial<typeof loans.$inferSelect> }) {
  return db.query.loans.findMany({
    columns: {
      id: true,
      loan: true,
      status: true,
    },
    where: and(...Object.entries(where).map(([key, value]) => eq(loans[key as keyof typeof where], value!))),
    with: {
      deposit: {
        columns: {},
        with: {
          member: {
            columns: {
              id: true,
              name: true,
              nik: true,
              gender: true,
            },
          },
        },
      },
    },
  });
}

export async function updateLoan(id: number, data: Partial<typeof loans.$inferInsert>) {
  const [loan] = await db
    .update(loans)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(loans.id, id))
    .returning();
  if (!loan) {
    throw new Error("Loan not found");
  }

  return loan;
}

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

  if (loan.status !== "disetujui") {
    throw new Error("Loan not approved yet.");
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

    return db.query.loans.findFirst({
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
