import bcrypt from "bcrypt";
import { users } from "../schemas";
import { db } from "..";

export default async function seed() {
  const owner: typeof users.$inferInsert = {
    username: "owner",
    password: bcrypt.hashSync("owner", 10),
    name: "Dummy Owner",
    role: "owner",
  };

  const teller: typeof users.$inferInsert = {
    username: "teller",
    password: bcrypt.hashSync("teller", 10),
    name: "Dummy Teller",
    role: "teller",
  };

  const branchHead: typeof users.$inferInsert = {
    username: "kepalacabang",
    password: bcrypt.hashSync("kepalacabang", 10),
    name: "Dummy Branch Head",
    role: "branch_head",
  };

  await db.insert(users).values(owner).returning();
  await db.insert(users).values(teller).returning();
  await db.insert(users).values(branchHead).returning();
}
