import { db } from "@/db";
import { deposits, type insertDepositSchema } from "@/db/schemas/deposits.schema";
import { eq } from "drizzle-orm";
import type { z } from "zod";

export async function createDeposit(data: z.infer<typeof insertDepositSchema>) {
  const [deposit] = await db.insert(deposits).values(data).returning();
  if (!deposit) {
    throw new Error("Failed to create deposit");
  }

  return deposit;
}

export async function updateDeposit(id: number, data: Partial<typeof deposits.$inferInsert>) {
  const [deposit] = await db
    .update(deposits)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(deposits.id, id))
    .returning();
  if (!deposit) {
    throw new Error("Deposit not found");
  }

  return deposit;
}
