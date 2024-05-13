import { db } from "@/db";
import { deposits, type insertDepositSchema } from "@/db/schemas/deposits.schema";
import type { z } from "zod";

export async function createDeposit(data: z.infer<typeof insertDepositSchema>) {
  const [deposit] = await db.insert(deposits).values(data).returning();
  if (!deposit) {
    throw new Error("Failed to create deposit");
  }

  return deposit;
}
