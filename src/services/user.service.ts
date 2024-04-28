import { db } from "@/db";
import { users } from "@/db/schemas";
import bcrypt from "bcrypt";

export async function authenticate(username: string, password: string) {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, username),
  });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error("Invalid username or password");
  }

  const { password: _, ...rest } = user;
  return rest;
}

export async function getAllUsers(where: Partial<typeof users.$inferSelect> = {}) {
  return (
    await db.query.users.findMany({
      where: (users, { eq, and }) =>
        and(...Object.entries(where).map(([key, value]) => eq(users[key as keyof typeof users], value))),
    })
  ).map((user) => {
    const { password, ...rest } = user;
    return rest;
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

export async function createUser(data: typeof users.$inferInsert) {
  data.password = bcrypt.hashSync(data.password, 10);
  const user = await db.insert(users).values(data).returning();
  return user;
}

export async function generateCSV() {
  const users = await db.query.users.findMany();
  const headers = ["ID Cabang", "Username", "Pemilik Akun", "Jabatan"];

  let rows = headers.join(",") + "\n";
  users.forEach((user) => {
    rows += `${user.id},"${user.username}","${user.name}","${user.role === "branch_head" ? "kepala cabang" : user.role}"\n`;
  });
  return rows;
}
