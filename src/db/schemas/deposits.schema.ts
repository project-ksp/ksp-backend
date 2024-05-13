import { relations } from "drizzle-orm";
import { bigint, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { members } from "./members.schema";
import { createInsertSchema } from "drizzle-zod";
import { loans } from "./loans.schema";

export const deposits = pgTable("deposits", {
  id: serial("id").primaryKey(),
  principalDeposit: bigint("principal_deposits", { mode: "number" }).notNull(),
  mandatoryDeposit: bigint("mandatory_deposits", { mode: "number" }).notNull(),
  voluntaryDeposit: bigint("voluntary_deposits", { mode: "number" }).notNull(),
  memberId: varchar("member_id", { length: 32 })
    .notNull()
    .references(() => members.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const depositsRelations = relations(deposits, ({ one, many }) => ({
  member: one(members, {
    fields: [deposits.memberId],
    references: [members.id],
  }),
  loans: many(loans),
}));

export const insertDepositSchema = createInsertSchema(deposits).omit({
  createdAt: true,
  updatedAt: true,
});

export const addDepositSchema = createInsertSchema(deposits, {
  mandatoryDeposit: (schema) => schema.mandatoryDeposit.multipleOf(5000),
  voluntaryDeposit: (schema) => schema.voluntaryDeposit.positive(),
}).pick({
  mandatoryDeposit: true,
  voluntaryDeposit: true,
});
