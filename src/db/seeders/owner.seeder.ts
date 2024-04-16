import bcrypt from "bcrypt";
import { db } from "..";
import { owners, users } from "../schemas";

export default async function seed() {
  const userData: typeof users.$inferInsert = {
    username: "owner",
    password: bcrypt.hashSync("owner", 10),
    name: "Dummy Owner",
    role: "owner",
  };

  const roleData: typeof owners.$inferInsert = {};

  const user = await db.insert(users).values(userData).returning();
  if (user[0]) {
    roleData.userId = user[0].id;
    await db.insert(owners).values(roleData).returning();
  }
}
