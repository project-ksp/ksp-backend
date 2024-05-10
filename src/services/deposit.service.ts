import { db } from "@/db";
import { deposits, insertDepositSchema } from "@/db/schemas/deposits.schema";
import { insertMonthlyDepositSchema, monthlyDeposits } from "@/db/schemas/monthlyDeposits.schema";
import { z } from "zod";

export async function createDeposit(data: z.infer<typeof insertDepositSchema>) {
  const [deposit] = await db.insert(deposits).values(data).returning();
  if (!deposit) {
    throw new Error("Failed to create deposit");
  }

  return deposit;
}

export async function createMonthlyDeposit(data: z.infer<typeof insertMonthlyDepositSchema>) {
  const [monthlyDeposit] = await db.insert(monthlyDeposits).values(data).returning();
  if (!monthlyDeposit) {
    throw new Error("Failed to create monthly deposit");
  }

  return monthlyDeposit;
}
