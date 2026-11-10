"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { GameHeader } from "@/components/games/GameHeader";
import { GameScore } from "@/components/games/GameScore";
import { GameResult } from "@/components/games/GameResult";
import { AnswerButton } from "@/components/games/AnswerButton";
import { PokemonArtwork } from "@/components/pokemon/PokemonArtwork";
import {
  GameDifficulty,
  getRandomPokemonId,
  generateQuizOptions,
} from "@/lib/games/engine";
import { getDisplayName } from "@/lib/utils";
import { JapaneseName } from "@/lib/pokeapi/types";
import { Loader2, ArrowRight } from "lucide-react";

interface OptionItem {
  id: number;
  name: string;
  japaneseName?: JapaneseName;
}

export default function GuessPokemonPage() {
  const { t } = useLanguage();
  const [difficulty, setDifficulty] = useState<GameDifficulty>("normal");
  const [round, setRound] = useState(1);
  const totalRounds = 10;
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [currentPokemon, setCurrentPokemon] = useState<{
    id: number;
    name: string;
    japaneseName?: JapaneseName;
    artwork: string;
  } | null>(null);
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [usedIds, setUsedIds] = useState<number[]>([]);

  const loadRound = useCallback(async () => {
    setIsLoading(true);
    setIsAnswered(false);
    setSelectedAnswer(null);

    try {
      const correctId = getRandomPokemonId(difficulty, usedIds);
      const wrongIds = [
        getRandomPokemonId(difficulty, [correctId, ...usedIds]),
        getRandomPokemonId(difficulty, [correctId, ...usedIds]),
        getRandomPokemonId(difficulty, [correctId, ...usedIds]),
      ];

      const [correctData, ...wrongData] = await Promise.all([
        fetch(`/api/pokemon/${correctId}`).then((r) => r.json()),
        ...wrongIds.map((id) => fetch(`/api/pokemon/${id}`).then((r) => r.json())),
      ]);

      const correctOption: OptionItem = {
        id: correctData.id,
        name: correctData.name,
        japaneseName: correctData.japaneseName,
      };
      const wrongOptions: OptionItem[] = wrongData.map((w) => ({
        id: w.id,
        name: w.name,
        japaneseName: w.japaneseName,
      }));

      const quizChoices = generateQuizOptions(correctOption, wrongOptions, 4);

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
  }, [difficulty, usedIds]);

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
        title={t.games.guess.title}
        subtitle={t.games.guess.instruction}
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

      {/* Main Game Stage */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-xs space-y-6">
        {isLoading || !currentPokemon ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <span className="text-xs font-semibold">{t.common.loading}</span>
          </div>
        ) : (
          <>
            <div className="py-2">
              <PokemonArtwork
                id={currentPokemon.id}
                name={currentPokemon.name}
                artwork={currentPokemon.artwork}
                size={200}
                priority
              />
            </div>

            {/* Answer Choices in Japanese Katakana */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
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
                    label={getDisplayName(opt)}
                    shortcutIndex={idx + 1}
                    state={state}
                    disabled={isAnswered}
                    onClick={() => handleSelectAnswer(opt.id)}
                  />
                );
              })}
            </div>

            {/* Post-answer action button */}
            {isAnswered && (
              <div className="w-full flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans">
                  {selectedAnswer === currentPokemon.id
                    ? `${t.games.guess.correct} ${getDisplayName(currentPokemon)}!`
                    : `${t.games.guess.wrong} ${getDisplayName(currentPokemon)}.`}
                </span>

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
