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
    name: "KSP Sentosa Makmur",
    role: "owner",
    branchId: branch.id,
  };

  await db.insert(users).values([owner]);
}

export async function clear() {
  await db.delete(users);
}
