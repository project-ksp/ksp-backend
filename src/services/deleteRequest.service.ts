import { deleteRequests, members } from "@/db/schemas";
import * as uploadService from "./upload.service";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function createRequest(data: typeof deleteRequests.$inferInsert) {
  try {
    const proofUrl = uploadService.persistTemporaryFile(data.proofUrl);
    data.proofUrl = proofUrl;

    const [deleteRequest] = await db.insert(deleteRequests).values(data).returning();
    if (!deleteRequest) {
      throw new Error("Delete request could not be created");
    }

    return deleteRequest;
  } catch (error) {
    uploadService.unpersistFile(data.proofUrl);
    throw error;
  }
}

export async function updateStatus(
  id: typeof deleteRequests.$inferSelect.id,
  status: typeof deleteRequests.$inferSelect.status,
) {
  return db.update(deleteRequests).set({ status }).where(eq(deleteRequests.id, id)).returning();
}

export async function deleteMember(id: typeof deleteRequests.$inferSelect.id) {
  const deleteRequest = await db.query.deleteRequests.findFirst({ where: eq(deleteRequests.id, id) });
  if (!deleteRequest) {
    throw new Error("Delete request not found");
  }

  if (deleteRequest.status !== "disetujui") {
    throw new Error("Delete request can only be removed if it has been approved");
  }

  const { proofUrl } = deleteRequest;
  await db.delete(members).where(eq(members.id, deleteRequest.memberId));
  uploadService.unlinkFile(proofUrl);
}
