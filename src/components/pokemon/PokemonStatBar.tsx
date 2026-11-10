import React from "react";

interface PokemonStatBarProps {
  label: string;
  value: number;
  max?: number;
  highlight?: "higher" | "lower" | "equal" | "none";
}

export function PokemonStatBar({
  label,
  value,
  max = 255,
  highlight = "none",
}: PokemonStatBarProps) {
  const percentage = Math.min(100, Math.max(5, (value / max) * 100));

  let barColor = "bg-slate-400";
  if (value < 50) barColor = "bg-rose-500";
  else if (value < 80) barColor = "bg-amber-500";
  else if (value < 110) barColor = "bg-emerald-500";
  else barColor = "bg-cyan-500";

  let highlightClass = "";
  if (highlight === "higher") {
    highlightClass = "text-emerald-600 font-extrabold";
  } else if (highlight === "lower") {
    highlightClass = "text-slate-400 font-normal";
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-20 text-slate-500 font-medium shrink-0 truncate">
        {label}
      </span>
      <span className={`w-10 text-right font-mono font-bold shrink-0 ${highlightClass}`}>
        {value}
      </span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

