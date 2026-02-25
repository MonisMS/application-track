"use client";

import { useTransition } from "react";
import { updateStatusAction } from "@/lib/actions";
import { statusEnum } from "@/db/schema";
import type { Status } from "@/db/schema";

const statusLabels: Record<Status, string> = {
  applied: "Applied",
  dm_sent: "DM Sent",
  replied: "Replied",
  interview: "Interview",
  rejected: "Rejected",
  offer: "Offer",
  ghosted: "Ghosted",
};

const statusColors: Record<Status, string> = {
  applied: "text-neutral-600 dark:text-neutral-300",
  dm_sent: "text-blue-600 dark:text-blue-400",
  replied: "text-purple-600 dark:text-purple-400",
  interview: "text-yellow-600 dark:text-yellow-400",
  rejected: "text-red-600 dark:text-red-400",
  offer: "text-green-600 dark:text-green-400",
  ghosted: "text-gray-400 dark:text-gray-500",
};

export default function StatusSelect({ id, status }: { id: number; status: Status }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status;
    startTransition(() => {
      updateStatusAction(id, newStatus);
    });
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className={`bg-transparent border-0 text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-400 rounded px-1 py-0.5 ${statusColors[status]} ${isPending ? "opacity-50" : ""}`}
    >
      {statusEnum.map((s) => (
        <option key={s} value={s} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
          {statusLabels[s]}
        </option>
      ))}
    </select>
  );
}
