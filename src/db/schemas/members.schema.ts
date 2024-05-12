import { boolean, date, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { educationEnum, genderEnum, memberStatusEnum, religionEnum } from "./enums.schema";
import { branches } from "./branches.schema";
import { relations } from "drizzle-orm";
import { leaders } from "./leaders.schema";
import { users } from "./users.schema";
import { createInsertSchema } from "drizzle-zod";
import { deposits } from "./deposits.schema";
import * as uploadService from "@/services/upload.service";

export const members = pgTable("members", {
  id: varchar("id", { length: 32 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  nik: varchar("nik", { length: 16 }).unique().notNull(),
  gender: genderEnum("gender").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  branchId: serial("branch_id").references(() => branches.id),
  leaderId: varchar("leader_id", { length: 32 })
    .notNull()
    .references(() => leaders.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  isMarried: boolean("is_married").notNull().default(false),
  spouse: varchar("spouse", { length: 256 }),
  birthPlace: varchar("birth_place", { length: 256 }).notNull(),
  birthDate: date("birth_date", { mode: "string" }).notNull(),
  religion: religionEnum("religion").notNull(),
  occupation: varchar("occupation", { length: 256 }).notNull(),
  address: text("address").notNull(),
  kelurahan: varchar("kelurahan", { length: 256 }).notNull(),
  kecamatan: varchar("kecamatan", { length: 256 }).notNull(),
  city: varchar("city", { length: 256 }).notNull(),
  postalCode: varchar("postal_code", { length: 5 }).notNull(),
  education: educationEnum("education").notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  profilePictureUrl: varchar("profile_picture_url", { length: 256 }).notNull(),
  idPictureUrl: varchar("id_picture_url", { length: 256 }).notNull(),
  userId: serial("user_id").references(() => users.id),

  status: memberStatusEnum("status").default("diproses"),
  verified: boolean("verified").notNull().default(false),
});

export const membersRelations = relations(members, ({ one }) => ({
  branch: one(branches, {
    fields: [members.branchId],
    references: [branches.id],
  }),
  leader: one(leaders, {
    fields: [members.leaderId],
    references: [leaders.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  deposit: one(deposits, {
    fields: [members.id],
    references: [deposits.memberId],
  }),
}));

export const insertMemberSchema = createInsertSchema(members)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .refine((input) => input.profilePictureUrl !== input.idPictureUrl, {
    message: "Profile picture and ID picture must be different.",
  })
  .refine(
    (input) =>
      uploadService.isTemporaryFileExists(input.profilePictureUrl) &&
      uploadService.isTemporaryFileExists(input.idPictureUrl),
    {
      message: "Profile picture or ID picture is not uploaded yet.",
    },
  );

export const updateMemberSchema = createInsertSchema(members).omit({
  id: true,
  branchId: true,
  leaderId: true,
  profilePictureUrl: true,
  idPictureUrl: true,
  status: true,
  verified: true,
  createdAt: true,
  updatedAt: true,
});
