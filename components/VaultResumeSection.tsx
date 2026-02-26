"use client";

import { useActionState, useTransition } from "react";
import {
  uploadResumeAction,
  deleteResumeAction,
  type ResumeActionState,
} from "@/lib/vault-actions";
import type { UserProfile } from "@/db/schema";

const initial: ResumeActionState = { ok: false };

export default function VaultResumeSection({
  profile,
  hasFileStorage,
}: {
  profile: UserProfile | null;
  hasFileStorage: boolean;
}) {
  const [uploadState, uploadAction, isUploading] = useActionState(
    uploadResumeAction,
    initial
  );
  const [isDeleting, startDelete] = useTransition();

  const hasFile = !!(profile?.resumeFileKey && profile.resumeFileName);

  return (
    <div className="space-y-4">
      {/* Current file */}
      {hasFile ? (
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <div className="text-sm">
            <p className="font-medium text-neutral-900 dark:text-white">
              {profile!.resumeFileName}
            </p>
            {profile!.resumeUploadedAt && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Uploaded{" "}
                {new Date(profile!.resumeUploadedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/vault/resume"
              className="text-xs px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Download
            </a>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => {
                if (!confirm("Remove resume file?")) return;
                startDelete(async () => { await deleteResumeAction(); });
              }}
              className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? "Removing…" : "Remove"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-neutral-400 dark:text-neutral-600 py-2">
          No resume file uploaded.
        </p>
      )}

      {/* Upload (only if Vercel Blob is configured) */}
      {hasFileStorage ? (
        <form action={uploadAction} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              {hasFile ? "Replace file" : "Upload resume"} (PDF or DOCX, max 5 MB)
            </label>
            <input
              type="file"
              name="resume"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              required
              className="block text-sm text-neutral-600 dark:text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-100 dark:file:bg-neutral-800 file:text-neutral-700 dark:file:text-neutral-300 hover:file:bg-neutral-200 dark:hover:file:bg-neutral-700 file:transition-colors"
            />
          </div>
          {uploadState.error && (
            <p className="text-xs text-red-500">{uploadState.error}</p>
          )}
          {uploadState.ok && (
            <p className="text-xs text-green-600 dark:text-green-400">
              Resume uploaded!
            </p>
          )}
          <button
            type="submit"
            disabled={isUploading}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
          >
            {isUploading ? "Uploading…" : hasFile ? "Replace" : "Upload"}
          </button>
        </form>
      ) : (
        <p className="text-xs text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md px-3 py-2">
          File upload is not configured. Add{" "}
          <code className="font-mono">BLOB_READ_WRITE_TOKEN</code> to your
          environment to enable it, or use the Resume URL field above.
        </p>
      )}
    </div>
  );
}
