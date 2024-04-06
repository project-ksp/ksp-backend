import bcrypt from "bcrypt";
import { db } from "..";
import { tellers, users } from "../schemas";

export default async function seed() {
  const userData: typeof users.$inferInsert = {
    username: "teller",
    password: bcrypt.hashSync("teller", 10),
    name: "Dummy Teller",
    role: "teller",
  };

  const roleData: typeof tellers.$inferInsert = {};

  const user = await db.insert(users).values(userData).returning();
  if (user[0]) {
    roleData.userId = user[0].id;
    await db.insert(tellers).values(roleData).returning();
  }
}
