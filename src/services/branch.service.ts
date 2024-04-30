import { db } from "@/db";
import { branches } from "@/db/schemas";

export async function getAllBranches() {
  const branches = await db.query.branches.findMany();
  return branches;
}

export async function createBranch(data: typeof branches.$inferInsert) {
  const [branch] = await db.insert(branches).values(data).returning();
  if (!branch) {
    throw new Error("Branch could not be created");
  }

  return branch;
}
