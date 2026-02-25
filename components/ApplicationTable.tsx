import type { Application } from "@/db/schema";
import StatusSelect from "./StatusSelect";
import Link from "next/link";
import { deleteApplicationAction } from "@/lib/actions";

const stageLabels: Record<string, string> = {
  "pre-seed": "Pre-seed",
  seed: "Seed",
  "series-a": "Series A",
  "series-b": "Series B",
  unknown: "Unknown",
};

function DeleteButton({ id }: { id: number }) {
  return (
    <form action={deleteApplicationAction.bind(null, id)}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("Delete this application?")) e.preventDefault();
        }}
        className="text-xs text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-400"
      >
        Delete
      </button>
    </form>
  );
}

export default function ApplicationTable({ applications }: { applications: Application[] }) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-400 dark:text-neutral-600 text-sm">
        No applications yet.{" "}
        <Link href="/applications/new" className="text-blue-500 hover:underline">
          Add one
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
            <th className="text-left px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Company</th>
            <th className="text-left px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Role</th>
            <th className="text-left px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Stage</th>
            <th className="text-left px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Status</th>
            <th className="text-left px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Applied</th>
            <th className="text-left px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Follow-up</th>
            <th className="text-left px-4 py-3 font-medium text-neutral-500 dark:text-neutral-400">Contact</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {applications.map((app) => (
            <tr
              key={app.id}
              className="bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">
                {app.companyName}
              </td>
              <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{app.role}</td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-500 text-xs">
                {stageLabels[app.stage] ?? app.stage}
              </td>
              <td className="px-4 py-3">
                <StatusSelect id={app.id} status={app.status} />
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-500 text-xs">{app.appliedDate}</td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-500 text-xs">
                {app.followUpDate ?? "—"}
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-500 text-xs">
                {app.contactPerson ?? "—"}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/applications/${app.id}/edit`}
                    className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={app.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
