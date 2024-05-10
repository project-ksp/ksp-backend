import { db } from "..";
import { monthlyDeposits } from "../schemas/monthlyDeposits.schema";

export default async function seed() {
  const deposits = await db.query.deposits.findMany();

  const monthlyDepositsData: Array<typeof monthlyDeposits.$inferInsert> = [];
  for (const deposit of deposits) {
    const count = Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const monthlyDeposit = {
        depositId: deposit.id,
        month: i,
        deposit: Math.floor(Math.random() * 100000) + 50000,
      };
      monthlyDepositsData.push(monthlyDeposit);
    }
  }

  await db.insert(monthlyDeposits).values(monthlyDepositsData);
}

export async function clear() {
  await db.delete(monthlyDeposits);
}
