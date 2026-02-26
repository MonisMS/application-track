import { db } from "./db";
import { applications, userProfiles } from "@/db/schema";
import { eq, desc, ilike, lte, and, notInArray, isNotNull } from "drizzle-orm";
import type { NewApplication, Status, Source, UserProfile } from "@/db/schema";

export async function getAllApplications(
  userId: string,
  filters?: {
    status?: Status;
    source?: Source;
    search?: string;
    sort?: "appliedDate" | "updatedAt";
  }
) {
  let query = db
    .select()
    .from(applications)
    .where(eq(applications.userId, userId))
    .$dynamic();

  const conditions = [eq(applications.userId, userId)];

  if (filters?.status) {
    conditions.push(eq(applications.status, filters.status));
  }
  if (filters?.source) {
    conditions.push(eq(applications.source, filters.source));
  }
  if (filters?.search) {
    conditions.push(ilike(applications.companyName, `%${filters.search}%`));
  }

  query = db
    .select()
    .from(applications)
    .where(and(...conditions))
    .$dynamic();

  const orderCol =
    filters?.sort === "updatedAt" ? applications.updatedAt : applications.appliedDate;

  return query.orderBy(desc(orderCol));
}

export async function getApplicationById(id: number, userId: string) {
  const result = await db
    .select()
    .from(applications)
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))
    .limit(1);
  return result[0] ?? null;
}

export async function createApplication(
  data: Omit<NewApplication, "id" | "createdAt" | "updatedAt">
) {
  const result = await db.insert(applications).values(data).returning();
  return result[0];
}

export async function updateApplication(
  id: number,
  userId: string,
  data: Partial<Omit<NewApplication, "id" | "createdAt">>
) {
  const result = await db
    .update(applications)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(applications.id, id), eq(applications.userId, userId)))
    .returning();
  return result[0];
}

export async function deleteApplication(id: number, userId: string) {
  await db
    .delete(applications)
    .where(and(eq(applications.id, id), eq(applications.userId, userId)));
}

export async function updateApplicationStatus(
  id: number,
  userId: string,
  status: Status
) {
  return updateApplication(id, userId, { status });
}

export async function getDashboardStats(userId: string) {
  const all = await db
    .select()
    .from(applications)
    .where(eq(applications.userId, userId));
  const total = all.length;
  const replies = all.filter((a) =>
    ["replied", "interview", "offer"].includes(a.status)
  ).length;
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

export async function getOverdueFollowUps(userId: string) {
  const today = new Date().toISOString().split("T")[0];
  return db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.userId, userId),
        isNotNull(applications.followUpDate),
        lte(applications.followUpDate, today),
        notInArray(applications.status, ["rejected", "offer", "ghosted"])
      )
    )
    .orderBy(applications.followUpDate);
}

export async function getAllApplicationsForExport(userId: string) {
  return db
    .select()
    .from(applications)
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.appliedDate));
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const result = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);
  return result[0] ?? null;
}

export async function upsertUserProfile(
  userId: string,
  data: Partial<Omit<UserProfile, "id" | "userId" | "updatedAt">>
) {
  const result = await db
    .insert(userProfiles)
    .values({ userId, ...data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: userProfiles.userId,
      set: { ...data, updatedAt: new Date() },
    })
    .returning();
  return result[0];
}
