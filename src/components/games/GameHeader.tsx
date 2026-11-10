"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { GameDifficulty } from "@/lib/games/engine";

interface GameHeaderProps {
  title: string;
  subtitle: string;
  difficulty?: GameDifficulty;
  onDifficultyChange?: (diff: GameDifficulty) => void;
  disabled?: boolean;
}

export function GameHeader({
  title,
  subtitle,
  difficulty,
  onDifficultyChange,
  disabled = false,
}: GameHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
      <div>
        <Link
          href="/games"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t.games.backToGames}</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {subtitle}
        </p>
      </div>

      {difficulty && onDifficultyChange && (
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-xs self-start sm:self-auto">
          {(["easy", "normal", "hard"] as GameDifficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              disabled={disabled}
              onClick={() => onDifficultyChange(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                difficulty === d
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t.games.difficulty[d]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

