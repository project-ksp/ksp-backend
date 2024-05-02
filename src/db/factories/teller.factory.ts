import { faker } from "@faker-js/faker";
import type { tellers } from "../schemas/tellers.schema";
import { educationEnum, genderEnum, religionEnum } from "../schemas";

export default async function tellerFactory(): Promise<typeof tellers.$inferInsert> {
  return {
    name: faker.person.fullName(),
    birthPlace: faker.location.city(),
    birthDate: faker.date.birthdate().toISOString().split("T")[0]!,
    gender: genderEnum.enumValues[faker.number.int(genderEnum.enumValues.length)] ?? "laki-laki",
    nik: faker.string.numeric(16),
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
  };
}
