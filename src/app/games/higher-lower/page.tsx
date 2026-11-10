"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { GameHeader } from "@/components/games/GameHeader";
import { GameScore } from "@/components/games/GameScore";
import { GameResult } from "@/components/games/GameResult";
import { PokemonArtwork } from "@/components/pokemon/PokemonArtwork";
import { PokemonDetailData } from "@/lib/pokeapi/types";
import { getRandomPokemonId } from "@/lib/games/engine";
import { capitalize, formatPokemonId, getDisplayName } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Loader2,
  Check,
  X,
  HelpCircle,
} from "lucide-react";

type StatKey = "hp" | "attack" | "defense" | "specialAttack" | "specialDefense" | "speed" | "total";

const STAT_CONFIGS: { key: StatKey; label: string }[] = [
  { key: "hp", label: "HP" },
  { key: "attack", label: "Attack" },
  { key: "defense", label: "Defense" },
  { key: "specialAttack", label: "Sp. Atk" },
  { key: "specialDefense", label: "Sp. Def" },
  { key: "speed", label: "Speed" },
  { key: "total", label: "Total Base Stats" },
];

export default function HigherLowerPage() {
  const { t } = useLanguage();
  const [round, setRound] = useState(1);
  const totalRounds = 10;
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [activeStat, setActiveStat] = useState<typeof STAT_CONFIGS[0]>(STAT_CONFIGS[0]);
  const [pokemonA, setPokemonA] = useState<PokemonDetailData | null>(null);
  const [pokemonB, setPokemonB] = useState<PokemonDetailData | null>(null);

  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedGuess, setSelectedGuess] = useState<"higher" | "lower" | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadRound = useCallback(
    async (prevPokemonB?: PokemonDetailData) => {
      setIsLoading(true);
      setIsAnswered(false);
      setSelectedGuess(null);
      setIsCorrect(null);

      // Randomly pick a stat to compare for variety
      const randomStat = STAT_CONFIGS[Math.floor(Math.random() * STAT_CONFIGS.length)];
      setActiveStat(randomStat);

      try {
        let first: PokemonDetailData | null = prevPokemonB || null;
        if (!first) {
          const idA = getRandomPokemonId("normal");
          first = await fetch(`/api/pokemon/${idA}`).then((r) => r.json());
        }

        if (!first) {
          throw new Error("Failed to load initial Pokémon");
        }

        // Fetch Pokemon B ensuring stat is strictly different per agreed rule
        let second: PokemonDetailData | null = null;
        let attempts = 0;
        while (!second && attempts < 10) {
          const idB = getRandomPokemonId("normal", [first.id]);
          const candidate: PokemonDetailData = await fetch(`/api/pokemon/${idB}`).then((r) => r.json());
          if (candidate.stats[randomStat.key] !== first.stats[randomStat.key]) {
            second = candidate;
          }
          attempts++;
        }

        if (!second) {
          // Fallback guaranteed different
          const candidate: PokemonDetailData = await fetch(`/api/pokemon/25`).then((r) => r.json());
          second = candidate;
        }

        setPokemonA(first);
        setPokemonB(second);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadRound();
  }, [loadRound]);

  const handleGuess = (guess: "higher" | "lower") => {
    if (isAnswered || !pokemonA || !pokemonB) return;

    setSelectedGuess(guess);
    setIsAnswered(true);

    const valA = pokemonA.stats[activeStat.key];
    const valB = pokemonB.stats[activeStat.key];

    const correct = (guess === "higher" && valB > valA) || (guess === "lower" && valB < valA);
    setIsCorrect(correct);

    if (correct) {
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
      // Continuous progression: Pokémon B becomes the next Pokémon A
      loadRound(pokemonB || undefined);
    }
  };

  const handleRestart = () => {
    setRound(1);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    loadRound();
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
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      <GameHeader
        title={t.games.higherLower.title}
        subtitle={t.games.higherLower.instruction}
      />

      <GameScore
        round={round}
        totalRounds={totalRounds}
        score={score}
        streak={streak}
      />

      {/* Main Comparison Stage */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Comparison prompt */}
        <div className="text-center">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Comparing Stat
          </span>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
            {activeStat.label}
          </h2>
        </div>

        {isLoading || !pokemonA || !pokemonB ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <span className="text-xs font-semibold">{t.common.loading}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Pokémon A (Known) */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center text-center">
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                {formatPokemonId(pokemonA.id)}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg font-sans">
                {getDisplayName(pokemonA)}
              </h3>
              <div className="my-3">
                <PokemonArtwork
                  id={pokemonA.id}
                  name={pokemonA.name}
                  artwork={pokemonA.artwork}
                  size={150}
                />
              </div>
              <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xs">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                  {activeStat.label}
                </span>
                <p className="font-mono font-black text-2xl text-slate-900 dark:text-slate-100 mt-0.5">
                  {pokemonA.stats[activeStat.key]}
                </p>
              </div>
            </div>

            {/* Pokémon B (Hidden until guessed) */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center text-center">
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                {formatPokemonId(pokemonB.id)}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg font-sans">
                {getDisplayName(pokemonB)}
              </h3>
              <div className="my-3">
                <PokemonArtwork
                  id={pokemonB.id}
                  name={pokemonB.name}
                  artwork={pokemonB.artwork}
                  size={150}
                />
              </div>

              {/* Stat Value or Guess Buttons */}
              <div className="w-full">
                {isAnswered ? (
                  <div
                    className={`w-full rounded-xl p-3 border shadow-xs transition-all ${
                      isCorrect
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                        : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase">
                      {activeStat.label}
                    </span>
                    <p className="font-mono font-black text-2xl mt-0.5">
                      {pokemonB.stats[activeStat.key]}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleGuess("higher")}
                      className="flex items-center justify-center gap-1.5 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>{t.games.higherLower.isHigher}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGuess("lower")}
                      className="flex items-center justify-center gap-1.5 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <TrendingDown className="w-4 h-4" />
                      <span>{t.games.higherLower.isLower}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Post-answer feedback & Next round */}
        {isAnswered && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <Check className="w-4 h-4" />
                  <span>{t.games.higherLower.correct}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-800">
                  <X className="w-4 h-4" />
                  <span>{t.games.higherLower.wrong}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextRound}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <span>{round >= totalRounds ? "View Result" : t.common.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
