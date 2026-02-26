import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/queries";
import { updateProfileAction } from "@/lib/actions";
import ProfileForm from "@/components/ProfileForm";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await getUserProfile(session.user.id);

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-neutral-900 dark:text-white mt-2">
            Profile & Settings
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {session.user.email}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
            Links
          </h2>
          <ProfileForm action={updateProfileAction} defaultValues={profile ?? undefined} />
        </div>
      </div>
    </main>
  );
}
