import { db } from "@/db";
import { members, type updateMemberSchema } from "@/db/schemas";
import { count, eq } from "drizzle-orm";
import { PAGE_SIZE } from ".";
import type { z } from "zod";

export async function getAllMembers({
  where = {},
  query = {},
  limit,
}: {
  where?: Partial<typeof members.$inferSelect>;
  query?: Partial<typeof members.$inferSelect>;
  limit?: number;
}) {
  return db.query.members.findMany({
    where: (members, { eq, ilike, and, or }) =>
      and(
        and(...Object.entries(where).map(([key, value]) => eq(members[key as keyof typeof members], value!))),
        or(
          ...Object.entries(query).map(([key, value]) =>
            ilike(members[key as keyof typeof members], `%${value?.toString()}%`),
          ),
        ),
      ),
    limit,
    with: {
      leader: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function getAllMembersWithPagination(
  page = 1,
  { where = {} }: { where?: Partial<typeof members.$inferSelect> } = {},
) {
  const pageCount = (await db.select({ count: count() }).from(members))[0]!;
  const totalPages = Math.ceil(pageCount.count / PAGE_SIZE);

  if (page < 1 || page > totalPages) {
    throw new Error("Invalid page number.");
  }

  const data = await db.query.members.findMany({
    where: (members, { eq, and }) =>
      and(...Object.entries(where).map(([key, value]) => eq(members[key as keyof typeof members], value!))),
    limit: 10,
    offset: (page - 1) * 10,
    with: {
      leader: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    page,
    totalPages,
    members: data,
  };
}

export async function getMemberById(id: string) {
  return db.query.members.findFirst({
    where: (members, { eq }) => eq(members.id, id),
    with: {
      leader: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function updateMember(id: string, data: Partial<z.infer<typeof updateMemberSchema>>) {
  data.updatedAt = new Date();
  const [member] = await db.update(members).set(data).where(eq(members.id, id)).returning();
  if (!member) {
    throw new Error("Member not found");
  }

  return member;
}
