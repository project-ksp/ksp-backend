import { bigint, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { deposits } from "./deposits.schema";
import { relations } from "drizzle-orm";
import { leaders } from "./leaders.schema";
import { createInsertSchema } from "drizzle-zod";

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  loan: bigint("loan", { mode: "number" }).notNull(),
  depositId: serial("deposit_id")
    .notNull()
    .references(() => deposits.id),
  leaderId: varchar("leader_id", { length: 32 })
    .notNull()
    .references(() => leaders.id),
  createdAt: timestamp("created_at").defaultNow(),
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
}));

export const insertLoanSchema = createInsertSchema(loans).omit({
  depositId: true,
  createdAt: true,
});
