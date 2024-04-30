import { faker } from "@faker-js/faker";
import type { branches } from "../schemas";

export default async function branchFactory(): Promise<typeof branches.$inferInsert> {
  return {
    address: faker.location.streetAddress(),
    kelurahan: faker.location.buildingNumber(),
    kecamatan: faker.location.cardinalDirection(),
    city: faker.location.city(),
    postalCode: faker.string.numeric(5),
    publishAmount: faker.number.int(100),
  };
}
