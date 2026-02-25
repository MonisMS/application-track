import type { Status } from "@/db/schema";

const statusStyles: Record<Status, string> = {
  applied: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  dm_sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  replied: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  interview: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  offer: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  ghosted: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500",
};

const statusLabels: Record<Status, string> = {
  applied: "Applied",
  dm_sent: "DM Sent",
  replied: "Replied",
  interview: "Interview",
  rejected: "Rejected",
  offer: "Offer",
  ghosted: "Ghosted",
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
