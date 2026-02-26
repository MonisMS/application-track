import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserProfile, getSnippets } from "@/lib/queries";
import VaultProfileForm from "@/components/VaultProfileForm";
import VaultSnippets from "@/components/VaultSnippets";
import VaultResumeSection from "@/components/VaultResumeSection";
import Link from "next/link";

export default async function VaultPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [profile, snippets] = await Promise.all([
    getUserProfile(userId),
    getSnippets(userId),
  ]);

  const hasFileStorage = !!process.env.BLOB_READ_WRITE_TOKEN;

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link
              href="/"
              className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              ← Dashboard
            </Link>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white mt-2">
              Quick Apply Vault
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Your identity, links, and reusable snippets — ready to copy in one
              click.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column — Profile + Resume (wider) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Identity & Links */}
            <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-5">
                Identity & Links
              </h2>
              <VaultProfileForm defaultValues={profile} />
            </section>

            {/* Resume */}
            <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Resume
              </h2>
              <VaultResumeSection
                profile={profile}
                hasFileStorage={hasFileStorage}
              />
            </section>
          </div>

          {/* Right column — Snippets */}
          <div className="lg:col-span-2">
            <section>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                Snippets
              </h2>
              <VaultSnippets snippets={snippets} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
