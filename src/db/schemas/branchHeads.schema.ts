import { pgTable, serial, timestamp, varchar, text, boolean, date } from "drizzle-orm/pg-core";
import { educationEnum, genderEnum, religionEnum } from "./enums.schema";
import { createInsertSchema } from "drizzle-zod";
import { branches } from "./branches.schema";
import { relations } from "drizzle-orm";

export const branchHeads = pgTable("branch_heads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  isMarried: boolean("is_married").notNull().default(false),
  spouse: varchar("spouse", { length: 256 }),
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

export const branchHeadsRelations = relations(branchHeads, ({ one }) => ({
  branch: one(branches, {
    fields: [branchHeads.branchId],
    references: [branches.id],
  }),
}));

export const insertBranchHeadSchema = createInsertSchema(branchHeads);
