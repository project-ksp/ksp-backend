import bcrypt from "bcrypt";
import { db } from "..";
import { branchHeads, users } from "../schemas";

export default async function seed() {
  const userData: typeof users.$inferInsert = {
    username: "kepalacabang",
    password: bcrypt.hashSync("kepalacabang", 10),
    role: "branch_head",
  };

  const roleData: typeof branchHeads.$inferInsert = {
    name: "Dummy Branch Head",
  };

  const user = await db.insert(users).values(userData).returning();
  if (user[0]) {
    roleData.userId = user[0].id;
    await db.insert(branchHeads).values(roleData).returning();
  }
}
