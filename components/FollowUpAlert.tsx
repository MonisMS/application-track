import type { Application } from "@/db/schema";
import { markContactedAction } from "@/lib/actions";
import Link from "next/link";

function getUrgency(followUpDate: string): "overdue" | "today" {
  const today = new Date().toISOString().split("T")[0];
  return followUpDate < today ? "overdue" : "today";
}

export default function FollowUpAlert({ items }: { items: Application[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mb-6 border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-amber-700 dark:text-amber-400 font-semibold text-sm">
          Follow-ups due ({items.length})
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((app) => {
          const urgency = getUrgency(app.followUpDate!);
          return (
            <div
              key={app.id}
              className={`flex items-center justify-between text-sm rounded-md px-3 py-2 ${
                urgency === "overdue"
                  ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
              }`}
            >
              <span className="text-neutral-700 dark:text-neutral-300">
                <span className="font-medium">{app.companyName}</span>
                <span className="text-neutral-500 dark:text-neutral-500 ml-2">
                  {app.role}
                </span>
              </span>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium ${
                    urgency === "overdue"
                      ? "text-red-600 dark:text-red-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  {urgency === "overdue" ? "Overdue · " : "Today · "}
                  {app.followUpDate}
                </span>

                <form action={markContactedAction.bind(null, app.id)}>
                  <button
                    type="submit"
                    className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  >
                    Mark contacted
                  </button>
                </form>

                <Link
                  href={`/applications/${app.id}/edit`}
                  className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline"
                >
                  Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
