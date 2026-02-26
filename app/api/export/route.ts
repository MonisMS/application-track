import { getAllApplicationsForExport } from "@/lib/queries";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const apps = await getAllApplicationsForExport(session.user.id);

  const headers = [
    "ID",
    "Company",
    "Role",
    "Stage",
    "Status",
    "Source",
    "Applied Date",
    "Job URL",
    "Follow-up Date",
    "Contact Person",
    "Contact URL",
    "Last Contacted",
    "Notes",
    "Created At",
    "Updated At",
  ];

  const escape = (val: unknown) => {
    if (val == null) return "";
    const str = val instanceof Date ? val.toISOString() : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = apps.map((a) =>
    [
      a.id,
      a.companyName,
      a.role,
      a.stage,
      a.status,
      a.source,
      a.appliedDate,
      a.jobUrl,
      a.followUpDate,
      a.contactPerson,
      a.contactUrl,
      a.lastContactedAt,
      a.notes,
      a.createdAt,
      a.updatedAt,
    ]
      .map(escape)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="applications-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
