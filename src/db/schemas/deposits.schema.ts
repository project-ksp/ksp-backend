import { relations } from "drizzle-orm";
import { bigint, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { monthlyDeposits } from "./monthlyDeposits.schema";
import { members } from "./members.schema";
import { createInsertSchema } from "drizzle-zod";

export const deposits = pgTable("deposits", {
  id: serial("id").primaryKey(),
  principalDeposit: bigint("principal_deposits", { mode: "number" }).notNull(),
  voluntaryDeposit: bigint("voluntary_deposits", { mode: "number" }).notNull(),
  memberId: varchar("member_id", { length: 32 }).references(() => members.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const depositsRelations = relations(deposits, ({ one, many }) => ({
  members: one(members, {
    fields: [deposits.memberId],
    references: [members.id],
  }),
  monthlyDeposits: many(monthlyDeposits),
}));

export const insertDepositSchema = createInsertSchema(deposits).omit({
  createdAt: true,
  updatedAt: true,
});
