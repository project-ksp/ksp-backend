import { faker } from "@faker-js/faker";
import type { branches } from "../schemas";

export default async function branchFactory(): Promise<typeof branches.$inferInsert> {
  return {
    address: faker.location.streetAddress(),
    kelurahan: faker.location.buildingNumber(),
    kecamatan: faker.location.cardinalDirection(),
    city: "Kediri",
    publishAmount: faker.number.int(100),
  };
}
