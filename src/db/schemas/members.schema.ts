import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { genderEnum } from "./enums.schema";

export const members = pgTable("members", {
  id: varchar("id", { length: 20 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  nik: varchar("nik", { length: 16 }).unique().notNull(),
  gender: genderEnum("gender").notNull(),
  leader: varchar("leader", { length: 256 }).notNull(),
  totalSaving: integer("total_saving").notNull().default(0),
  totalLoan: integer("total_loan").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});
