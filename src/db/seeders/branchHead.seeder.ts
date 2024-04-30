import { branchHeads } from "../schemas";
import { db } from "..";
import branchHeadFactory from "../factories/branchHead.factory";

export default async function seed() {
  const branchHeadData = await Promise.all(Array.from({ length: 10 }, branchHeadFactory));
  await db.insert(branchHeads).values(branchHeadData);
}

export async function clear() {
  await db.delete(branchHeads);
}
