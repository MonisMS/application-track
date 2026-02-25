import { db } from "./db";
import { applications } from "@/db/schema";
import { eq, desc, like, lte, and, notInArray } from "drizzle-orm";
import type { NewApplication, Status } from "@/db/schema";

export async function getAllApplications(filters?: {
  status?: Status;
  search?: string;
}) {
  let query = db.select().from(applications).$dynamic();

  if (filters?.status) {
    query = query.where(eq(applications.status, filters.status));
  } else if (filters?.search) {
    query = query.where(like(applications.companyName, `%${filters.search}%`));
  }

  return query.orderBy(desc(applications.appliedDate));
}

export async function getApplicationById(id: number) {
  const result = await db
    .select()
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createApplication(data: Omit<NewApplication, "id" | "createdAt" | "updatedAt">) {
  const result = await db.insert(applications).values(data).returning();
  return result[0];
}

export async function updateApplication(id: number, data: Partial<Omit<NewApplication, "id" | "createdAt">>) {
  const result = await db
    .update(applications)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(applications.id, id))
    .returning();
  return result[0];
}

export async function deleteApplication(id: number) {
  await db.delete(applications).where(eq(applications.id, id));
}

export async function updateApplicationStatus(id: number, status: Status) {
  return updateApplication(id, { status });
}

export async function getDashboardStats() {
  const all = await db.select().from(applications);
  const total = all.length;
  const replies = all.filter((a) => ["replied", "interview", "offer"].includes(a.status)).length;
  const interviews = all.filter((a) => a.status === "interview").length;
  const offers = all.filter((a) => a.status === "offer").length;

  return {
    total,
    replies,
    interviews,
    offers,
    replyRate: total > 0 ? Math.round((replies / total) * 100) : 0,
    offerRate: total > 0 ? Math.round((offers / total) * 100) : 0,
  };
}

export async function getOverdueFollowUps() {
  const today = new Date().toISOString().split("T")[0];
  return db
    .select()
    .from(applications)
    .where(
      and(
        lte(applications.followUpDate, today),
        notInArray(applications.status, ["rejected", "offer", "ghosted"])
      )
    )
    .orderBy(applications.followUpDate);
}

export async function getAllApplicationsForExport() {
  return db.select().from(applications).orderBy(desc(applications.appliedDate));
}
