import { branchHeads } from "../schemas";
import { db } from "..";
import branchHeadFactory from "../factories/branchHead.factory";

export default async function seed() {
  const branchHeadData = await Promise.all(Array.from({ length: 10 }, branchHeadFactory));
  const branches = await db.query.branches.findMany();
  for (let i = 0; i < branches.length; i++) {
    Object.assign(branchHeadData[i]!, { branchId: branches[i]!.id });
  }

  await db.insert(branchHeads).values(branchHeadData);
}

export async function clear() {
  await db.delete(branchHeads);
}
