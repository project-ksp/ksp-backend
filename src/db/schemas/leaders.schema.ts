import { date, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { educationEnum, genderEnum, religionEnum } from "./enums.schema";
import { branches } from "./branches.schema";
import { createInsertSchema } from "drizzle-zod";
import * as uploadService from "@/services/upload.service";
import { relations } from "drizzle-orm";
import { members } from "./members.schema";

export const leaders = pgTable("leaders", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  birthPlace: varchar("birth_place", { length: 256 }).notNull(),
  birthDate: date("birth_date", { mode: "string" }).notNull(),
  gender: genderEnum("gender").notNull(),
  nik: varchar("nik", { length: 16 }).notNull(),
  religion: religionEnum("religion").notNull(),
  occupation: varchar("occupation", { length: 256 }).notNull(),
  address: text("address").notNull(),
  kelurahan: varchar("kelurahan", { length: 256 }).notNull(),
  kecamatan: varchar("kecamatan", { length: 256 }).notNull(),
  city: varchar("city", { length: 256 }).notNull(),
  postalCode: varchar("postal_code", { length: 5 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  education: educationEnum("education").notNull(),
  profilePictureUrl: varchar("profile_picture_url", { length: 256 }).notNull(),
  idPictureUrl: varchar("id_picture_url", { length: 256 }).notNull(),
  branchId: serial("branch_id").references(() => branches.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const leadersRelations = relations(leaders, ({ one, many }) => ({
  branch: one(branches, {
    fields: [leaders.branchId],
    references: [branches.id],
  }),
  members: many(members),
}));

export const insertLeaderSchema = createInsertSchema(leaders)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .refine(
    (input) =>
      uploadService.isTemporaryFileExists(input.profilePictureUrl) &&
      uploadService.isTemporaryFileExists(input.idPictureUrl),
    {
      message: "Profile picture or ID picture is not uploaded yet.",
    },
  );

export const updateLeaderSchema = createInsertSchema(leaders).omit({
  profilePictureUrl: true,
  idPictureUrl: true,
  createdAt: true,
  updatedAt: true,
});
