import { faker } from "@faker-js/faker";
import type { members } from "../schemas/members.schema";
import { educationEnum, genderEnum, statusEnum, religionEnum } from "../schemas";

export default async function memberFactory(): Promise<typeof members.$inferInsert> {
  const member = {
    id: `0${faker.number.int({ min: 1, max: 2 })}.**.##.${faker.string.numeric(5)}`,
    name: faker.person.fullName(),
    nik: faker.string.numeric(16),
    gender: genderEnum.enumValues[faker.number.int(genderEnum.enumValues.length)] ?? "laki-laki",
    isActive: faker.datatype.boolean(),

    birthPlace: faker.location.city(),
    birthDate: faker.date.past().toISOString().split("T")[0]!,
    religion: religionEnum.enumValues[faker.number.int(religionEnum.enumValues.length)] ?? "islam",
    occupation: faker.person.jobTitle(),
    address: faker.location.streetAddress(),
    kelurahan: faker.location.buildingNumber(),
    kecamatan: faker.location.cardinalDirection(),
    city: faker.location.city(),
    phoneNumber: faker.string.numeric(12),
    education: educationEnum.enumValues[faker.number.int(educationEnum.enumValues.length)] ?? "sma",
    idPictureUrl: "placeholder.png",

    status: statusEnum.enumValues[faker.number.int(statusEnum.enumValues.length)] ?? "diproses",
    verified: faker.datatype.boolean(),

    leaderId: "",
  };

  return member;
}
