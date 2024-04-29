import { db } from "..";
import membersFactory from "../factories/members.factory";
import { members } from "../schemas/members.schema";

export default async function seed() {
  for (let i = 0; i < 10; i++) {
    const member = await membersFactory();
    await db.insert(members).values(member);
  }
}

export async function clear() {
  await db.delete(members);
}
