import { db } from "..";
import memberFactory from "../factories/member.factory";
import { members } from "../schemas/members.schema";

export default async function seed() {
  const memberData = await Promise.all(Array.from({ length: 1000 }, memberFactory));
  const branches = await db.query.branches.findMany();
  const leaders = await db.query.leaders.findMany();
  const users = await db.query.users.findMany();

  const branchesPerBatch = Math.floor(memberData.length / branches.length);
  for (let i = 0; i < branches.length; i++) {
    for (let j = 0; j < branchesPerBatch; j++) {
      const member = memberData[i * branchesPerBatch + j]!;
      const branch = branches[i]!;
      Object.assign(member, { id: member.id.replace("**", branch.id.toString()), branchId: branch.id });
    }
  }

  const leadersPerBatch = Math.floor(memberData.length / leaders.length);
  for (let i = 0; i < leaders.length; i++) {
    for (let j = 0; j < leadersPerBatch; j++) {
      const member = memberData[i * leadersPerBatch + j]!;
      const leader = leaders[i]!;
      Object.assign(member, { id: member.id.replace("##", leader.id.split(".")[1]!), leaderId: leader.id });
    }
  }

  const usersPerBatch = Math.ceil(memberData.length / users.length);
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < usersPerBatch && i * usersPerBatch + j < memberData.length; j++) {
      Object.assign(memberData[i * usersPerBatch + j]!, { userId: users[i]!.id });
    }
  }

  await db.insert(members).values(memberData);
}

export async function clear() {
  await db.delete(members);
}
