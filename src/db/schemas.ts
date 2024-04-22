import { pgEnum, pgTable, serial, timestamp, varchar, text, boolean } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["laki-laki", "perempuan"]);
export const roleEnum = pgEnum("role", ["owner", "teller", "branch_head"]);
export const religionEnum = pgEnum("religion", ["islam", "kristen", "katolik", "hindu", "buddha", "konghucu"]);
export const educationEnum = pgEnum("education", ["sd", "smp", "sma", "s1", "s2"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  kelurahan: varchar("kelurahan", { length: 256 }).notNull(),
  kecamatan: varchar("kecamatan", { length: 256 }).notNull(),
  city: varchar("city", { length: 256 }).notNull(),
  postalCode: varchar("postal_code", { length: 5 }).notNull(),
  headID: serial("head_id")
    .references(() => branchHeads.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const branchHeads = pgTable("branch_heads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  isMarried: boolean("is_married").notNull().default(false),
  spouse: varchar("spouse", { length: 256 }),
  birthPlace: varchar("birth_place", { length: 256 }).notNull(),
  birthDate: timestamp("birth_date").notNull(),
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
  profilePictureURL: varchar("profile_picture_url", { length: 256 }).notNull(),
  idPictureURL: varchar("id_picture_url", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
