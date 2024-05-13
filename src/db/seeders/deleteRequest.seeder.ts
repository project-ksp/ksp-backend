import { db } from "..";
import { deleteRequests } from "../schemas/deleteRequests.schema";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async function seed() {}

export async function clear() {
  await db.delete(deleteRequests);
}
