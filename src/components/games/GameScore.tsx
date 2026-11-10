"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Flame, Trophy } from "lucide-react";

interface GameScoreProps {
  round: number;
  totalRounds: number;
  score: number;
  streak?: number;
}

export function GameScore({
  round,
  totalRounds,
  score,
  streak = 0,
}: GameScoreProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
      {/* Round */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t.common.round}
        </span>
        <span className="font-mono font-black text-slate-800 text-sm">
          {round} / {totalRounds}
        </span>
      </div>

      {/* Streak (if active) */}
      {streak > 1 && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200 animate-bounce">
          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>
            {streak} {t.common.streak}
          </span>
        </div>
      )}

      {/* Score */}
      <div className="flex items-center gap-2">
        <Trophy className="w-4 h-4 text-red-600" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t.common.score}
        </span>
        <span className="font-mono font-black text-red-600 text-base">
          {score}
        </span>
      </div>
    </div>
  );
}

