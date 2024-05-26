import { db } from "@/db";
import { members, deposits, type addDepositSchema } from "@/db/schemas";
import { and, count, desc, eq } from "drizzle-orm";
import { PAGE_SIZE } from ".";
import { loans } from "@/db/schemas/loans.schema";
import * as uploadService from "./upload.service";
import type { z } from "zod";

const ADMIN_PERCENTAGE = 0.05;
const MINIMUM_PRINCIPAL_DEPOSIT = 50000;
const MONTHLY_DEPOSIT = 5000;
const LOAN_PERIOD_MONTHS = 6;

export async function getAllMembers({
  where = {},
  query = {},
  limit,
  offset,
}: {
  where?: Partial<typeof members.$inferSelect>;
  query?: Partial<typeof members.$inferSelect>;
  limit?: number;
  offset?: number;
}) {
  const data = await db.query.members.findMany({
    where: (members, { eq, ilike, and, or }) =>
      and(
        and(...Object.entries(where).map(([key, value]) => eq(members[key as keyof typeof members], value!))),
        or(
          ...Object.entries(query).map(([key, value]) =>
            ilike(members[key as keyof typeof members], `%${value?.toString()}%`),
          ),
        ),
      ),
    limit,
    offset,
    with: {
      leader: {
        columns: {
          id: true,
          name: true,
        },
      },
      deposit: {
        columns: {
          principalDeposit: true,
          mandatoryDeposit: true,
          voluntaryDeposit: true,
        },
        with: {
          loans: {
            columns: {
              loan: true,
            },
          },
        },
      },
    },
  });

  data.forEach((member) =>
    Object.assign(member, {
      totalLoan: member.deposit.loans.reduce((acc, loan) => acc + loan.loan, 0),
    }),
  );

  return data;
}

export async function getAllMembersWithDeletion({
  where = {},
  query = {},
  limit,
  offset,
}: {
  where?: Partial<typeof members.$inferSelect>;
  query?: Partial<typeof members.$inferSelect>;
  limit?: number;
  offset?: number;
}) {
  return db.query.members.findMany({
    where: (members, { eq, ilike, and, or }) =>
      and(
        and(...Object.entries(where).map(([key, value]) => eq(members[key as keyof typeof members], value!))),
        or(
          ...Object.entries(query).map(([key, value]) =>
            ilike(members[key as keyof typeof members], `%${value?.toString()}%`),
          ),
        ),
      ),
    limit,
    offset,
    with: {
      deleteRequests: {
        columns: {
          reason: true,
          updatedAt: true,
        },
      },
    },
  });
}

export async function getAllMembersWithPagination(
  page = 1,
  { where = {} }: { where?: Partial<typeof members.$inferSelect> } = {},
) {
  const pageCount = (
    await db
      .select({ count: count() })
      .from(members)
      .where(and(...Object.entries(where).map(([key, value]) => eq(members[key as keyof typeof where], value!))))
  )[0]!;
  const totalPages = Math.ceil(pageCount.count / PAGE_SIZE);

  if (page < 1 || page > totalPages) {
    throw new Error("Invalid page number.");
  }

  return {
    page,
    totalPages,
    members: await getAllMembers({
      where,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    }),
  };
}

export async function getMemberById(id: string) {
  return db.query.members.findFirst({
    where: (members, { eq }) => eq(members.id, id),
    with: {
      leader: {
        columns: {
          id: true,
          name: true,
        },
      },
      deposit: {
        with: {
          loans: true,
        },
      },
    },
  });
}

export async function createMemberWithDeposit(data: {
  member: Omit<typeof members.$inferInsert, "id">;
  deposit: Omit<typeof deposits.$inferInsert, "memberId">;
}) {
  const { member, deposit } = data;

  const id = await generateId(member);
  member.idPictureUrl = uploadService.persistTemporaryFile(member.idPictureUrl);

  try {
    const memberReturned = await db.transaction(async (tx) => {
      const [memberRet] = await tx
        .insert(members)
        .values({ id, ...member })
        .returning();

      if (!memberRet) {
        tx.rollback();
        return;
      }

      const [depositRet] = await tx
        .insert(deposits)
        .values({
          memberId: memberRet.id,
          ...deposit,
        })
        .returning();

      if (!depositRet) {
        tx.rollback();
        return;
      }

      return memberRet;
    });

    if (!memberReturned) {
      throw new Error("Failed to create member.");
    }

    return await db.query.members.findFirst({
      where: eq(members.id, memberReturned.id),
      with: {
        deposit: {
          with: {
            loans: true,
          },
        },
      },
    });
  } catch (error) {
    uploadService.unpersistFile(member.idPictureUrl);
    throw error;
  }
}

export async function createMemberWithLoan(data: {
  member: Omit<typeof members.$inferInsert, "id">;
  loan: typeof loans.$inferInsert;
}) {
  const { member, loan } = data;
  const depositValues = await calculateNewMemberDeposit(loan.loan);

  const id = await generateId(member);
  member.idPictureUrl = uploadService.persistTemporaryFile(member.idPictureUrl);

  try {
    const memberReturned = await db.transaction(async (tx) => {
      const [memberRet] = await tx
        .insert(members)
        .values({ id, ...member })
        .returning();

      if (!memberRet) {
        tx.rollback();
        return;
      }

      const [depositRet] = await tx
        .insert(deposits)
        .values({
          memberId: memberRet.id,
          ...depositValues,
        })
        .returning();

      if (!depositRet) {
        tx.rollback();
        return;
      }

      loan.depositId = depositRet.id;
      loan.verified = true;
      await tx.insert(loans).values(loan);

      return memberRet;
    });

    if (!memberReturned) {
      throw new Error("Failed to create member.");
    }

    return await db.query.members.findFirst({
      where: eq(members.id, memberReturned.id),
      with: {
        deposit: {
          with: {
            loans: true,
          },
        },
      },
    });
  } catch (error) {
    uploadService.unpersistFile(member.idPictureUrl);
    throw error;
  }
}

export async function addDepositToMember(id: string, data: z.infer<typeof addDepositSchema>) {
  const member = await getMemberById(id);
  if (!member) {
    throw new Error("Member not found.");
  }

  const [deposit] = await db.update(deposits).set(data).where(eq(deposits.memberId, id)).returning();
  if (!deposit) {
    throw new Error("Failed to add deposit to member.");
  }

  return getMemberById(id);
}

export async function addLoanToMember(id: string, data: typeof loans.$inferInsert) {
  const member = await db.query.members.findFirst({
    where: eq(members.id, id),
    with: {
      deposit: {
        with: {
          loans: {
            orderBy: desc(loans.createdAt),
          },
        },
      },
    },
  });
  if (!member) {
    throw new Error("Member not found.");
  }

  await calculateExistingMemberDeposit(id, data.loan);
  data.depositId = member.deposit.id;

  const memberTx = await db.transaction(async (tx) => {
    if (member.deposit.loans[0] && !member.deposit.loans[0].verified) {
      await tx.delete(loans).where(eq(loans.id, member.deposit.loans[0].id));
    }

    await tx.insert(loans).values(data);
    return db.query.members.findFirst({
      where: eq(members.id, id),
      with: {
        deposit: {
          with: {
            loans: true,
          },
        },
      },
    });
  });
  if (!memberTx) {
    throw new Error("Failed to add loan to member.");
  }

  return memberTx;
}

export async function updateMember(id: string, data: Partial<typeof members.$inferInsert>) {
  data.updatedAt = new Date();
  const [member] = await db.update(members).set(data).where(eq(members.id, id)).returning();
  if (!member) {
    throw new Error("Member not found");
  }

  return member;
}

export async function calculateNewMemberDeposit(loan: number) {
  if (loan * ADMIN_PERCENTAGE < MINIMUM_PRINCIPAL_DEPOSIT) {
    throw new Error(
      `Minimum principal deposit is not met. Minimum loan is ${MINIMUM_PRINCIPAL_DEPOSIT / ADMIN_PERCENTAGE}.`,
    );
  }

  const monthCount = Math.min(Math.floor((loan * ADMIN_PERCENTAGE - MINIMUM_PRINCIPAL_DEPOSIT) / MONTHLY_DEPOSIT), 6);
  const mandatoryDeposit = monthCount * MONTHLY_DEPOSIT;
  const voluntaryDeposit = loan * ADMIN_PERCENTAGE - MINIMUM_PRINCIPAL_DEPOSIT - mandatoryDeposit;

  return {
    principalDeposit: MINIMUM_PRINCIPAL_DEPOSIT,
    mandatoryDeposit,
    voluntaryDeposit,
  };
}

export async function calculateExistingMemberDeposit(id: string, loan: number) {
  const member = await db.query.members.findFirst({
    where: eq(members.id, id),
    with: {
      deposit: {
        with: {
          loans: {
            orderBy: desc(loans.createdAt),
          },
        },
      },
    },
  });

  if (!member) {
    throw new Error("Member not found.");
  }

  const adminCost = loan * ADMIN_PERCENTAGE;

  const loanCount =
    member.deposit.loans[0] && !member.deposit.loans[0].verified
      ? member.deposit.loans.length - 1
      : member.deposit.loans.length;

  const shouldBeMandatoryDeposited = loanCount * (MONTHLY_DEPOSIT * LOAN_PERIOD_MONTHS);

  const mandatoryDepositRemaining = Math.max(shouldBeMandatoryDeposited - member.deposit.mandatoryDeposit, 0);
  if (adminCost < mandatoryDepositRemaining) {
    throw new Error(
      `Minimum principal deposit is not met. Minimum loan is ${mandatoryDepositRemaining / ADMIN_PERCENTAGE}.`,
    );
  }

  const shouldBeMandatoryDepositedAfter = (loanCount + 1) * (MONTHLY_DEPOSIT * LOAN_PERIOD_MONTHS);
  const mandatoryDepositRemainingAfter = Math.max(shouldBeMandatoryDepositedAfter - member.deposit.mandatoryDeposit, 0);

  const ableToDeposit = Math.min(adminCost, mandatoryDepositRemainingAfter);

  const mandatoryDeposit = ableToDeposit;
  const voluntaryDeposit = adminCost - ableToDeposit;

  return {
    principalDeposit: MINIMUM_PRINCIPAL_DEPOSIT,
    mandatoryDeposit: member.deposit.mandatoryDeposit + mandatoryDeposit,
    voluntaryDeposit: member.deposit.voluntaryDeposit + voluntaryDeposit,
  };
}

async function generateId(data: Omit<typeof members.$inferInsert, "id">) {
  const { branchId, leaderId } = data;

  let { value } = (
    await db
      .select({
        value: count(members.id),
      })
      .from(members)
      .where(eq(members.branchId, branchId!))
  )[0]!;

  const regionId = data.nik.startsWith("35") ? "01" : "02";

  let id = `${regionId}.${branchId}.${leaderId}.${(value + 1).toString().padStart(5, "0")}`;
  while (await db.query.members.findFirst({ where: eq(members.id, id) })) {
    value++;
    id = `${regionId}.${branchId}.${leaderId}.${(value + 1).toString().padStart(5, "0")}`;
  }

  return id;
}
