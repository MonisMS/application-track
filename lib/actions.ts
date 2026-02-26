"use server";

import { revalidatePath } from "next/cache";
import {
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
  getUserProfile,
} from "./queries";
import type { Status, Stage, Source } from "@/db/schema";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

async function requireUserId(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/login");
  return id;
}

function sanitizeUrl(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return raw;
  } catch {
    // invalid URL — ignore
  }
  return null;
}

export async function createApplicationAction(formData: FormData) {
  const userId = await requireUserId();

  const appliedDate = formData.get("appliedDate") as string;
  let followUpDate = (formData.get("followUpDate") as string) || null;

  // Auto-set follow-up date from vault setting if user left it blank
  if (!followUpDate && appliedDate) {
    const profile = await getUserProfile(userId);
    const days = profile?.defaultFollowUpDays ?? 7;
    const d = new Date(appliedDate);
    d.setDate(d.getDate() + days);
    followUpDate = d.toISOString().split("T")[0];
  }

  const data = {
    userId,
    companyName: formData.get("companyName") as string,
    role: formData.get("role") as string,
    stage: formData.get("stage") as Stage,
    appliedDate,
    status: (formData.get("status") as Status) ?? "applied",
    source: (formData.get("source") as Source) || "other",
    jobUrl: sanitizeUrl(formData.get("jobUrl") as string),
    contactPerson: (formData.get("contactPerson") as string) || null,
    contactUrl: sanitizeUrl(formData.get("contactUrl") as string),
    lastContactedAt: (formData.get("lastContactedAt") as string) || null,
    followUpDate,
    notes: (formData.get("notes") as string) || null,
  };

  await createApplication(data);
  revalidatePath("/");
  redirect("/");
}

export async function updateApplicationAction(id: number, formData: FormData) {
  const userId = await requireUserId();

  const data = {
    companyName: formData.get("companyName") as string,
    role: formData.get("role") as string,
    stage: formData.get("stage") as Stage,
    appliedDate: formData.get("appliedDate") as string,
    status: formData.get("status") as Status,
    source: (formData.get("source") as Source) || "other",
    jobUrl: sanitizeUrl(formData.get("jobUrl") as string),
    contactPerson: (formData.get("contactPerson") as string) || null,
    contactUrl: sanitizeUrl(formData.get("contactUrl") as string),
    lastContactedAt: (formData.get("lastContactedAt") as string) || null,
    followUpDate: (formData.get("followUpDate") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  await updateApplication(id, userId, data);
  revalidatePath("/");
  redirect("/");
}

export async function deleteApplicationAction(id: number) {
  const userId = await requireUserId();
  await deleteApplication(id, userId);
  revalidatePath("/");
}

export async function updateStatusAction(id: number, status: Status) {
  const userId = await requireUserId();
  await updateApplicationStatus(id, userId, status);
  revalidatePath("/");
}

export async function setFollowUpAction(id: number, formData: FormData) {
  const userId = await requireUserId();
  const date = (formData.get("followUpDate") as string) || null;
  await updateApplication(id, userId, { followUpDate: date });
  revalidatePath("/");
}

export async function markContactedAction(id: number) {
  const userId = await requireUserId();
  const today = new Date().toISOString().split("T")[0];

  const profile = await getUserProfile(userId);
  const days = profile?.defaultFollowUpDays ?? 7;

  const d = new Date();
  d.setDate(d.getDate() + days);
  const newFollowUpDate = d.toISOString().split("T")[0];

  await updateApplication(id, userId, {
    lastContactedAt: today,
    followUpDate: newFollowUpDate,
  });
  revalidatePath("/");
}

