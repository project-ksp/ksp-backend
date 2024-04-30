import { faker } from "@faker-js/faker";
import { educationEnum, genderEnum, religionEnum } from "../schemas";
import type { branchHeads } from "../schemas";
import { db } from "..";

export default async function branchHeadFactory(): Promise<typeof branchHeads.$inferInsert> {
  const branchHead = {
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
    postalCode: faker.string.numeric(5),
    phoneNumber: faker.string.numeric(12),
    education: educationEnum.enumValues[faker.number.int(educationEnum.enumValues.length)] ?? "sma",
    profilePictureUrl: "placeholder.png",
    idPictureUrl: "placeholder.png",
  };

  const branch = await db.query.branches.findFirst({
    columns: {
      id: true,
    },
  });
  if (branch) {
    Object.assign(branchHead, { branchId: branch.id });
  }
  return branchHead;
}
