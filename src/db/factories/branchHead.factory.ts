import { faker } from "@faker-js/faker";
import { educationEnum, genderEnum, religionEnum } from "../schemas";
import type { branchHeads } from "../schemas";

export default async function branchHeadFactory(): Promise<typeof branchHeads.$inferInsert> {
  return {
    name: faker.person.fullName(),
    birthPlace: faker.location.city(),
    birthDate: faker.date.past().toISOString().split("T")[0]!,
    gender: genderEnum.enumValues[faker.number.int(genderEnum.enumValues.length)] ?? "laki-laki",
    nik: faker.string.numeric(16),
    religion: religionEnum.enumValues[faker.number.int(religionEnum.enumValues.length)] ?? "islam",
    occupation: faker.person.jobTitle(),
    address: faker.location.streetAddress(),
    kelurahan: faker.location.buildingNumber(),
    kecamatan: faker.location.cardinalDirection(),
    city: faker.location.city(),
    phoneNumber: faker.string.numeric(12),
    education: educationEnum.enumValues[faker.number.int(educationEnum.enumValues.length)] ?? "sma",
    idPictureUrl: "placeholder.png",
  };
}
