import { db } from "@/db";
import { members } from "@/db/schemas";
import { count } from "drizzle-orm";
import { PAGE_SIZE } from ".";

export async function getAllMembers(
  where: Partial<typeof members.$inferSelect> = {},
  query: Partial<typeof members.$inferSelect> = {},
) {
  return db.query.members.findMany({
    where: (members, { eq, ilike, and, or }) =>
      and(
        and(...Object.entries(where).map(([key, value]) => eq(members[key as keyof typeof members], value))),
        or(...Object.entries(query).map(([key, value]) => ilike(members[key as keyof typeof members], `%${value}%`))),
      ),
  });
}

export async function getAllMembersWithPagination(page = 1) {
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
