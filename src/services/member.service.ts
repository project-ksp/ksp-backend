import { db } from "@/db";
import { members, type insertMemberSchema, type updateMemberSchema } from "@/db/schemas";
import { count, eq } from "drizzle-orm";
import { PAGE_SIZE } from ".";
import type { z } from "zod";

export async function getAllMembers({
  where = {},
  query = {},
  limit,
  offset,
}: {
  where?: Partial<typeof members.$inferSelect>;
  query?: Partial<typeof members.$inferSelect>;
  limit?: number;
  offset?: number;
}) {
  const data = await db.query.members.findMany({
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
    offset,
    with: {
      leader: {
        columns: {
          id: true,
          name: true,
        },
      },
      deposits: {
        columns: {
          principalDeposit: true,
          voluntaryDeposit: true,
        },
        with: {
          monthlyDeposits: {
            columns: {
              deposit: true,
            },
          },
          monthlyLoans: {
            columns: {
              loan: true,
            },
          },
        },
        orderBy: (deposits, { desc }) => desc(deposits.createdAt),
        limit: 1,
      },
    },
  });

  data.forEach((member) => {
    if (member.deposits[0]) {
      Object.assign(member, {
        totalDeposit:
          member.deposits[0].principalDeposit +
          member.deposits[0].voluntaryDeposit +
          member.deposits[0].monthlyDeposits.reduce((acc, curr) => acc + curr.deposit, 0),
        totalLoan: member.deposits[0].monthlyLoans.reduce((acc, curr) => acc + curr.loan, 0),
        deposits: undefined,
      });
    }
  });

  return data;
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

  return {
    page,
    totalPages,
    members: await getAllMembers({
      where,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
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
      deposits: {
        columns: {
          principalDeposit: true,
          voluntaryDeposit: true,
        },
        with: {
          monthlyDeposits: {
            columns: {
              deposit: true,
            },
          },
          monthlyLoans: true,
        },
        orderBy: (deposits, { desc }) => desc(deposits.createdAt),
        limit: 1,
      },
    },
  });
}

export async function createMember(data: z.infer<typeof insertMemberSchema>) {
  const id = await generateId(data);
  const [member] = await db
    .insert(members)
    .values({ id, ...data })
    .returning();

  if (!member) {
    throw new Error("Failed to create member");
  }

  return member;
}

export async function updateMember(id: string, data: Partial<z.infer<typeof updateMemberSchema>>) {
  data.updatedAt = new Date();
  const [member] = await db.update(members).set(data).where(eq(members.id, id)).returning();
  if (!member) {
    throw new Error("Member not found");
  }

  return member;
}

async function generateId(data: z.infer<typeof insertMemberSchema>) {
  const { branchId, leaderId } = data;

  const { value } = (
    await db
      .select({
        value: count(members.id),
      })
      .from(members)
      .where(eq(members.branchId, branchId!))
  )[0]!;

  const regionId = data.nik.startsWith("35") ? "01" : "02";

  return `${regionId}.${branchId}.${leaderId}.${(value + 1).toString().padStart(5, "0")}`;
}
