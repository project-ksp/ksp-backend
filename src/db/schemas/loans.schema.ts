import { bigint, boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { deposits } from "./deposits.schema";
import { relations } from "drizzle-orm";
import { leaders } from "./leaders.schema";
import { createInsertSchema } from "drizzle-zod";
import { branches } from "./branches.schema";
import { statusEnum } from "./enums.schema";

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  loan: bigint("loan", { mode: "number" }).notNull(),
  depositId: serial("deposit_id")
    .notNull()
    .references(() => deposits.id),
  leaderId: varchar("leader_id", { length: 32 })
    .notNull()
    .references(() => leaders.id),
  branchId: serial("branch_id")
    .notNull()
    .references(() => branches.id),
  status: statusEnum("status").notNull().default("diproses"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const loansRelations = relations(loans, ({ one }) => ({
  deposit: one(deposits, {
    fields: [loans.depositId],
    references: [deposits.id],
  }),
  leader: one(leaders, {
    fields: [loans.leaderId],
    references: [leaders.id],
  }),
  branch: one(branches, {
    fields: [loans.branchId],
    references: [branches.id],
  }),
}));

export const insertLoanSchema = createInsertSchema(loans).omit({
  status: true,
  branchId: true,
  verified: true,
  depositId: true,
  createdAt: true,
  updatedAt: true,
});

export const addLoanSchema = createInsertSchema(loans).omit({
  status: true,
  verified: true,
  depositId: true,
  createdAt: true,
  updatedAt: true,
});
