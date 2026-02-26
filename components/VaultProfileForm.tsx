"use client";

import { useActionState } from "react";
import type { UserProfile } from "@/db/schema";
import type { VaultActionState } from "@/lib/vault-actions";
import { updateVaultAction } from "@/lib/vault-actions";
import CopyButton from "./CopyButton";

const inputClass =
  "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-600";
const labelClass =
  "block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1";
const errorClass = "text-xs text-red-500 mt-0.5";

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  error,
  copyValue,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | null;
  placeholder?: string;
  error?: string[];
  copyValue?: string | null;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          name={name}
          type={type}
          defaultValue={defaultValue ?? ""}
          placeholder={placeholder}
          className={inputClass}
        />
        {copyValue && <CopyButton text={copyValue} />}
      </div>
      {error && <p className={errorClass}>{error[0]}</p>}
    </div>
  );
}

function buildCopyAll(v: Partial<UserProfile>): string {
  const lines: string[] = [];
  if (v.fullName) lines.push(`Name: ${v.fullName}`);
  if (v.instituteName) lines.push(`Institute: ${v.instituteName}`);
  if (v.email) lines.push(`Email: ${v.email}`);
  if (v.phone) lines.push(`Phone: ${v.phone}`);
  if (v.location) lines.push(`Location: ${v.location}`);
  if (v.portfolioUrl) lines.push(`Portfolio: ${v.portfolioUrl}`);
  if (v.githubUrl) lines.push(`GitHub: ${v.githubUrl}`);
  if (v.linkedinUrl) lines.push(`LinkedIn: ${v.linkedinUrl}`);
  if (v.twitterUrl) lines.push(`Twitter: ${v.twitterUrl}`);
  if (v.resumeUrl) lines.push(`Resume: ${v.resumeUrl}`);
  return lines.join("\n");
}

const initial: VaultActionState = { ok: false };

export default function VaultProfileForm({
  defaultValues,
}: {
  defaultValues: UserProfile | null;
}) {
  const [state, action, isPending] = useActionState(updateVaultAction, initial);
  const v = defaultValues;
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-6">
      {/* Identity */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
          Identity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Full Name"
            name="fullName"
            defaultValue={v?.fullName}
            placeholder="Jane Smith"
            error={fe.fullName}
            copyValue={v?.fullName}
          />
          <Field
            label="Institute / University"
            name="instituteName"
            defaultValue={v?.instituteName}
            placeholder="MIT, Stanford, etc."
            error={fe.instituteName}
            copyValue={v?.instituteName}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            defaultValue={v?.email}
            placeholder="jane@example.com"
            error={fe.email}
            copyValue={v?.email}
          />
          <Field
            label="Phone"
            name="phone"
            defaultValue={v?.phone}
            placeholder="+1 555 000 0000"
            error={fe.phone}
            copyValue={v?.phone}
          />
          <Field
            label="Location"
            name="location"
            defaultValue={v?.location}
            placeholder="San Francisco, CA"
            error={fe.location}
            copyValue={v?.location}
          />
        </div>
      </div>

      {/* Links */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
          Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Portfolio"
            name="portfolioUrl"
            type="url"
            defaultValue={v?.portfolioUrl}
            placeholder="https://yoursite.com"
            error={fe.portfolioUrl}
            copyValue={v?.portfolioUrl}
          />
          <Field
            label="GitHub"
            name="githubUrl"
            type="url"
            defaultValue={v?.githubUrl}
            placeholder="https://github.com/..."
            error={fe.githubUrl}
            copyValue={v?.githubUrl}
          />
          <Field
            label="LinkedIn"
            name="linkedinUrl"
            type="url"
            defaultValue={v?.linkedinUrl}
            placeholder="https://linkedin.com/in/..."
            error={fe.linkedinUrl}
            copyValue={v?.linkedinUrl}
          />
          <Field
            label="Twitter / X"
            name="twitterUrl"
            type="url"
            defaultValue={v?.twitterUrl}
            placeholder="https://x.com/..."
            error={fe.twitterUrl}
            copyValue={v?.twitterUrl}
          />
          <Field
            label="Resume URL (link fallback)"
            name="resumeUrl"
            type="url"
            defaultValue={v?.resumeUrl}
            placeholder="https://drive.google.com/..."
            error={fe.resumeUrl}
            copyValue={v?.resumeUrl}
          />
        </div>
      </div>

      {/* Settings */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
          Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Default follow-up delay (days)
            </label>
            <input
              name="defaultFollowUpDays"
              type="number"
              min={1}
              max={30}
              defaultValue={v?.defaultFollowUpDays ?? 7}
              className={inputClass}
            />
            <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
              Auto-applied when creating a new application without a follow-up date.
            </p>
            {fe.defaultFollowUpDays && (
              <p className={errorClass}>{fe.defaultFollowUpDays[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Copy All + Save */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
        >
          {isPending ? "Saving…" : "Save"}
        </button>

        {v && buildCopyAll(v).trim() && (
          <CopyButton
            text={buildCopyAll(v)}
            label="Copy All"
            className="!px-3 !py-1.5 !text-sm"
          />
        )}

        {state.ok && (
          <span className="text-sm text-green-600 dark:text-green-400">
            Saved!
          </span>
        )}
        {state.error && (
          <span className="text-sm text-red-500">{state.error}</span>
        )}
      </div>
    </form>
  );
}
