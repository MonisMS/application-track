import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const stageEnum = ["pre-seed", "seed", "series-a", "series-b", "unknown"] as const;
export const statusEnum = ["applied", "dm_sent", "replied", "interview", "rejected", "offer", "ghosted"] as const;

export type Stage = (typeof stageEnum)[number];
export type Status = (typeof statusEnum)[number];

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyName: text("company_name").notNull(),
  role: text("role").notNull(),
  stage: text("stage", { enum: stageEnum }).notNull().default("unknown"),
  appliedDate: text("applied_date").notNull(),
  status: text("status", { enum: statusEnum }).notNull().default("applied"),
  contactPerson: text("contact_person"),
  followUpDate: text("follow_up_date"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now'))`),
});

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
