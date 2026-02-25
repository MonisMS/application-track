"use server";

import { revalidatePath } from "next/cache";
import {
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus,
} from "./queries";
import type { Status, Stage } from "@/db/schema";
import { redirect } from "next/navigation";

export async function createApplicationAction(formData: FormData) {
  const data = {
    companyName: formData.get("companyName") as string,
    role: formData.get("role") as string,
    stage: formData.get("stage") as Stage,
    appliedDate: formData.get("appliedDate") as string,
    status: (formData.get("status") as Status) ?? "applied",
    contactPerson: (formData.get("contactPerson") as string) || null,
    followUpDate: (formData.get("followUpDate") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  await createApplication(data);
  revalidatePath("/");
  redirect("/");
}

export async function updateApplicationAction(id: number, formData: FormData) {
  const data = {
    companyName: formData.get("companyName") as string,
    role: formData.get("role") as string,
    stage: formData.get("stage") as Stage,
    appliedDate: formData.get("appliedDate") as string,
    status: formData.get("status") as Status,
    contactPerson: (formData.get("contactPerson") as string) || null,
    followUpDate: (formData.get("followUpDate") as string) || null,
    notes: (formData.get("notes") as string) || null,
  };

  await updateApplication(id, data);
  revalidatePath("/");
  redirect("/");
}

export async function deleteApplicationAction(id: number) {
  await deleteApplication(id);
  revalidatePath("/");
}

export async function updateStatusAction(id: number, status: Status) {
  await updateApplicationStatus(id, status);
  revalidatePath("/");
}
