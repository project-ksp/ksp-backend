import { faker } from "@faker-js/faker";
import type { deposits } from "../schemas";

export default async function depositFactory(): Promise<typeof deposits.$inferInsert> {
  return {
    principalDeposit: faker.number.int({
      min: 50000,
      max: 10000000,
    }),
    voluntaryDeposit: faker.number.int({
      min: 50000,
      max: 10000000,
    }),
  };
}
