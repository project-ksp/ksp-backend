import bcrypt from "bcrypt";
import { users } from "../schemas";
import { db } from "..";

export default async function seed() {
  const branch = await db.query.branches.findFirst();
  if (!branch) {
    throw new Error("Branches table is empty. Please seed the branches table first.");
  }

  const owner: typeof users.$inferInsert = {
    username: "owner",
    password: bcrypt.hashSync("owner", 10),
    name: "Dummy Owner",
    role: "owner",
    branchId: branch.id,
  };

  const teller: typeof users.$inferInsert = {
    username: "teller",
    password: bcrypt.hashSync("teller", 10),
    name: "Dummy Teller",
    role: "teller",
    branchId: branch.id,
  };

  const branchHead: typeof users.$inferInsert = {
    username: "kepalacabang",
    password: bcrypt.hashSync("kepalacabang", 10),
    name: "Dummy Branch Head",
    role: "branch_head",
    branchId: branch.id,
  };

  await db.insert(users).values(owner);
  await db.insert(users).values(teller);
  await db.insert(users).values(branchHead);
}
