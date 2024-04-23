import { db } from "@/db";
import { branchHeads } from "@/db/schemas";
import * as uploadService from "./upload.service";

export async function createBranchHead(data: typeof branchHeads.$inferInsert) {
  const profilePictureUrl = uploadService.persistTemporaryFile(data.profilePictureUrl);
  const idPictureUrl = uploadService.persistTemporaryFile(data.idPictureUrl);

  data.profilePictureUrl = profilePictureUrl;
  data.idPictureUrl = idPictureUrl;

  const [branchHead] = await db.insert(branchHeads).values(data).returning();
  if (!branchHead) {
    throw new Error("Branch head could not be created");
  }

  return branchHead;
}
