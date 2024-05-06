import { db } from "@/db";
import { leaders, members, type updateLeaderSchema } from "@/db/schemas";
import { and, count, eq, sql } from "drizzle-orm";
import type { z } from "zod";

export async function getAllLeaders({ where = {} }: { where?: Partial<typeof leaders.$inferSelect> }) {
  return db
    .select({
      id: leaders.id,
      name: leaders.name,
      nik: leaders.nik,
      gender: leaders.gender,
      city: leaders.city,
      phoneNumber: leaders.phoneNumber,
      age: sql<number>`DATE_PART('YEAR', AGE(${leaders.birthDate}))`.as("age"),
      memberCount: count(members.id),
    })
    .from(leaders)
    .where(and(...Object.entries(where).map(([key, value]) => eq(leaders[key as keyof typeof where], value))))
    .leftJoin(members, eq(leaders.id, members.leaderId))
    .groupBy(leaders.id);
}

export async function getLeaderById(id: number, branchId: number) {
  const data = await db.query.leaders.findFirst({
    where: and(eq(leaders.id, id), eq(leaders.branchId, branchId)),
    extras: {
      age: sql<number>`DATE_PART('YEAR', AGE(${leaders.birthDate}))`.as("age"),
    },
    with: {
      members: {
        columns: {
          id: true,
        },
      },
    },
  });
  if (data) {
    Object.assign(data, { memberCount: data.members.length });
    Object.assign(data, { members: undefined });
  }

  return data;
}

export async function createLeader(data: typeof leaders.$inferInsert) {
  const [leader] = await db.insert(leaders).values(data).returning();
  if (!leader) {
    throw new Error("Failed to create Leader");
  }

  return leader;
}

export async function updateLeader(id: number, data: z.infer<typeof updateLeaderSchema>) {
  const [leader] = await db.update(leaders).set(data).where(eq(leaders.id, id)).returning();
  if (!leader) {
    throw new Error("Failed to update Leader");
  }

  return leader;
}
