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
    const branchData = await db
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

    const sq = branchData.map((item) => {
      const totalLoan = totalLoanSum.find((loan) => loan.branchId === item.id);
      const dataItem = data.find((data) => data.branchId === item.id);
      const totalSavingSum =
        Number(dataItem?.totalPrincipalDeposit) +
        Number(dataItem?.totalMandatoryDeposit) +
        Number(dataItem?.totalVoluntaryDeposit);

      return {
        ...item,
        activeCount: dataItem?.activeCount ?? 0,
        inactiveCount: dataItem?.inactiveCount ?? 0,
        totalLoanSum: totalLoan ? Number(totalLoan.totalLoanSum) : 0,
        totalSavingSum: isNaN(totalSavingSum) ? 0 : totalSavingSum,
      };
    });
    return sq.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getBranchById(id: number) {
  const [accountCount] = await db
    .select({
      accountCount: sql<number>`SUM(CASE WHEN ${users.role} = 'owner' THEN 0 ELSE 1 END)`.as("accountCount"),
    })
    .from(users)
    .where(eq(users.branchId, id))
    .groupBy(users.branchId);

  const [branch] = await db
    .select({
      ...getTableColumns(branches),
      leaderCount: sql<number>`COUNT(DISTINCT ${leaders.id})`.as("leaderCount"),
    })
    .from(branches)
    .leftJoin(leaders, eq(branches.id, leaders.branchId))
    .where(eq(branches.id, id))
    .groupBy(branches.id);

  return {
    ...branch,
    accountCount: accountCount?.accountCount ?? 0,
  };
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
