"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { GameHeader } from "@/components/games/GameHeader";
import { GameResult } from "@/components/games/GameResult";
import { GameDifficulty, getRandomPokemonId, shuffleArray } from "@/lib/games/engine";
import { capitalize, getDisplayName } from "@/lib/utils";
import { Loader2, Timer, Footprints, RotateCcw } from "lucide-react";

interface MemoryCard {
  uniqueId: string;
  pokemonId: number;
  name: string;
  artwork: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGamePage() {
  const { t } = useLanguage();
  const [difficulty, setDifficulty] = useState<GameDifficulty>("normal");

  const pairCounts = {
    easy: 4,
    normal: 6,
    hard: 8,
  };
  const numPairs = pairCounts[difficulty];

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize deck
  const setupGame = useCallback(async () => {
    setIsLoading(true);
    setIsGameOver(false);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setSeconds(0);
    setIsTimerActive(false);
    setIsProcessing(false);

    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const selectedIds: number[] = [];
      while (selectedIds.length < numPairs) {
        const id = getRandomPokemonId("normal", selectedIds);
        if (!selectedIds.includes(id)) {
          selectedIds.push(id);
        }
      }

      const pokemonData = await Promise.all(
        selectedIds.map((id) => fetch(`/api/pokemon/${id}`).then((r) => r.json()))
      );

      const deck: MemoryCard[] = [];
      pokemonData.forEach((p) => {
        // Create 2 cards per Pokémon with Japanese name
        const displayName = getDisplayName(p);
        deck.push({
          uniqueId: `${p.id}-a`,
          pokemonId: p.id,
          name: displayName,
          artwork: p.artwork,
          isFlipped: false,
          isMatched: false,
        });
        deck.push({
          uniqueId: `${p.id}-b`,
          pokemonId: p.id,
          name: displayName,
          artwork: p.artwork,
          isFlipped: false,
          isMatched: false,
        });
      });

      setCards(shuffleArray(deck));
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }, [numPairs]);

  useEffect(() => {
    setupGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [difficulty, setupGame]);

  // Timer runner
  useEffect(() => {
    if (isTimerActive && !isGameOver) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, isGameOver]);

  const handleCardClick = (index: number) => {
    if (isProcessing) return;
    const card = cards[index];
    if (card.isFlipped || card.isMatched) return;

    if (!isTimerActive) {
      setIsTimerActive(true);
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsProcessing(true);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.pokemonId === secondCard.pokemonId) {
        // Matched
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);

          const nextMatched = matchedPairs + 1;
          setMatchedPairs(nextMatched);

          if (nextMatched === numPairs) {
            setIsGameOver(true);
            setIsTimerActive(false);
          }
        }, 500);
      } else {
        // Mismatch: flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isGameOver) {
    // Scoring logic: 100 base minus extra moves
    const perfectMoves = numPairs;
    const score = Math.max(20, 100 - (moves - perfectMoves) * 5);

    return (
      <GameResult
        score={score}
        maxScore={100}
        totalRounds={numPairs}
        onRestart={setupGame}
        customMessage={`Finished in ${formatTime(seconds)} with ${moves} total moves!`}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      <GameHeader
        title={t.games.memory.title}
        subtitle={t.games.memory.instruction}
        difficulty={difficulty}
        onDifficultyChange={(d) => {
          setDifficulty(d);
        }}
        disabled={isProcessing}
      />

      {/* Stats bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs text-xs font-bold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Footprints className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span>
            {t.games.memory.moves}: <strong className="font-mono text-sm text-slate-900 dark:text-slate-100">{moves}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 dark:text-slate-500">Pairs:</span>
          <strong className="font-mono text-sm text-slate-900 dark:text-slate-100">
            {matchedPairs} / {numPairs}
          </strong>
        </div>

        <div className="flex items-center gap-1.5">
          <Timer className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <strong className="font-mono text-sm text-slate-900 dark:text-slate-100">{formatTime(seconds)}</strong>
        </div>
      </div>

      {/* Grid of memory cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <span className="text-xs font-semibold">{t.common.loading}</span>
        </div>
      ) : (
        <div
          className={`grid gap-3 sm:gap-4 ${
            difficulty === "hard"
              ? "grid-cols-4 sm:grid-cols-4"
              : difficulty === "normal"
              ? "grid-cols-3 sm:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-4"
          }`}
        >
          {cards.map((card, idx) => (
            <button
              key={card.uniqueId}
              type="button"
              disabled={card.isMatched || card.isFlipped || isProcessing}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-2xl p-3 flex flex-col items-center justify-center transition-all duration-300 border shadow-xs cursor-pointer select-none ${
                card.isFlipped || card.isMatched
                  ? "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rotate-0"
                  : "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 dark:border-slate-800 hover:scale-102"
              } ${card.isMatched ? "ring-2 ring-emerald-400 opacity-90" : ""}`}
              aria-label={card.isFlipped || card.isMatched ? card.name : "Hidden Card"}
            >
              {card.isFlipped || card.isMatched ? (
                <div className="flex flex-col items-center justify-center animate-in zoom-in-75 duration-200">
                  <Image
                    src={card.artwork}
                    alt={card.name}
                    width={90}
                    height={90}
                    unoptimized
                    className="object-contain"
                  />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1 capitalize truncate max-w-[80px]">
                    {card.name}
                  </span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white/40 font-black text-sm">
                  ?
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
