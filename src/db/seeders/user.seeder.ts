import { users } from "../schemas";
import { db } from "..";
import cipher from "@/utils/cipher";

export default async function seed() {
  const branch = await db.query.branches.findFirst();
  if (!branch) {
    throw new Error("Branches table is empty. Please seed the branches table first.");
  }

  const owner: typeof users.$inferInsert = {
    username: "owner",
    password: await cipher.encrypt("owner"),
    name: "Dummy Owner",
    role: "owner",
    branchId: branch.id,
  };

  const teller: typeof users.$inferInsert = {
    username: "teller",
    password: await cipher.encrypt("teller"),
    name: "Dummy Teller",
    role: "teller",
    branchId: branch.id,
  };

  const branchHead: typeof users.$inferInsert = {
    username: "kepalacabang",
    password: await cipher.encrypt("kepalacabang"),
    name: "Dummy Branch Head",
    role: "branch_head",
    branchId: branch.id,
  };

  await db.insert(users).values(owner);
  await db.insert(users).values(teller);
  await db.insert(users).values(branchHead);
}

export async function clear() {
  await db.delete(users);
}
