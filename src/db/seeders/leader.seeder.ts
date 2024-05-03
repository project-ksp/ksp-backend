import { leaders } from "../schemas";
import { db } from "..";
import leaderFactory from "../factories/leader.factory";

export default async function seed() {
  const leaderData = await Promise.all(Array.from({ length: 100 }, leaderFactory));
  const branches = await db.query.branches.findMany();

  const batch = Math.floor(leaderData.length / branches.length);

  for (let i = 0; i < branches.length; i++) {
    for (let j = 0; j < batch; j++) {
      Object.assign(leaderData[i * batch + j]!, { branchId: branches[i]!.id });
    }
  }

  await db.insert(leaders).values(leaderData);
}

export async function clear() {
  await db.delete(leaders);
}
