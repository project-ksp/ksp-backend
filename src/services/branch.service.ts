import { db } from "@/db";
import { branchHeads, branches, leaders, members, users, loans, deposits } from "@/db/schemas";
import { getTableColumns, eq, sql, count, asc } from "drizzle-orm";

export async function getAllBranches() {
  try {
    const totalLoanSum = await db
      .select({
        branchId: loans.branchId,
        totalLoanSum: sql<number>`SUM(${loans.loan}) as totalLoanSum`,
      })
      .from(loans)
      .groupBy(loans.branchId);
    const branchHeadData = await db
      .select({
        ...getTableColumns(branches),
        headName: branchHeads.name,
      })
      .from(branches)
      .leftJoin(branchHeads, eq(branches.id, branchHeads.branchId))
      .orderBy(asc(branches.id));
    const data = await db
      .select({
        branchId: members.branchId,
        totalPrincipalDeposit: sql<number>`SUM(${deposits.principalDeposit}) as totalPrincipalDeposit`,
        totalMandatoryDeposit: sql<number>`SUM(${deposits.mandatoryDeposit}) as totalMandatoryDeposit`,
        totalVoluntaryDeposit: sql<number>`SUM(${deposits.voluntaryDeposit}) as totalVoluntaryDeposit`,
        activeCount: sql<number>`SUM(CASE WHEN ${members.isActive} = true THEN 1 ELSE 0 END)`.as("activeCount"),
        inactiveCount: sql<number>`SUM(CASE WHEN ${members.isActive} = false THEN 1 ELSE 0 END)`.as("inactiveCount"),
      })
      .from(members)
      .leftJoin(deposits, eq(members.id, deposits.memberId))
      .groupBy(members.branchId);
    
    const sq = data.map((item) => {
      const totalLoan = totalLoanSum.find((loan) => loan.branchId === item.branchId);
      const branchHead = branchHeadData.find((head) => head.id === item.branchId);
      const totalSavingSum =
        Number(item.totalPrincipalDeposit) + Number(item.totalMandatoryDeposit) + Number(item.totalVoluntaryDeposit);
      return {
        id: item.branchId,
        ...branchHead,
        activeCount: item.activeCount,
        inactiveCount: item.inactiveCount,
        totalLoanSum: totalLoan?.totalLoanSum ?? 0,
        totalSavingSum,
      };
    });

    return sq.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error(error);
    return [];
  }
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
