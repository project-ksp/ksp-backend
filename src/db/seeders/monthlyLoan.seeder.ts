import { db } from "..";
import { monthlyLoans } from "../schemas";

export default async function seed() {
  const deposits = await db.query.deposits.findMany({
    with: {
      members: true,
    },
  });

  const monthlyLoansData: Array<typeof monthlyLoans.$inferInsert> = [];
  for (const deposit of deposits) {
    const count = Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const monthlyLoan = {
        loan: Math.floor(Math.random() * 100000) + 50000,
        branchId: deposit.members!.branchId,
        leaderId: deposit.members!.leaderId,
        depositId: deposit.id,
      };
      monthlyLoansData.push(monthlyLoan);
    }
  }

  await db.insert(monthlyLoans).values(monthlyLoansData);
}

export async function clear() {
  await db.delete(monthlyLoans);
}
