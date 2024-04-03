import bcrypt from "bcrypt";
import { db } from "..";
import { users } from "../schemas";

export default async function seed() {
  const owner: typeof users.$inferInsert = {
    username: "owner",
    password: bcrypt.hashSync("owner", 10),
    role: "owner",
  };

  const teller: typeof users.$inferInsert = {
    username: "teller",
    password: bcrypt.hashSync("teller", 10),
    role: "teller",
  };

  const head: typeof users.$inferInsert = {
    username: "kepalacabang",
    password: bcrypt.hashSync("kepalacabang", 10),
    role: "branch_head",
  };

  await db.insert(users).values([owner, teller, head]).returning();
}
