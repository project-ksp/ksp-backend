import { bigint, boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { genderEnum } from "./enums.schema";
import { branches } from "./branches.schema";
import { relations } from "drizzle-orm";
import { leaders } from "./leaders.schema";

export const members = pgTable("members", {
  id: varchar("id", { length: 20 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  nik: varchar("nik", { length: 16 }).unique().notNull(),
  gender: genderEnum("gender").notNull(),
  leader: varchar("leader", { length: 256 }).notNull(),
  totalSaving: bigint("total_saving", { mode: "number" }).notNull().default(0),
  totalLoan: bigint("total_loan", { mode: "number" }).notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  branchId: serial("branch_id").references(() => branches.id),
  leaderId: serial("leader_id").references(() => leaders.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
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
}));
