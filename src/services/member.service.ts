import { db } from "@/db";
import { members } from "@/db/schemas";
import { count } from "drizzle-orm";
import { PAGE_SIZE } from ".";

export async function getAllMembers(page = 1) {
  const pageCount = (await db.select({ count: count() }).from(members))[0]!;
  const totalPages = Math.ceil(pageCount.count / PAGE_SIZE);

  if (page < 1 || page > totalPages) {
    throw new Error("Invalid page number.");
  }

  const data = await db.query.members.findMany({
    limit: 10,
    offset: (page - 1) * 10,
  });

  return {
    page,
    totalPages,
    members: data,
  };
}
