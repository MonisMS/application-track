"use client";

import type { UserProfile } from "@/db/schema";

type FormAction = (formData: FormData) => Promise<void>;

type Props = {
  action: FormAction;
  defaultValues?: Partial<UserProfile>;
};

export default function ProfileForm({ action, defaultValues }: Props) {
  const inputClass =
    "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-600";
  const labelClass =
    "block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1";

  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Resume URL</label>
          <input
            type="url"
            name="resumeUrl"
            defaultValue={defaultValues?.resumeUrl ?? ""}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Portfolio URL</label>
          <input
            type="url"
            name="portfolioUrl"
            defaultValue={defaultValues?.portfolioUrl ?? ""}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>LinkedIn URL</label>
          <input
            type="url"
            name="linkedinUrl"
            defaultValue={defaultValues?.linkedinUrl ?? ""}
            placeholder="https://linkedin.com/in/..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>GitHub URL</label>
          <input
            type="url"
            name="githubUrl"
            defaultValue={defaultValues?.githubUrl ?? ""}
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Default follow-up delay (days)</label>
          <input
            type="number"
            name="defaultFollowUpDays"
            min={1}
            max={60}
            defaultValue={defaultValues?.defaultFollowUpDays ?? 7}
            className={inputClass}
          />
          <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
            Used when you click "Mark contacted" on a follow-up.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          Save Profile
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
