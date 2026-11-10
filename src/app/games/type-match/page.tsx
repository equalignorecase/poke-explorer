"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { GameHeader } from "@/components/games/GameHeader";
import { GameScore } from "@/components/games/GameScore";
import { GameResult } from "@/components/games/GameResult";
import { PokemonTypeBadge } from "@/components/pokemon/PokemonTypeBadge";
import { PokemonTypeName } from "@/lib/pokeapi/types";
import {
  POKEMON_TYPES,
  getTypeMultiplier,
} from "@/lib/games/typeRelations";
import { GameDifficulty } from "@/lib/games/engine";
import { Check, X, ArrowRight, ShieldCheck } from "lucide-react";

type MultiplierCategory = "super" | "normal" | "notVery" | "noEffect";

interface TypeQuestion {
  moveType: PokemonTypeName;
  defenderTypes: PokemonTypeName[];
  multiplier: number;
  category: MultiplierCategory;
}

export default function TypeMatchPage() {
  const { t } = useLanguage();
  const [difficulty, setDifficulty] = useState<GameDifficulty>("normal");
  const [round, setRound] = useState(1);
  const totalRounds = 10;
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [question, setQuestion] = useState<TypeQuestion | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<MultiplierCategory | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const choices: { category: MultiplierCategory; label: string; badge: string }[] = [
    { category: "super", label: t.games.typeMatch.superEffective, badge: "2x+" },
    { category: "normal", label: t.games.typeMatch.normalDamage, badge: "1x" },
    { category: "notVery", label: t.games.typeMatch.notVeryEffective, badge: "0.5x" },
    { category: "noEffect", label: t.games.typeMatch.noEffect, badge: "0x" },
  ];

  const generateQuestion = useCallback(() => {
    setIsAnswered(false);
    setSelectedChoice(null);

    const moveType = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
    const def1 = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];

    let defenderTypes: PokemonTypeName[] = [def1];

    if (difficulty === "hard") {
      // Pick a second distinct type
      let def2 = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
      while (def2 === def1) {
        def2 = POKEMON_TYPES[Math.floor(Math.random() * POKEMON_TYPES.length)];
      }
      defenderTypes = [def1, def2];
    }

    const multiplier = getTypeMultiplier(moveType, defenderTypes);

    let category: MultiplierCategory = "normal";
    if (multiplier >= 2) category = "super";
    else if (multiplier === 0) category = "noEffect";
    else if (multiplier < 1) category = "notVery";

    setQuestion({
      moveType,
      defenderTypes,
      multiplier,
      category,
    });
  }, [difficulty]);

  useEffect(() => {
    generateQuestion();
  }, [difficulty, generateQuestion]);

  const handleSelectChoice = (category: MultiplierCategory) => {
    if (isAnswered || !question) return;

    setSelectedChoice(category);
    setIsAnswered(true);

    if (category === question.category) {
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextRound = () => {
    if (round >= totalRounds) {
      setIsGameOver(true);
    } else {
      setRound((r) => r + 1);
      generateQuestion();
    }
  };

  const handleRestart = () => {
    setRound(1);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    generateQuestion();
  };

  if (isGameOver) {
    return (
      <GameResult
        score={score}
        maxScore={totalRounds * 10}
        totalRounds={totalRounds}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      <GameHeader
        title={t.games.typeMatch.title}
        subtitle={t.games.typeMatch.instruction}
        difficulty={difficulty}
        onDifficultyChange={(d) => {
          setDifficulty(d);
          handleRestart();
        }}
        disabled={isAnswered}
      />

      <GameScore
        round={round}
        totalRounds={totalRounds}
        score={score}
        streak={streak}
      />

      {question && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
          {/* Question Visualizer */}
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Type Matchup
            </span>

            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Attack Move
                </span>
                <PokemonTypeBadge type={question.moveType} size="lg" />
              </div>

              <div className="text-slate-300 font-bold px-2 text-xl">vs</div>

              <div className="flex flex-col items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Defending Pokémon
                </span>
                <div className="flex gap-1.5">
                  {question.defenderTypes.map((dt) => (
                    <PokemonTypeBadge key={dt} type={dt} size="lg" />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-700 max-w-md mx-auto">
              How effective is a{" "}
              <span className="font-bold uppercase text-red-600">
                {question.moveType}
              </span>
              -type move against a{" "}
              <span className="font-bold uppercase text-slate-900">
                {question.defenderTypes.join(" / ")}
              </span>{" "}
              Pokémon?
            </p>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {choices.map((c) => {
              let btnClass = "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800";
              if (isAnswered) {
                if (c.category === question.category) {
                  btnClass = "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200 font-bold";
                } else if (c.category === selectedChoice) {
                  btnClass = "bg-rose-50 border-rose-500 text-rose-800 line-through ring-2 ring-rose-200 font-bold";
                }
              }

              return (
                <button
                  key={c.category}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectChoice(c.category)}
                  className={`py-4 px-4 rounded-2xl border text-sm flex items-center justify-between transition-all cursor-pointer disabled:cursor-not-allowed shadow-xs ${btnClass}`}
                >
                  <div className="flex items-center gap-2">
                    <span>{c.label}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-400 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {c.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Post-answer feedback */}
          {isAnswered && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-600">
                  Exact Multiplier:{" "}
                  <strong className="text-slate-900 font-mono text-sm">
                    {question.multiplier}x
                  </strong>
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextRound}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <span>{round >= totalRounds ? "View Result" : t.common.next}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

