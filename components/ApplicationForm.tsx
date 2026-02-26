"use client";

import { stageEnum, statusEnum, sourceEnum } from "@/db/schema";
import type { Application } from "@/db/schema";

type FormAction = (formData: FormData) => Promise<void>;

const stageLabels: Record<string, string> = {
  "pre-seed": "Pre-seed",
  seed: "Seed",
  "series-a": "Series A",
  "series-b": "Series B",
  unknown: "Unknown",
};

const statusLabels: Record<string, string> = {
  applied: "Applied",
  dm_sent: "DM Sent",
  replied: "Replied",
  interview: "Interview",
  rejected: "Rejected",
  offer: "Offer",
  ghosted: "Ghosted",
};

const sourceLabels: Record<string, string> = {
  wellfound: "Wellfound",
  linkedin: "LinkedIn",
  referral: "Referral",
  twitter: "Twitter / X",
  cold_email: "Cold Email",
  other: "Other",
};

type Props = {
  action: FormAction;
  defaultValues?: Partial<Application>;
  submitLabel?: string;
};

export default function ApplicationForm({
  action,
  defaultValues,
  submitLabel = "Save",
}: Props) {
  const inputClass =
    "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-600";
  const labelClass =
    "block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1";

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Company */}
        <div>
          <label className={labelClass}>Company Name *</label>
          <input
            name="companyName"
            required
            defaultValue={defaultValues?.companyName ?? ""}
            placeholder="e.g. Acme Inc."
            className={inputClass}
          />
        </div>

        {/* Role */}
        <div>
          <label className={labelClass}>Role *</label>
          <input
            name="role"
            required
            defaultValue={defaultValues?.role ?? ""}
            placeholder="e.g. Software Engineer Intern"
            className={inputClass}
          />
        </div>

        {/* Stage */}
        <div>
          <label className={labelClass}>Stage</label>
          <select
            name="stage"
            defaultValue={defaultValues?.stage ?? "unknown"}
            className={inputClass}
          >
            {stageEnum.enumValues.map((s) => (
              <option key={s} value={s}>
                {stageLabels[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className={labelClass}>Status</label>
          <select
            name="status"
            defaultValue={defaultValues?.status ?? "applied"}
            className={inputClass}
          >
            {statusEnum.enumValues.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className={labelClass}>Source</label>
          <select
            name="source"
            defaultValue={defaultValues?.source ?? "other"}
            className={inputClass}
          >
            {sourceEnum.enumValues.map((s) => (
              <option key={s} value={s}>
                {sourceLabels[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Applied Date */}
        <div>
          <label className={labelClass}>Applied Date *</label>
          <input
            type="date"
            name="appliedDate"
            required
            defaultValue={
              defaultValues?.appliedDate ?? new Date().toISOString().split("T")[0]
            }
            className={inputClass}
          />
        </div>

        {/* Job URL */}
        <div>
          <label className={labelClass}>Job URL</label>
          <input
            type="url"
            name="jobUrl"
            defaultValue={defaultValues?.jobUrl ?? ""}
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        {/* Follow-up Date */}
        <div>
          <label className={labelClass}>Follow-up Date</label>
          <input
            type="date"
            name="followUpDate"
            defaultValue={defaultValues?.followUpDate ?? ""}
            className={inputClass}
          />
        </div>

        {/* Contact Person */}
        <div>
          <label className={labelClass}>Contact Person</label>
          <input
            name="contactPerson"
            defaultValue={defaultValues?.contactPerson ?? ""}
            placeholder="e.g. Jane Smith (Founder)"
            className={inputClass}
          />
        </div>

        {/* Contact URL */}
        <div>
          <label className={labelClass}>Contact URL</label>
          <input
            type="url"
            name="contactUrl"
            defaultValue={defaultValues?.contactUrl ?? ""}
            placeholder="https://linkedin.com/in/..."
            className={inputClass}
          />
        </div>

        {/* Last Contacted */}
        <div>
          <label className={labelClass}>Last Contacted</label>
          <input
            type="date"
            name="lastContactedAt"
            defaultValue={defaultValues?.lastContactedAt ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes</label>
        <textarea
          name="notes"
          rows={4}
          defaultValue={defaultValues?.notes ?? ""}
          placeholder="Any context, links, talking points..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          {submitLabel}
        </button>
        <a
          href="/"
          className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
