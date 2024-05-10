import { db } from "..";
import { monthlyDeposits } from "../schemas/monthlyDeposits.schema";

export default async function seed() {}

export async function clear() {
  await db.delete(monthlyDeposits);
}
