import { getAllApplicationsForExport } from "@/lib/queries";

export async function GET() {
  const apps = await getAllApplicationsForExport();

  const headers = [
    "ID",
    "Company",
    "Role",
    "Stage",
    "Status",
    "Applied Date",
    "Follow-up Date",
    "Contact Person",
    "Notes",
    "Created At",
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
      a.appliedDate,
      a.followUpDate,
      a.contactPerson,
      a.notes,
      a.createdAt,
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
