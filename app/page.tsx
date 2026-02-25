import { Suspense } from "react";
import { getAllApplications, getDashboardStats, getOverdueFollowUps } from "@/lib/queries";
import DashboardStats from "@/components/DashboardStats";
import ApplicationTable from "@/components/ApplicationTable";
import FollowUpAlert from "@/components/FollowUpAlert";
import SearchAndFilter from "@/components/SearchAndFilter";
import Link from "next/link";
import ThemeToggleClient from "@/components/ThemeToggleClient";
import type { Status } from "@/db/schema";

type PageProps = {
  searchParams: Promise<{ status?: string; search?: string }>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const [stats, followUps, apps] = await Promise.all([
    getDashboardStats(),
    getOverdueFollowUps(),
    getAllApplications({
      status: params.status as Status | undefined,
      search: params.search,
    }),
  ]);

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Internship CRM</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-0.5">Track your applications</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/export"
              className="px-3 py-1.5 rounded-md text-sm border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              ↓ CSV
            </a>
            <ThemeToggleClient />
            <Link
              href="/applications/new"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              + Add
            </Link>
          </div>
        </div>

        {/* Stats */}
        <DashboardStats stats={stats} />

        {/* Follow-up alerts */}
        <FollowUpAlert items={followUps} />

        {/* Search + filter */}
        <Suspense>
          <SearchAndFilter />
        </Suspense>

        {/* Table */}
        <ApplicationTable applications={apps} />
      </div>
    </main>
  );
}
