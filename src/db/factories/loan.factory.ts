import { faker } from "@faker-js/faker";
import type { loans } from "../schemas/loans.schema";

export default async function loanFactory(): Promise<typeof loans.$inferInsert> {
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 6);

  return {
    loan: faker.number.int({
      min: 50000,
      max: 10000000,
    }),
    leaderId: "",
    startDate: new Date().toISOString(),
    endDate: endDate.toISOString(),
  };
}
