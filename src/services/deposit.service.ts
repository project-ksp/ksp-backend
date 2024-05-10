import { db } from "@/db";
import { monthlyLoans, type insertMonthlyLoanSchema } from "@/db/schemas";
import { deposits, type insertDepositSchema } from "@/db/schemas/deposits.schema";
import { monthlyDeposits, type insertMonthlyDepositSchema } from "@/db/schemas/monthlyDeposits.schema";
import type { z } from "zod";

export async function createDeposit(data: z.infer<typeof insertDepositSchema>) {
  const [deposit] = await db.insert(deposits).values(data).returning();
  if (!deposit) {
    throw new Error("Failed to create deposit");
  }

  return deposit;
}

export async function createMonthlyDeposits(data: Array<z.infer<typeof insertMonthlyDepositSchema>>) {
  const monthlyDeposit = await db.insert(monthlyDeposits).values(data).returning();
  if (!monthlyDeposit) {
    throw new Error("Failed to create monthly deposit");
  }

  return monthlyDeposit;
}

export async function createMonthlyLoans(data: Array<z.infer<typeof insertMonthlyLoanSchema>>) {
  const monthlyLoan = await db.insert(monthlyLoans).values(data).returning();
  if (!monthlyLoan) {
    throw new Error("Failed to create monthly loan");
  }

  return monthlyLoan;
}
