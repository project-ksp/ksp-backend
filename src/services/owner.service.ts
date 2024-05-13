import { db } from "@/db";
import { branches, members } from "@/db/schemas";
import { count, eq } from "drizzle-orm";

export async function getSystemOverview() {
  const branchCount = await db
    .select({
      count: count(branches.id),
    })
    .from(branches);

  const activeMemberCount = await db
    .select({
      count: count(members.id),
    })
    .from(members)
    .where(eq(members.isActive, true));

  const inactiveMemberCount = await db
    .select({
      count: count(members.id),
    })
    .from(members)
    .where(eq(members.isActive, false));

  return {
    branchCount: branchCount[0]!.count,
    activeMemberCount: activeMemberCount[0]!.count,
    inactiveMemberCount: inactiveMemberCount[0]!.count,
  };
}
