"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useLanguage } from "@/context/LanguageContext";
import { Trophy, RotateCcw, ArrowLeft } from "lucide-react";

interface GameResultProps {
  score: number;
  maxScore: number;
  totalRounds?: number;
  correctAnswers?: number;
  onRestart: () => void;
  customMessage?: string;
}

export function GameResult({
  score,
  maxScore,
  onRestart,
  customMessage,
}: GameResultProps) {
  const { t } = useLanguage();
  const accuracy = Math.round((score / maxScore) * 100) || 0;

  useEffect(() => {
    if (accuracy >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [accuracy]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm space-y-6 my-6">
      <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-sm">
        <Trophy className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {t.games.gameOver}
        </h2>
        {customMessage ? (
          <p className="text-xs text-slate-500 mt-1">{customMessage}</p>
        ) : (
          <p className="text-xs text-slate-500 mt-1">
            Challenge completed! Here is your performance summary:
          </p>
        )}
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {t.games.finalScore}
          </span>
          <p className="text-3xl font-black text-slate-900 font-mono mt-0.5">
            {score}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {t.games.accuracy}
          </span>
          <p className="text-3xl font-black text-red-600 font-mono mt-0.5">
            {accuracy}%
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.common.playAgain}</span>
        </button>

        <Link
          href="/games"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.games.backToGames}</span>
        </Link>
      </div>
    </div>
  );
}
