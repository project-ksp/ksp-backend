import { bigint, timestamp, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { deposits } from "./deposits.schema";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { branches } from "./branches.schema";
import { leaders } from "./leaders.schema";

export const monthlyLoans = pgTable("monthly_loans", {
  id: serial("id").primaryKey(),
  loan: bigint("loan", { mode: "number" }).notNull(),
  branchId: serial("branch_id")
    .notNull()
    .references(() => branches.id),
  leaderId: varchar("leader_id", { length: 32 })
    .notNull()
    .references(() => leaders.id),
  depositId: serial("deposit_id")
    .notNull()
    .references(() => deposits.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const monthlyLoansRelations = relations(monthlyLoans, ({ one }) => ({
  branch: one(branches, {
    fields: [monthlyLoans.branchId],
    references: [branches.id],
  }),
  leader: one(leaders, {
    fields: [monthlyLoans.leaderId],
    references: [leaders.id],
  }),
  deposit: one(deposits, {
    fields: [monthlyLoans.depositId],
    references: [deposits.id],
  }),
}));

export const insertMonthlyLoanSchema = createInsertSchema(monthlyLoans).omit({
  createdAt: true,
  updatedAt: true,
});
