import { branchHeads } from "../schemas";
import { db } from "..";
import branchHeadFactory from "../factories/branchHead.factory";

export default async function seed() {
  for (let i = 0; i < 10; i++) {
    const branchHead = await branchHeadFactory();
    await db.insert(branchHeads).values(branchHead);
  }
}
