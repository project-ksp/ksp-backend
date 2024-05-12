import { faker } from "@faker-js/faker";
import type { deposits } from "../schemas";

export default async function depositFactory(): Promise<typeof deposits.$inferInsert> {
  return {
    principalDeposit: 50000,
    mandatoryDeposit:
      faker.number.int({
        min: 0,
        max: 6,
      }) * 5000,
    voluntaryDeposit: faker.number.int({
      min: 50000,
      max: 10000000,
    }),
  };
}
