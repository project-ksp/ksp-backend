import { date, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { educationEnum, genderEnum, religionEnum } from "./enums.schema";
import { branches } from "./branches.schema";
import { createInsertSchema } from "drizzle-zod";
import * as uploadService from "@/services/upload.service";
import { relations } from "drizzle-orm";

export const tellers = pgTable("tellers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  birthPlace: varchar("birth_place", { length: 256 }).notNull(),
  birthDate: date("birth_date", { mode: "string" }).notNull(),
  gender: genderEnum("gender").notNull(),
  nik: varchar("nik", { length: 16 }).notNull(),
  religion: religionEnum("religion").notNull(),
  address: text("address").notNull(),
  kelurahan: varchar("kelurahan", { length: 256 }).notNull(),
  kecamatan: varchar("kecamatan", { length: 256 }).notNull(),
  city: varchar("city", { length: 256 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull().default(""),
  education: educationEnum("education").notNull(),
  idPictureUrl: varchar("id_picture_url", { length: 256 }).notNull(),
  branchId: serial("branch_id").references(() => branches.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const tellersRelations = relations(tellers, ({ one }) => ({
  branch: one(branches, {
    fields: [tellers.branchId],
    references: [branches.id],
  }),
}));

export const insertTellerSchema = createInsertSchema(tellers)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .refine((input) => uploadService.isTemporaryFileExists(input.idPictureUrl), {
    message: "ID picture is not uploaded yet.",
  });

export const updateTellerSchema = createInsertSchema(tellers).omit({
  idPictureUrl: true,
  createdAt: true,
  updatedAt: true,
});
