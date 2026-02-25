"use client";

import { deleteApplicationAction } from "@/lib/actions";

export default function DeleteButton({ id }: { id: number }) {
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
