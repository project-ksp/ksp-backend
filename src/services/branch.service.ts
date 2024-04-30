import { db } from "@/db";
import { branches } from "@/db/schemas";

export async function getAllBranches() {
  return db.query.branches.findMany({
    with: {
      branchHeads: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function createBranch(data: typeof branches.$inferInsert) {
  const [branch] = await db.insert(branches).values(data).returning();
  if (!branch) {
    throw new Error("Branch could not be created");
  }

  return branch;
}
