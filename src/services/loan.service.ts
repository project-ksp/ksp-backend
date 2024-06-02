import { db } from "@/db";
import { loans } from "@/db/schemas";
import { and, eq } from "drizzle-orm";

export async function getAllLoans({ where = {} }: { where?: Partial<typeof loans.$inferSelect> }) {
  return db.query.loans.findMany({
    columns: {
      id: true,
      loan: true,
    },
    where: and(...Object.entries(where).map(([key, value]) => eq(loans[key as keyof typeof where], value!))),
    with: {
      deposit: {
        columns: {},
        with: {
          member: {
            columns: {
              id: true,
              name: true,
              nik: true,
              gender: true,
              isActive: true,
            },
          },
        },
      },
    },
  });
}

export async function updateLoan(id: number, data: Partial<typeof loans.$inferInsert> | undefined) {
  const [loan] = await db
    .update(loans)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(loans.id, id))
    .returning();
  if (!loan) {
    throw new Error("Loan not found");
  }

  return loan;
}
