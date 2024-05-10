import { bigint, timestamp, pgTable, serial, smallint } from "drizzle-orm/pg-core";
import { deposits } from "./deposits.schema";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const monthlyDeposits = pgTable("monthly_deposits", {
  id: serial("id").primaryKey(),
  month: smallint("month").unique().notNull(),
  deposit: bigint("deposit", { mode: "number" }).notNull(),
  depositId: serial("deposit_id").references(() => deposits.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const monthlyDepositsRelations = relations(monthlyDeposits, ({ one }) => ({
  deposit: one(deposits, {
    fields: [monthlyDeposits.depositId],
    references: [deposits.id],
  }),
}));

export const insertMonthlyDepositSchema = createInsertSchema(monthlyDeposits).omit({
  createdAt: true,
  updatedAt: true,
});
