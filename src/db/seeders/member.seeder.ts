import { db } from "..";
import memberFactory from "../factories/member.factory";
import { members } from "../schemas/members.schema";

export default async function seed() {
  const memberData = await Promise.all(Array.from({ length: 10 }, memberFactory));
  await db.insert(members).values(memberData);
}

export async function clear() {
  await db.delete(members);
}
