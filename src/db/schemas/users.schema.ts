import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { roleEnum } from "./enums.schema";
import { branches } from "./branches.schema";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  role: roleEnum("role").notNull(),
  branchId: serial("branch_id")
    .references(() => branches.id)
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
