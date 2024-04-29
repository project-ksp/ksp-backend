import { branches } from "../schemas";
import { db } from "..";
import branchFactory from "../factories/branch.factory";

export default async function seed() {
  for (let i = 0; i < 10; i++) {
    const branch = await branchFactory();
    await db.insert(branches).values(branch);
  }
}

export async function clear() {
  await db.delete(branches);
}
