"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  upsertUserProfile,
  getUserProfile,
  createSnippet,
  updateSnippet,
  deleteSnippet,
} from "./queries";
import { vaultSchema, snippetSchema } from "./vault-schemas";
import { put, del } from "@vercel/blob";

async function requireUserId(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/login");
  return id;
}

// ─── Vault Profile ────────────────────────────────────────────────────────────

export type VaultActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function updateVaultAction(
  _prev: VaultActionState,
  formData: FormData
): Promise<VaultActionState> {
  const userId = await requireUserId();

  const raw = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    location: formData.get("location") as string,
    portfolioUrl: formData.get("portfolioUrl") as string,
    githubUrl: formData.get("githubUrl") as string,
    linkedinUrl: formData.get("linkedinUrl") as string,
    twitterUrl: formData.get("twitterUrl") as string,
    resumeUrl: formData.get("resumeUrl") as string,
    defaultFollowUpDays: formData.get("defaultFollowUpDays") as string,
  };

  const parsed = vaultSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  await upsertUserProfile(userId, parsed.data);
  revalidatePath("/vault");
  return { ok: true };
}

// ─── Snippets ─────────────────────────────────────────────────────────────────

export type SnippetActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createSnippetAction(
  _prev: SnippetActionState,
  formData: FormData
): Promise<SnippetActionState> {
  const userId = await requireUserId();

  const parsed = snippetSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  await createSnippet(userId, parsed.data);
  revalidatePath("/vault");
  return { ok: true };
}

export async function updateSnippetAction(
  id: string,
  _prev: SnippetActionState,
  formData: FormData
): Promise<SnippetActionState> {
  const userId = await requireUserId();

  const parsed = snippetSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  await updateSnippet(id, userId, parsed.data);
  revalidatePath("/vault");
  return { ok: true };
}

export async function deleteSnippetAction(id: string) {
  const userId = await requireUserId();
  await deleteSnippet(id, userId);
  revalidatePath("/vault");
}

// ─── Resume File (Vercel Blob) ────────────────────────────────────────────────

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export type ResumeActionState = { ok: boolean; error?: string };

export async function uploadResumeAction(
  _prev: ResumeActionState,
  formData: FormData
): Promise<ResumeActionState> {
  const userId = await requireUserId();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: "File storage not configured." };
  }

  const file = formData.get("resume") as File | null;
  if (!file || file.size === 0) return { ok: false, error: "No file selected." };
  if (file.size > MAX_BYTES) return { ok: false, error: "File exceeds 5 MB limit." };
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: "Only PDF and DOCX files are allowed." };
  }

  // Delete previous file from blob storage
  const existing = await getUserProfile(userId);
  if (existing?.resumeFileKey) {
    try {
      await del(existing.resumeFileKey);
    } catch {
      // Non-fatal: old file may already be gone
    }
  }

  // Store with an unguessable path
  const ext = file.type === "application/pdf" ? "pdf" : "docx";
  const blobPath = `resumes/${userId}/${crypto.randomUUID()}.${ext}`;
  const blob = await put(blobPath, file, {
    access: "public",
    contentType: file.type,
  });

  await upsertUserProfile(userId, {
    resumeFileKey: blob.url,
    resumeFileName: file.name,
    resumeMimeType: file.type,
    resumeUploadedAt: new Date(),
  });

  revalidatePath("/vault");
  return { ok: true };
}

export async function deleteResumeAction(): Promise<ResumeActionState> {
  const userId = await requireUserId();

  const profile = await getUserProfile(userId);
  if (profile?.resumeFileKey) {
    try {
      await del(profile.resumeFileKey);
    } catch {
      // Non-fatal
    }
  }

  await upsertUserProfile(userId, {
    resumeFileKey: null,
    resumeFileName: null,
    resumeMimeType: null,
    resumeUploadedAt: null,
  });

  revalidatePath("/vault");
  return { ok: true };
}
