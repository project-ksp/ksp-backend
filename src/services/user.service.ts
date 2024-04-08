import { db } from "@/db";
import type { branchHeads, owners, tellers } from "@/db/schemas";

export async function getAllUsers() {
  return (await db.query.users.findMany()).map((user) => {
    const { password, ...rest } = user;
    return rest;
  });
}

export async function getUserByUsername(username: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function getUserByID(id: number) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
  if (!user) {
    throw new Error("User not found");
  }

  const { role } = user;
  let userData: typeof owners.$inferSelect | typeof tellers.$inferSelect | typeof branchHeads.$inferSelect | undefined;
  if (role === "owner") {
    userData = await db.query.owners.findFirst({
      where: (owners, { eq }) => eq(owners.userId, id),
    });
  } else if (role === "teller") {
    userData = await db.query.tellers.findFirst({
      where: (tellers, { eq }) => eq(tellers.userId, id),
    });
  } else if (role === "branch_head") {
    userData = await db.query.branchHeads.findFirst({
      where: (branchHeads, { eq }) => eq(branchHeads.userId, id),
    });
  } else {
    throw new Error("Invalid role");
  }

  if (!userData) {
    throw new Error("Invalid user ID");
  }

  return userData;
}
