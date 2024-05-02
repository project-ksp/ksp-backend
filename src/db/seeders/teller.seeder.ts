import { tellers } from "../schemas";
import { db } from "..";
import tellerFactory from "../factories/teller.factory";

export default async function seed() {
  const tellerData = await Promise.all(Array.from({ length: 100 }, tellerFactory));
  const branches = await db.query.branches.findMany();

  const batch = Math.floor(tellerData.length / branches.length);

  for (let i = 0; i < branches.length; i++) {
    for (let j = 0; j < batch; j++) {
      Object.assign(tellerData[i * batch + j]!, { branchId: branches[i]!.id });
    }
  }

  await db.insert(tellers).values(tellerData);
}

export async function clear() {
  await db.delete(tellers);
}
