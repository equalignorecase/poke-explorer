"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { capitalize } from "@/lib/utils";
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface OptionItem {
  id: number;
  name: string;
}

export default function CryQuizPage() {
  const { t } = useLanguage();
  const [difficulty, setDifficulty] = useState<GameDifficulty>("normal");
  const [round, setRound] = useState(1);
  const totalRounds = 10;
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [currentPokemon, setCurrentPokemon] = useState<{
    id: number;
    name: string;
    artwork: string;
    cryUrl: string;
  } | null>(null);
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [usedIds, setUsedIds] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlayingAudio(false);
    }
  };

  const playCry = () => {
    if (!currentPokemon?.cryUrl) return;

    stopAudio();
    const audio = new Audio(currentPokemon.cryUrl);
    audioRef.current = audio;
    setIsPlayingAudio(true);

    audio.play().catch((err) => {
      console.warn("Audio playback interrupted:", err);
      setIsPlayingAudio(false);
    });

    audio.onended = () => {
      setIsPlayingAudio(false);
    };
  };

  const loadRound = useCallback(async () => {
    stopAudio();
    setIsLoading(true);
    setIsAnswered(false);
    setSelectedAnswer(null);

    let foundValid = false;
    let attempts = 0;

    while (!foundValid && attempts < 10) {
      attempts++;
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

        const cryUrl = correctData.cries?.latest || correctData.cries?.legacy;
        if (!cryUrl) {
          continue; // Re-roll if this Pokémon lacks sound
        }

        const correctOption: OptionItem = { id: correctData.id, name: correctData.name };
        const wrongOptions: OptionItem[] = wrongData.map((w) => ({ id: w.id, name: w.name }));
        const quizChoices = generateQuizOptions(correctOption, wrongOptions, 4);

        setCurrentPokemon({
          id: correctData.id,
          name: correctData.name,
          artwork: correctData.artwork,
          cryUrl,
        });
        setOptions(quizChoices);
        setUsedIds((prev) => [...prev, correctId]);
        foundValid = true;
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    if (!foundValid) {
      setIsLoading(false);
    }
  }, [difficulty, usedIds]);

  useEffect(() => {
    loadRound();
    return () => {
      stopAudio();
    };
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
    stopAudio();
    if (round >= totalRounds) {
      setIsGameOver(true);
    } else {
      setRound((r) => r + 1);
      loadRound();
    }
  };

  const handleRestart = () => {
    stopAudio();
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
        title={t.games.cry.title}
        subtitle={t.games.cry.instruction}
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

      {/* Cry Audio Stage */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-xs space-y-6">
        {isLoading || !currentPokemon ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <span className="text-xs font-semibold">{t.common.loading}</span>
          </div>
        ) : (
          <>
            {/* Audio speaker trigger */}
            <div className="py-6 flex flex-col items-center space-y-4">
              <button
                type="button"
                onClick={playCry}
                className={`w-28 h-28 rounded-3xl flex items-center justify-center transition-all shadow-md cursor-pointer active:scale-95 ${
                  isPlayingAudio
                    ? "bg-red-600 text-white animate-pulse ring-4 ring-red-200"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
                aria-label="Play Pokémon cry audio"
              >
                <Volume2 className="w-12 h-12" />
              </button>

              <span className="text-xs font-bold text-slate-500">
                {isPlayingAudio ? "Playing Sound..." : t.games.cry.listenPrompt}
              </span>
            </div>

            {/* Revealed Artwork after answering */}
            {isAnswered && (
              <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                <PokemonArtwork
                  id={currentPokemon.id}
                  name={currentPokemon.name}
                  artwork={currentPokemon.artwork}
                  size={140}
                />
              </div>
            )}

            {/* Answer Choices */}
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
              <div className="w-full flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-600">
                  {selectedAnswer === currentPokemon.id
                    ? `${t.games.guess.correct} ${capitalize(currentPokemon.name)}!`
                    : `${t.games.guess.wrong} ${capitalize(currentPokemon.name)}.`}
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

