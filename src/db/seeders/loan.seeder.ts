import { db } from "..";
import { loans } from "../schemas/loans.schema";
// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async function seed() {}

export async function clear() {
  await db.delete(loans);
}
