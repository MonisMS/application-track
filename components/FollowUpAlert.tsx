import type { Application } from "@/db/schema";
import Link from "next/link";

export default function FollowUpAlert({ items }: { items: Application[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mb-6 border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-yellow-600 dark:text-yellow-400 font-semibold text-sm">
          ⚠ Follow-ups due ({items.length})
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((app) => (
          <div key={app.id} className="flex items-center justify-between text-sm">
            <span className="text-neutral-700 dark:text-neutral-300">
              <span className="font-medium">{app.companyName}</span>
              <span className="text-neutral-500 dark:text-neutral-500 ml-2">{app.role}</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-yellow-600 dark:text-yellow-500 text-xs">{app.followUpDate}</span>
              <Link
                href={`/applications/${app.id}/edit`}
                className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
