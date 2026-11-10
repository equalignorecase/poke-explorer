"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { GameHeader } from "@/components/games/GameHeader";
import { PokemonTypeBadge } from "@/components/pokemon/PokemonTypeBadge";
import { PokemonDetailData } from "@/lib/pokeapi/types";
import {
  BattleState,
  BattleAction,
  createCombatant,
  resolveTurn,
} from "@/lib/games/battleEngine";
import { getRandomPokemonId } from "@/lib/games/engine";
import { capitalize, formatPokemonId } from "@/lib/utils";
import {
  Swords,
  Zap,
  Flame,
  Shield,
  RotateCcw,
  Loader2,
  ShieldAlert,
  Trophy,
  Skull,
} from "lucide-react";

// Pre-defined champion choices for quick start
const CHAMPION_OPTIONS = [
  { id: 25, name: "Pikachu" },
  { id: 6, name: "Charizard" },
  { id: 9, name: "Blastoise" },
  { id: 3, name: "Venusaur" },
  { id: 94, name: "Gengar" },
  { id: 448, name: "Lucario" },
];

export default function BattleSimulatorPage() {
  const { t } = useLanguage();
  const [selectedChampionId, setSelectedChampionId] = useState<number>(25);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const startBattle = async (championId: number) => {
    setIsLoading(true);
    try {
      const opponentId = getRandomPokemonId("normal", [championId]);
      const [playerData, opponentData]: [PokemonDetailData, PokemonDetailData] = await Promise.all([
        fetch(`/api/pokemon/${championId}`).then((r) => r.json()),
        fetch(`/api/pokemon/${opponentId}`).then((r) => r.json()),
      ]);

      const playerCombatant = createCombatant(playerData);
      const opponentCombatant = createCombatant(opponentData);

      setBattleState({
        player: playerCombatant,
        opponent: opponentCombatant,
        turn: 0,
        logs: [
          {
            turn: 0,
            actor: "player",
            action: "defend",
            damage: 0,
            effectiveness: "normal",
            text: `A wild ${opponentCombatant.name.toUpperCase()} appeared! Prepare for battle!`,
          },
        ],
        winner: null,
        isResolving: false,
      });
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    startBattle(selectedChampionId);
  }, []);

  const handleAction = (action: BattleAction) => {
    if (!battleState || battleState.winner || battleState.isResolving) return;

    setBattleState((prev) => {
      if (!prev) return null;
      return resolveTurn(prev, action);
    });
  };

  const getHpPercent = (current: number, max: number) => {
    return Math.max(0, Math.min(100, Math.round((current / max) * 100)));
  };

  const getHpColor = (percent: number) => {
    if (percent > 50) return "bg-emerald-500";
    if (percent > 20) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      <GameHeader
        title={t.games.battle.title}
        subtitle={t.games.battle.instruction}
      />

      {/* Champion Quick Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500">
          {t.games.battle.choosePokemon}:
        </span>
        <div className="flex flex-wrap gap-2">
          {CHAMPION_OPTIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedChampionId(c.id);
                startBattle(c.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedChampionId === c.id
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading || !battleState ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <span className="text-xs font-semibold">{t.common.loading}</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Battle Arena */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
            {/* Opponent Row (Top Right) */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pb-8 border-b border-white/10">
              <div className="w-full sm:w-64 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2 order-2 sm:order-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="capitalize">{battleState.opponent.name}</span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    Lv. 50
                  </span>
                </div>
                <div className="flex gap-1">
                  {battleState.opponent.types.map((type) => (
                    <PokemonTypeBadge key={type} type={type} size="sm" />
                  ))}
                </div>
                <div className="space-y-1 pt-1">
                  <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getHpColor(
                        getHpPercent(battleState.opponent.currentHp, battleState.opponent.maxHp)
                      )}`}
                      style={{
                        width: `${getHpPercent(
                          battleState.opponent.currentHp,
                          battleState.opponent.maxHp
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-400">
                    {battleState.opponent.currentHp} / {battleState.opponent.maxHp} HP
                  </div>
                </div>
              </div>

              <div className="order-1 sm:order-2 shrink-0">
                <Image
                  src={battleState.opponent.artwork}
                  alt={battleState.opponent.name}
                  width={150}
                  height={150}
                  unoptimized
                  className="object-contain drop-shadow-lg"
                />
              </div>
            </div>

            {/* Player Row (Bottom Left) */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-6 pt-8">
              <div className="shrink-0">
                <Image
                  src={battleState.player.artwork}
                  alt={battleState.player.name}
                  width={170}
                  height={170}
                  unoptimized
                  className="object-contain drop-shadow-lg"
                />
              </div>

              <div className="w-full sm:w-64 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="capitalize">{battleState.player.name}</span>
                  <span className="font-mono text-emerald-400 text-[11px]">
                    Player
                  </span>
                </div>
                <div className="flex gap-1">
                  {battleState.player.types.map((type) => (
                    <PokemonTypeBadge key={type} type={type} size="sm" />
                  ))}
                </div>
                <div className="space-y-1 pt-1">
                  <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getHpColor(
                        getHpPercent(battleState.player.currentHp, battleState.player.maxHp)
                      )}`}
                      style={{
                        width: `${getHpPercent(
                          battleState.player.currentHp,
                          battleState.player.maxHp
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-400">
                    {battleState.player.currentHp} / {battleState.player.maxHp} HP
                  </div>
                </div>
              </div>
            </div>

            {/* Winner Overlay if Match Completed */}
            {battleState.winner && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in duration-300 z-20">
                {battleState.winner === "player" ? (
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                    <Trophy className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                    <Skull className="w-8 h-8" />
                  </div>
                )}

                <h3 className="text-3xl font-black text-white">
                  {battleState.winner === "player"
                    ? `${t.games.battle.victory} ${capitalize(battleState.opponent.name)}!`
                    : t.games.battle.defeat}
                </h3>
                <p className="text-xs text-slate-400">
                  Battle lasted {battleState.turn} turns.
                </p>

                <button
                  type="button"
                  onClick={() => startBattle(selectedChampionId)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.common.playAgain}</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Control Panel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Battle Actions (Turn {battleState.turn + 1})
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Quick Attack */}
              <button
                type="button"
                disabled={Boolean(battleState.winner)}
                onClick={() => handleAction("quick")}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-xs"
              >
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm mb-1">
                  <Zap className="w-4 h-4" />
                  <span>{t.games.battle.quickAttack}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Priority +1 strike with lower base power (35).
                </p>
              </button>

              {/* Power Attack */}
              <button
                type="button"
                disabled={Boolean(battleState.winner)}
                onClick={() => handleAction("power")}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-xs"
              >
                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm mb-1">
                  <Flame className="w-4 h-4" />
                  <span>{t.games.battle.powerAttack}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Heavy impact with high base power (65).
                </p>
              </button>

              {/* Defend */}
              <button
                type="button"
                disabled={Boolean(battleState.winner)}
                onClick={() => handleAction("defend")}
                className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group shadow-xs"
              >
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-1">
                  <Shield className="w-4 h-4" />
                  <span>{t.games.battle.defend}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Takes defensive stance, halving incoming damage.
                </p>
              </button>
            </div>
          </div>

          {/* Battle Logs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.games.battle.battleLog}
            </span>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 text-xs">
              {battleState.logs
                .slice()
                .reverse()
                .map((log, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-xl border ${
                      log.actor === "player"
                        ? "bg-slate-50 border-slate-200 text-slate-800"
                        : "bg-red-50/50 border-red-100 text-slate-800"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-400 mr-2">
                      [T{log.turn}]
                    </span>
                    <span>{log.text}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Simulator limitation disclaimer */}
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>{t.games.battle.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

