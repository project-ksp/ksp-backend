import { faker } from "@faker-js/faker";
import type { members } from "../schemas/members.schema";
import { genderEnum } from "../schemas";

export default async function membersFactory(): Promise<typeof members.$inferInsert> {
  const member = {
    id: `0${faker.number.int({ min: 1, max: 2 })}.${faker.string.numeric(2)}.${faker.string.numeric(2)}.${faker.string.numeric(5)}`,
    name: faker.person.fullName(),
    nik: faker.string.numeric(16),
    gender: genderEnum.enumValues[faker.number.int(genderEnum.enumValues.length)] ?? "laki-laki",
    totalSaving: faker.number.int({ min: 0, max: 100000000 }),
    totalLoan: faker.number.int({ min: 0, max: 100000000 }),
    leader: faker.person.fullName(),
  };

  return member;
}
