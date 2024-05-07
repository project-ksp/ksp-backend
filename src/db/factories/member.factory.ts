import { faker } from "@faker-js/faker";
import type { members } from "../schemas/members.schema";
import { educationEnum, genderEnum, memberStatusEnum, religionEnum } from "../schemas";

export default async function memberFactory(): Promise<typeof members.$inferInsert> {
  const member = {
    id: `0${faker.number.int({ min: 1, max: 2 })}.${faker.string.numeric(2)}.${faker.string.numeric(2)}.${faker.string.numeric(5)}`,
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
    postalCode: faker.string.numeric(5),
    phoneNumber: faker.string.numeric(12),
    education: educationEnum.enumValues[faker.number.int(educationEnum.enumValues.length)] ?? "sma",
    profilePictureUrl: "placeholder.png",
    idPictureUrl: "placeholder.png",

    status: memberStatusEnum.enumValues[faker.number.int(memberStatusEnum.enumValues.length)] ?? "diproses",
    verified: faker.datatype.boolean(),
  };

  return member;
}
