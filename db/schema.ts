import {
  pgTable,
  pgEnum,
  text,
  integer,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const stageEnum = pgEnum("stage", [
  "pre-seed",
  "seed",
  "series-a",
  "series-b",
  "unknown",
]);

export const statusEnum = pgEnum("status", [
  "applied",
  "dm_sent",
  "replied",
  "interview",
  "rejected",
  "offer",
  "ghosted",
]);

export const sourceEnum = pgEnum("source", [
  "wellfound",
  "linkedin",
  "referral",
  "twitter",
  "cold_email",
  "other",
]);

export type Stage = (typeof stageEnum.enumValues)[number];
export type Status = (typeof statusEnum.enumValues)[number];
export type Source = (typeof sourceEnum.enumValues)[number];

// ─── Applications ─────────────────────────────────────────────────────────────

export const applications = pgTable("applications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  companyName: text("company_name").notNull(),
  role: text("role").notNull(),
  stage: stageEnum("stage").notNull().default("unknown"),
  appliedDate: text("applied_date").notNull(),
  status: statusEnum("status").notNull().default("applied"),
  source: sourceEnum("source").default("other"),
  jobUrl: text("job_url"),
  contactPerson: text("contact_person"),
  contactUrl: text("contact_url"),
  lastContactedAt: text("last_contacted_at"),
  followUpDate: text("follow_up_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;

// ─── User Profiles (Vault) ────────────────────────────────────────────────────

export const userProfiles = pgTable("user_profile", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  // Identity
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  // Links
  portfolioUrl: text("portfolio_url"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  resumeUrl: text("resume_url"),
  // Resume file (Vercel Blob)
  resumeFileKey: text("resume_file_key"),
  resumeFileName: text("resume_file_name"),
  resumeMimeType: text("resume_mime_type"),
  resumeUploadedAt: timestamp("resume_uploaded_at"),
  // Settings
  defaultFollowUpDays: integer("default_follow_up_days").notNull().default(7),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type UserProfile = typeof userProfiles.$inferSelect;

// ─── Vault Snippets ───────────────────────────────────────────────────────────

export const vaultSnippets = pgTable("vault_snippet", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type VaultSnippet = typeof vaultSnippets.$inferSelect;

// ─── NextAuth tables ──────────────────────────────────────────────────────────

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);
