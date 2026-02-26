"use client";

import { useActionState, useRef, useTransition, useState } from "react";
import type { VaultSnippet } from "@/db/schema";
import {
  createSnippetAction,
  updateSnippetAction,
  deleteSnippetAction,
  type SnippetActionState,
} from "@/lib/vault-actions";
import CopyButton from "./CopyButton";

const inputClass =
  "w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-neutral-400 dark:placeholder:text-neutral-600";
const labelClass =
  "block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1";

const initial: SnippetActionState = { ok: false };

// ─── Add Snippet Form ─────────────────────────────────────────────────────────

function AddSnippetForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, isPending] = useActionState(
    async (prev: SnippetActionState, fd: FormData) => {
      const result = await createSnippetAction(prev, fd);
      if (result.ok) formRef.current?.reset();
      return result;
    },
    initial
  );
  const fe = state.fieldErrors ?? {};

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <div>
        <label className={labelClass}>Title *</label>
        <input
          name="title"
          required
          placeholder='e.g. "Backend intern pitch"'
          className={inputClass}
        />
        {fe.title && (
          <p className="text-xs text-red-500 mt-0.5">{fe.title[0]}</p>
        )}
      </div>
      <div>
        <label className={labelClass}>Content *</label>
        <textarea
          name="content"
          required
          rows={4}
          placeholder="Paste your reusable text here…"
          className={`${inputClass} resize-y`}
        />
        {fe.content && (
          <p className="text-xs text-red-500 mt-0.5">{fe.content[0]}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
      >
        {isPending ? "Adding…" : "Add Snippet"}
      </button>
    </form>
  );
}

// ─── Edit Snippet Form ────────────────────────────────────────────────────────

function EditSnippetForm({
  snippet,
  onCancel,
}: {
  snippet: VaultSnippet;
  onCancel: () => void;
}) {
  const boundAction = updateSnippetAction.bind(null, snippet.id);
  const [state, action, isPending] = useActionState(
    async (prev: SnippetActionState, fd: FormData) => {
      const result = await boundAction(prev, fd);
      if (result.ok) onCancel();
      return result;
    },
    initial
  );
  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-3 mt-2">
      <div>
        <label className={labelClass}>Title *</label>
        <input
          name="title"
          required
          defaultValue={snippet.title}
          className={inputClass}
        />
        {fe.title && (
          <p className="text-xs text-red-500 mt-0.5">{fe.title[0]}</p>
        )}
      </div>
      <div>
        <label className={labelClass}>Content *</label>
        <textarea
          name="content"
          required
          rows={4}
          defaultValue={snippet.content}
          className={`${inputClass} resize-y`}
        />
        {fe.content && (
          <p className="text-xs text-red-500 mt-0.5">{fe.content[0]}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-md transition-colors"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Snippet Card ─────────────────────────────────────────────────────────────

function SnippetCard({ snippet }: { snippet: VaultSnippet }) {
  const [editing, setEditing] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Delete "${snippet.title}"?`)) return;
    startDelete(() => deleteSnippetAction(snippet.id));
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
      {editing ? (
        <EditSnippetForm snippet={snippet} onCancel={() => setEditing(false)} />
      ) : (
        <>
          <div className="flex items-start justify-between gap-3 mb-2">
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              {snippet.title}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <CopyButton text={snippet.content} />
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "…" : "Delete"}
              </button>
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-pre-wrap line-clamp-3">
            {snippet.content}
          </p>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VaultSnippets({
  snippets,
}: {
  snippets: VaultSnippet[];
}) {
  return (
    <div className="space-y-4">
      {snippets.length === 0 ? (
        <p className="text-sm text-neutral-400 dark:text-neutral-600 py-4 text-center">
          No snippets yet — add one below.
        </p>
      ) : (
        <div className="space-y-3">
          {snippets.map((s) => (
            <SnippetCard key={s.id} snippet={s} />
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 mt-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3">
          Add Snippet
        </h4>
        <AddSnippetForm />
      </div>
    </div>
  );
}
