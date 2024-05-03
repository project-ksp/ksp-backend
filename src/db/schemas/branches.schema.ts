import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { branchHeads } from "./branchHeads.schema";
import { members } from "./members.schema";
import { tellers } from "./tellers.schema";

export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  kelurahan: varchar("kelurahan", { length: 256 }).notNull(),
  kecamatan: varchar("kecamatan", { length: 256 }).notNull(),
  city: varchar("city", { length: 256 }).notNull(),
  postalCode: varchar("postal_code", { length: 5 }).notNull(),
  publishAmount: integer("publish_amount").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const branchesRelations = relations(branches, ({ many }) => ({
  branchHeads: many(branchHeads),
  members: many(members),
  tellers: many(tellers),
}));

export const insertBranchSchema = createInsertSchema(branches);
