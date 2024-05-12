import { db } from "..";
import { loans } from "../schemas/loans.schema";

export default async function seed() {}

export async function clear() {
  await db.delete(loans);
}
