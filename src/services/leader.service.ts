import { db } from "@/db";
import { leaders, updateLeaderSchema } from "@/db/schemas";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

export async function getAllLeaders({ where = {} }: { where?: Partial<typeof leaders.$inferSelect> }) {
  return db.query.leaders.findMany({
    columns: {
      id: true,
      name: true,
      nik: true,
      gender: true,
      city: true,
      phoneNumber: true,
    },
    where: (leaders, { eq, and }) =>
      and(...Object.entries(where).map(([key, value]) => eq(leaders[key as keyof typeof leaders], value))),
    extras: {
      age: sql<number>`DATE_PART('YEAR', AGE(${leaders.birthDate}))`.as("age"),
    },
  });
}

export async function getLeaderById(id: number, branchId: number) {
  return db.query.leaders.findFirst({
    where: and(eq(leaders.id, id), eq(leaders.branchId, branchId)),
    extras: {
      age: sql<number>`DATE_PART('YEAR', AGE(${leaders.birthDate}))`.as("age"),
    },
  });
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
