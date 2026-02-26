"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { statusEnum, sourceEnum } from "@/db/schema";
import type { Status, Source } from "@/db/schema";
import { useCallback } from "react";

const statusLabels: Record<Status, string> = {
  applied: "Applied",
  dm_sent: "DM Sent",
  replied: "Replied",
  interview: "Interview",
  rejected: "Rejected",
  offer: "Offer",
  ghosted: "Ghosted",
};

const sourceLabels: Record<Source, string> = {
  wellfound: "Wellfound",
  linkedin: "LinkedIn",
  referral: "Referral",
  twitter: "Twitter/X",
  cold_email: "Cold Email",
  other: "Other",
};

const selectClass =
  "px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500";

export default function SearchAndFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "";
  const source = searchParams.get("source") ?? "";
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "";

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Search company..."
        value={search}
        onChange={(e) => update("search", e.target.value)}
        className="px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 w-48"
      />

      <select
        value={status}
        onChange={(e) => update("status", e.target.value)}
        className={selectClass}
      >
        <option value="">All statuses</option>
        {statusEnum.enumValues.map((s) => (
          <option key={s} value={s}>
            {statusLabels[s]}
          </option>
        ))}
      </select>

      <select
        value={source}
        onChange={(e) => update("source", e.target.value)}
        className={selectClass}
      >
        <option value="">All sources</option>
        {sourceEnum.enumValues.map((s) => (
          <option key={s} value={s}>
            {sourceLabels[s]}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => update("sort", e.target.value)}
        className={selectClass}
      >
        <option value="">Applied date ↓</option>
        <option value="updatedAt">Last updated ↓</option>
      </select>
    </div>
  );
}
