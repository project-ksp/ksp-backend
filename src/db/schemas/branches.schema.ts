import { pgTable, serial, timestamp, varchar, text, integer } from "drizzle-orm/pg-core";
import { branchHeads } from "./branchHeads.schema";
import { createInsertSchema } from "drizzle-zod";

export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  kelurahan: varchar("kelurahan", { length: 256 }).notNull(),
  kecamatan: varchar("kecamatan", { length: 256 }).notNull(),
  city: varchar("city", { length: 256 }).notNull(),
  postalCode: varchar("postal_code", { length: 5 }).notNull(),
  publishAmount: integer("publish_amount").notNull().default(0),
  headId: serial("head_id")
    .references(() => branchHeads.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBranchSchema = createInsertSchema(branches);
