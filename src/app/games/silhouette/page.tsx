"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { GameHeader } from "@/components/games/GameHeader";
import { GameScore } from "@/components/games/GameScore";
import { GameResult } from "@/components/games/GameResult";
import { AnswerButton } from "@/components/games/AnswerButton";
import {
  GameDifficulty,
  getRandomPokemonId,
  generateQuizOptions,
} from "@/lib/games/engine";
import { capitalize } from "@/lib/utils";
import { Loader2, ArrowRight, Sparkles } from "lucide-react";

interface OptionItem {
  id: number;
  name: string;
}

export default function SilhouetteChallengePage() {
  const { t } = useLanguage();
  const [difficulty, setDifficulty] = useState<GameDifficulty>("normal");
  const [round, setRound] = useState(1);
  const totalRounds = 10;
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [currentPokemon, setCurrentPokemon] = useState<{
    id: number;
    name: string;
    japaneseName?: { katakana: string; romaji: string };
    artwork: string;
  } | null>(null);
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [usedIds, setUsedIds] = useState<number[]>([]);

  const optionsCount = difficulty === "hard" ? 6 : 4;

  const loadRound = useCallback(async () => {
    setIsLoading(true);
    setIsAnswered(false);
    setSelectedAnswer(null);

    try {
      const correctId = getRandomPokemonId(difficulty, usedIds);
      const wrongCount = optionsCount - 1;
      const wrongIds: number[] = [];

      while (wrongIds.length < wrongCount) {
        const id = getRandomPokemonId(difficulty, [correctId, ...usedIds, ...wrongIds]);
        if (!wrongIds.includes(id)) {
          wrongIds.push(id);
        }
      }

      const [correctData, ...wrongData] = await Promise.all([
        fetch(`/api/pokemon/${correctId}`).then((r) => r.json()),
        ...wrongIds.map((id) => fetch(`/api/pokemon/${id}`).then((r) => r.json())),
      ]);

      const correctOption: OptionItem = { id: correctData.id, name: correctData.name };
      const wrongOptions: OptionItem[] = wrongData.map((w) => ({ id: w.id, name: w.name }));

      const quizChoices = generateQuizOptions(correctOption, wrongOptions, optionsCount);

      setCurrentPokemon({
        id: correctData.id,
        name: correctData.name,
        japaneseName: correctData.japaneseName,
        artwork: correctData.artwork,
      });
      setOptions(quizChoices);
      setUsedIds((prev) => [...prev, correctId]);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }, [difficulty, usedIds, optionsCount]);

  useEffect(() => {
    loadRound();
  }, [difficulty]);

  const handleSelectAnswer = (chosenId: number) => {
    if (isAnswered || !currentPokemon) return;

    setSelectedAnswer(chosenId);
    setIsAnswered(true);

    if (chosenId === currentPokemon.id) {
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
      loadRound();
    }
  };

  const handleRestart = () => {
    setRound(1);
    setScore(0);
    setStreak(0);
    setUsedIds([]);
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
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      <GameHeader
        title={t.games.silhouette.title}
        subtitle={t.games.silhouette.instruction}
        difficulty={difficulty}
        onDifficultyChange={(d) => {
          setDifficulty(d);
          handleRestart();
        }}
        disabled={isLoading || isAnswered}
      />

      <GameScore
        round={round}
        totalRounds={totalRounds}
        score={score}
        streak={streak}
      />

      {/* Silhouette Stage */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-xs space-y-6">
        {isLoading || !currentPokemon ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <span className="text-xs font-semibold">{t.common.loading}</span>
          </div>
        ) : (
          <>
            <div className="py-4 relative flex items-center justify-center">
              <div
                className={`transition-all duration-500 ${
                  isAnswered ? "filter-none scale-105" : "brightness-0 contrast-200"
                }`}
              >
                <Image
                  src={currentPokemon.artwork}
                  alt={isAnswered ? currentPokemon.name : "Mystery Silhouette"}
                  width={220}
                  height={220}
                  priority
                  unoptimized
                  className="object-contain drop-shadow-md select-none pointer-events-none"
                />
              </div>
            </div>

            {/* Answer Choices */}
            <div
              className={`grid gap-3 w-full ${
                optionsCount === 6 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              {options.map((opt, idx) => {
                let state: "default" | "correct" | "incorrect" | "selected" = "default";
                if (isAnswered) {
                  if (opt.id === currentPokemon.id) {
                    state = "correct";
                  } else if (opt.id === selectedAnswer) {
                    state = "incorrect";
                  }
                }

                return (
                  <AnswerButton
                    key={opt.id}
                    label={capitalize(opt.name)}
                    shortcutIndex={idx + 1}
                    state={state}
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(opt.id)}
                  />
                );
              })}
            </div>

            {/* Post-answer feedback */}
            {isAnswered && (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-xs font-bold text-slate-800">
                    {t.games.silhouette.revealText} {capitalize(currentPokemon.name)}!
                  </span>
                  {currentPokemon.japaneseName && (
                    <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      🇯🇵 {currentPokemon.japaneseName.katakana} ({currentPokemon.japaneseName.romaji})
                    </span>
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
          </>
        )}
      </div>
    </div>
  );
}

