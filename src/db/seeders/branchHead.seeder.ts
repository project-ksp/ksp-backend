import { branchHeads } from "../schemas";
import { db } from "..";
import branchHeadFactory from "../factories/branchHead.factory";

export default async function seed() {
  const branchHeadData = await Promise.all([...Array(10)].map(async (_) => await branchHeadFactory()));
  await db.insert(branchHeads).values(branchHeadData);
}

export async function clear() {
  await db.delete(branchHeads);
}
