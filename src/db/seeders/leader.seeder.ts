import { leaders } from "../schemas";
import { db } from "..";
import leaderFactory from "../factories/leader.factory";

export default async function seed() {
  const leaderData = await Promise.all(Array.from({ length: 100 }, leaderFactory));
  const branches = await db.query.branches.findMany();

  const batch = Math.floor(leaderData.length / branches.length);

  for (let i = 0; i < branches.length; i++) {
    for (let j = 0; j < batch; j++) {
      const leader = leaderData[i * batch + j]!;
      const branchId = branches[i]!.id.toString().padStart(2, "0");
      Object.assign(leader, { id: `${branchId}.${(i * batch + j).toString().padStart(2, "0")}`, branchId });
    }
  }

  await db.insert(leaders).values(leaderData);
}

export async function clear() {
  await db.delete(leaders);
}
