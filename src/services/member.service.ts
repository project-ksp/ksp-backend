import { db } from "@/db";

export async function getAllMembers() {
  return db.query.members.findMany();
}
