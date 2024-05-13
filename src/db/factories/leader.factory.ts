import { faker } from "@faker-js/faker";
import type { leaders } from "../schemas/leaders.schema";
import { educationEnum, genderEnum, religionEnum } from "../schemas";

export default async function leaderFactory(): Promise<typeof leaders.$inferInsert> {
  return {
    id: `**.${faker.string.numeric(2)}`,
    name: faker.person.fullName(),
    birthPlace: faker.location.city(),
    birthDate: faker.date.birthdate().toISOString().split("T")[0]!,
    gender: genderEnum.enumValues[faker.number.int(genderEnum.enumValues.length)] ?? "laki-laki",
    nik: faker.string.numeric(16),
    religion: religionEnum.enumValues[faker.number.int(religionEnum.enumValues.length)] ?? "islam",
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
