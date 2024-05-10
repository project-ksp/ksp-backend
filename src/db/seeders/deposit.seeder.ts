import { db } from "..";
import { deposits } from "../schemas/deposits.schema";

export default async function seed() {}

export async function clear() {
  await db.delete(deposits);
}
