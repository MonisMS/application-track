import { notFound } from "next/navigation";
import { getApplicationById } from "@/lib/queries";
import { updateApplicationAction } from "@/lib/actions";
import ApplicationForm from "@/components/ApplicationForm";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditApplicationPage({ params }: Props) {
  const { id } = await params;
  const app = await getApplicationById(Number(id));

  if (!app) notFound();

  const action = updateApplicationAction.bind(null, app.id);

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white mt-2">
            Edit — {app.companyName}
          </h1>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          <ApplicationForm action={action} defaultValues={app} submitLabel="Save Changes" />
        </div>
      </div>
    </main>
  );
}
