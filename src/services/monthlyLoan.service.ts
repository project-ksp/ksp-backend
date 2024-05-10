import { db } from "@/db";
import { monthlyLoans } from "@/db/schemas";

export async function createLoan(data: typeof monthlyLoans.$inferInsert) {
  return db.insert(monthlyLoans).values(data).returning();
}
