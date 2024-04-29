import { db } from "@/db";
import { users } from "@/db/schemas";
import cipher from "@/utils/cipher";
import { count, eq } from "drizzle-orm";
import * as branchService from "./branch.service";

export async function authenticate(username: string, password: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });
  if (!user || (await cipher.decrypt(user.password)) !== password) {
    throw new Error("Invalid username or password");
  }

  const { password: _, ...rest } = user;
  return rest;
}

export async function getAllUsers(where: Partial<typeof users.$inferSelect> = {}) {
  return await db.query.users.findMany({
    where: (users, { eq, and }) =>
      and(...Object.entries(where).map(([key, value]) => eq(users[key as keyof typeof users], value))),
  });
}

export async function getUserByID(id: number) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  });
  if (!user) {
    throw new Error("User not found");
  }

  const { password, ...rest } = user;
  return rest;
}

export async function createUser(data: Omit<typeof users.$inferInsert, "username" | "password">) {
  const username = await generateUsername(data.role, data.branchId ?? 0);
  const password = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

  if (data.role === "owner") {
    data.branchId = (await branchService.getAllBranches())[0]!.id;
  }

  const user = await db
    .insert(users)
    .values({ ...data, username, password: await cipher.encrypt(password) })
    .returning();

  return user[0];
}

export async function generateCSV() {
  const users = await db.query.users.findMany();
  const headers = ["ID Cabang", "Username", "Password", "Pemilik Akun", "Jabatan"];

  let rows = headers.join(",") + "\n";
  for (const user of users) {
    const password = await cipher.decrypt(user.password);
    rows += `${user.id},"${user.username}","${password}","${user.name}","${user.role === "branch_head" ? "kepala cabang" : user.role}"\n`;
  }
  return rows;
}

async function generateUsername(role: typeof users.$inferInsert.role, branchId: number) {
  if (role === "owner") {
    const ownerCount = await db
      .select({
        count: count(),
      })
      .from(users)
      .where(eq(users.role, "owner"));
    return `owner.${ownerCount[0]!.count + 1}`;
  }

  if (role === "branch_head") {
    return `kepcabang.${branchId}`;
  }

  if (role === "teller") {
    const tellerCount = await db
      .select({
        count: count(),
      })
      .from(users)
      .where(eq(users.role, "teller"));
    return `teller.${branchId}.${tellerCount[0]!.count + 1}`;
  }

  throw new Error("Invalid role");
}
