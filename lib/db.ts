import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "@/db/schema";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "data", "app.db");

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Run migrations on startup
migrate(db, { migrationsFolder: path.join(process.cwd(), "db", "migrations") });
