"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface AnswerButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  state?: "default" | "correct" | "incorrect" | "selected";
  shortcutIndex?: number;
}

export function AnswerButton({
  label,
  onClick,
  disabled = false,
  state = "default",
  shortcutIndex,
}: AnswerButtonProps) {
  let stateClasses =
    "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700";

  if (state === "correct") {
    stateClasses =
      "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold ring-2 ring-emerald-200 dark:ring-emerald-900";
  } else if (state === "incorrect") {
    stateClasses =
      "bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200 font-bold line-through ring-2 ring-rose-200 dark:ring-rose-900";
  } else if (state === "selected") {
    stateClasses = "bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 text-slate-900 dark:text-white";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full py-3.5 px-4 rounded-2xl border text-sm font-semibold transition-all flex items-center justify-between cursor-pointer disabled:cursor-not-allowed shadow-xs ${stateClasses}`}
    >
      <div className="flex items-center gap-3">
        {shortcutIndex !== undefined && (
          <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-mono flex items-center justify-center font-bold">
            {shortcutIndex}
          </span>
        )}
        <span className="capitalize">{label}</span>
      </div>

      {state === "correct" && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
      {state === "incorrect" && <X className="w-4 h-4 text-rose-600 shrink-0" />}
    </button>
  );
}

