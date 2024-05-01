import { db } from "@/db";

export async function getAllMembers(page = 1) {
  return db.query.members.findMany({
    limit: 10,
    offset: (page - 1) * 10,
  });
}
