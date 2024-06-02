import { db } from "@/db";
import { branchHeads, branches, leaders, members, users } from "@/db/schemas";
import { getTableColumns, eq, sql, count, asc } from "drizzle-orm";

export async function getAllBranches() {
  const sq = db
    .select({
      branchId: members.branchId,
      totalLoanSum: sql<number>`0`.as("totalLoanSum"),
      totalSavingSum: sql<number>`0`.as("totalSavingSum"),
      activeCount: sql<number>`SUM(CASE WHEN ${members.isActive} = true THEN 1 ELSE 0 END)`.as("activeCount"),
      inactiveCount: sql<number>`SUM(CASE WHEN ${members.isActive} = false THEN 1 ELSE 0 END)`.as("inactiveCount"),
    })
    .from(members)
    .groupBy(members.branchId)
    .as("memberSq");

  return db
    .select({
      ...getTableColumns(branches),
      totalLoanSum: sq.totalLoanSum,
      totalSavingSum: sq.totalSavingSum,
      activeCount: sq.activeCount,
      inactiveCount: sq.inactiveCount,
      headName: branchHeads.name,
    })
    .from(branches)
    .leftJoin(sq, eq(branches.id, sq.branchId))
    .leftJoin(branchHeads, eq(branches.id, branchHeads.branchId))
    .orderBy(asc(branches.id));
}

export async function getBranchById(id: number) {
  const [branch] = await db
    .select({
      ...getTableColumns(branches),
      accountCount: sql<number>`SUM(CASE WHEN ${eq(users.role, "owner")} THEN 0 ELSE 1 END)`.as("accountCount"),
      leaderCount: count(leaders.id).as("leaderCount"),
    })
    .from(branches)
    .where(eq(branches.id, id))
    .leftJoin(users, eq(branches.id, users.branchId))
    .leftJoin(leaders, eq(branches.id, leaders.branchId))
    .groupBy(branches.id);

  return branch;
}

export async function createBranch(data: typeof branches.$inferInsert) {
  const [branch] = await db.insert(branches).values(data).returning();
  if (!branch) {
    throw new Error("Branch could not be created");
  }

  return branch;
}

export async function updateBranch(
  data: Partial<typeof branches.$inferSelect> & Pick<typeof branches.$inferSelect, "id">,
) {
  const { id, ...rest } = data;
  const [branch] = await db.update(branches).set(rest).where(eq(branches.id, id)).returning();
  if (!branch) {
    throw new Error("Branch could not be updated");
  }

  return branch;
}
