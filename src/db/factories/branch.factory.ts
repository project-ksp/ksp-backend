import { faker } from "@faker-js/faker";
import type { branches } from "../schemas";
import { db } from "..";

export default async function branchFactory(): Promise<typeof branches.$inferInsert> {
  const branch = {
    address: faker.location.streetAddress(),
    kelurahan: faker.location.buildingNumber(),
    kecamatan: faker.location.cardinalDirection(),
    city: faker.location.city(),
    postalCode: faker.string.numeric(5),
  };
  const headId = await db.query.branchHeads.findFirst();
  if (headId) {
    Object.assign(branch, { headId: headId.id });
  }

  return branch;
}
