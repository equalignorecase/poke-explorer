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
  let stateClasses = "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300";

  if (state === "correct") {
    stateClasses = "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-2 ring-emerald-200";
  } else if (state === "incorrect") {
    stateClasses = "bg-rose-50 border-rose-500 text-rose-800 font-bold line-through ring-2 ring-rose-200";
  } else if (state === "selected") {
    stateClasses = "bg-slate-100 border-slate-400 text-slate-900";
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
          <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 text-[11px] font-mono flex items-center justify-center font-bold">
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

