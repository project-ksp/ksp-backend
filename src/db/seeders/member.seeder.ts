import { db } from "..";
import memberFactory from "../factories/member.factory";
import { members } from "../schemas/members.schema";

export default async function seed() {
  const memberData = await Promise.all(Array.from({ length: 1000 }, memberFactory));
  const branches = await db.query.branches.findMany();
  const leaders = await db.query.leaders.findMany();

  const branchesPerBatch = Math.floor(memberData.length / branches.length);
  for (let i = 0; i < branches.length; i++) {
    for (let j = 0; j < branchesPerBatch; j++) {
      memberData[i * branchesPerBatch + j]!.branchId = branches[i]!.id;
    }
  }

  const leadersPerBatch = Math.floor(memberData.length / leaders.length);
  for (let i = 0; i < leaders.length; i++) {
    for (let j = 0; j < leadersPerBatch; j++) {
      Object.assign(memberData[i * leadersPerBatch + j]!, { leaderId: leaders[i]!.id });
    }
  }

  await db.insert(members).values(memberData);
}

export async function clear() {
  await db.delete(members);
}
