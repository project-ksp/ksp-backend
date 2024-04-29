import { branches } from "../schemas";
import { db } from "..";
import branchFactory from "../factories/branch.factory";

export default async function seed() {
  const branchData = await Promise.all([...Array(10)].map(async (_) => await branchFactory()));
  await db.insert(branches).values(branchData);
}

export async function clear() {
  await db.delete(branches);
}
