"use client";

import { useState } from "react";

type State = "idle" | "copied" | "error";

export default function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [state, setState] = useState<State>("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      // Fallback for restricted environments
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setState("copied");
      } catch {
        setState("error");
      }
    }
    setTimeout(() => setState("idle"), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={label}
      className={`shrink-0 text-xs px-2 py-0.5 rounded transition-colors ${
        state === "copied"
          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          : state === "error"
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
      } ${className}`}
    >
      {state === "copied" ? "Copied!" : state === "error" ? "Failed" : label}
    </button>
  );
}
