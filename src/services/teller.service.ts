import { db } from "@/db";
import { tellers } from "@/db/schemas";
import { eq, sql } from "drizzle-orm";

export async function getAllTellers({ where = {} }: { where?: Partial<typeof tellers.$inferSelect> }) {
  return db.query.tellers.findMany({
    columns: {
      id: true,
      name: true,
      nik: true,
      gender: true,
      city: true,
      phoneNumber: true,
    },
    where: (tellers, { eq, and }) =>
      and(...Object.entries(where).map(([key, value]) => eq(tellers[key as keyof typeof tellers], value))),
    extras: {
      age: sql<number>`DATE_PART('YEAR', AGE(${tellers.birthDate}))`.as("age"),
    },
  });
}

export async function getTellerById(id: number) {
  return db.query.tellers.findFirst({ where: eq(tellers.id, id) });
}

export async function createTeller(data: typeof tellers.$inferInsert) {
  const [teller] = await db.insert(tellers).values(data).returning();
  if (!teller) {
    throw new Error("Failed to create teller");
  }

  return teller;
}

export async function updateTeller(
  id: number,
  data: Omit<typeof tellers.$inferInsert, "profilePictureUrl" | "idPictureUrl">,
) {
  const [teller] = await db.update(tellers).set(data).where(eq(tellers.id, id)).returning();
  if (!teller) {
    throw new Error("Failed to update teller");
  }

  return teller;
}
