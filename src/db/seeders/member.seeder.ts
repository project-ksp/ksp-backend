import { db } from "..";
import memberFactory from "../factories/member.factory";
import { members } from "../schemas/members.schema";

export default async function seed() {
  const memberData = await Promise.all(Array.from({ length: 1000 }, memberFactory));
  const branches = await db.query.branches.findMany();
  for (let i = 0; i < branches.length; i++) {
    for (let j = 0; j < 100; j++) {
      memberData[i * 100 + j]!.branchId = branches[i]!.id;
    }
  }

  await db.insert(members).values(memberData);
}

export async function clear() {
  await db.delete(members);
}
