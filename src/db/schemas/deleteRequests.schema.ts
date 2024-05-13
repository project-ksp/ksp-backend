import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { members } from "./members.schema";
import { statusEnum } from "./enums.schema";
import { relations } from "drizzle-orm";

export const deleteRequests = pgTable("delete_requests", {
  id: serial("id").primaryKey(),
  memberId: varchar("member_id", { length: 32 })
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  proofUrl: varchar("proof_url", { length: 256 }).notNull(),
  status: statusEnum("status").notNull().default("diproses"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const deleteRequestsRelations = relations(deleteRequests, ({ one }) => ({
  member: one(members, {
    fields: [deleteRequests.memberId],
    references: [members.id],
  }),
}));
