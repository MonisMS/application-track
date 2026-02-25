"use client";

import { stageEnum, statusEnum } from "@/db/schema";
import type { Application } from "@/db/schema";
import { useActionState } from "react";

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

type Props = {
  action: FormAction;
  defaultValues?: Partial<Application>;
  submitLabel?: string;
};

export default function ApplicationForm({ action, defaultValues, submitLabel = "Save" }: Props) {
  const inputClass =
    "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-600";
  const labelClass = "block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1";

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div>
          <label className={labelClass}>Stage</label>
          <select name="stage" defaultValue={defaultValues?.stage ?? "unknown"} className={inputClass}>
            {stageEnum.map((s) => (
              <option key={s} value={s}>
                {stageLabels[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={defaultValues?.status ?? "applied"} className={inputClass}>
            {statusEnum.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Applied Date *</label>
          <input
            type="date"
            name="appliedDate"
            required
            defaultValue={defaultValues?.appliedDate ?? new Date().toISOString().split("T")[0]}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Follow-up Date</label>
          <input
            type="date"
            name="followUpDate"
            defaultValue={defaultValues?.followUpDate ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Contact Person</label>
          <input
            name="contactPerson"
            defaultValue={defaultValues?.contactPerson ?? ""}
            placeholder="e.g. Jane Smith (Founder)"
            className={inputClass}
          />
        </div>
      </div>
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
