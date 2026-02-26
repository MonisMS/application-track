"use client";

import { useState } from "react";
import { setFollowUpAction } from "@/lib/actions";

export default function QuickFollowUpClient({
  id,
  followUpDate,
}: {
  id: number;
  followUpDate: string | null;
}) {
  const [open, setOpen] = useState(false);
  const boundAction = setFollowUpAction.bind(null, id);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
      >
        {followUpDate ?? "Set date"}
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        await boundAction(formData);
        setOpen(false);
      }}
      className="flex items-center gap-1"
    >
      <input
        type="date"
        name="followUpDate"
        defaultValue={followUpDate ?? ""}
        autoFocus
        className="text-xs px-1.5 py-0.5 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="text-xs text-blue-500 hover:text-blue-600 font-medium px-1"
      >
        ✓
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xs text-neutral-400 hover:text-neutral-600 px-1"
      >
        ✕
      </button>
    </form>
  );
}
