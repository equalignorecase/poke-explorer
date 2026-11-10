"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { PokemonDetailData } from "@/lib/pokeapi/types";
import { PokemonArtwork } from "@/components/pokemon/PokemonArtwork";
import { PokemonTypeBadge } from "@/components/pokemon/PokemonTypeBadge";
import { PokemonStatBar } from "@/components/pokemon/PokemonStatBar";
import { formatPokemonId, getDisplayName } from "@/lib/utils";
import {
  Search,
  ShieldAlert,
  Loader2,
} from "lucide-react";

function CompareContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const [idA, setIdA] = useState<number>(
    searchParams.get("p1") ? parseInt(searchParams.get("p1")!, 10) : 25 // default Pikachu
  );
  const [idB, setIdB] = useState<number>(
    searchParams.get("p2") ? parseInt(searchParams.get("p2")!, 10) : 133 // default Eevee
  );

  const [pokemonA, setPokemonA] = useState<PokemonDetailData | null>(null);
  const [pokemonB, setPokemonB] = useState<PokemonDetailData | null>(null);
  const [loadingA, setLoadingA] = useState(true);
  const [loadingB, setLoadingB] = useState(true);

  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");

  useEffect(() => {
    setLoadingA(true);
    fetch(`/api/pokemon/${idA}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemonA(data);
        setLoadingA(false);
      })
      .catch((e) => {
        console.error(e);
        setLoadingA(false);
      });
  }, [idA]);

  useEffect(() => {
    setLoadingB(true);
    fetch(`/api/pokemon/${idB}`)
      .then((res) => res.json())
      .then((data) => {
        setPokemonB(data);
        setLoadingB(false);
      })
      .catch((e) => {
        console.error(e);
        setLoadingB(false);
      });
  }, [idB]);

  const handleSelectPokemonA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchA.trim()) return;
    fetch(`/api/pokemon/${searchA.trim().toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setIdA(data.id);
          setSearchA("");
        }
      });
  };

  const handleSelectPokemonB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchB.trim()) return;
    fetch(`/api/pokemon/${searchB.trim().toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setIdB(data.id);
          setSearchB("");
        }
      });
  };

  const getHighlight = (valA: number, valB: number) => {
    if (valA > valB) return { a: "higher" as const, b: "lower" as const };
    if (valB > valA) return { a: "lower" as const, b: "higher" as const };
    return { a: "equal" as const, b: "equal" as const };
  };

  return (
    <div className="space-y-8 py-2">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {t.compare.title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.compare.subtitle}
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {/* Versus pill in center */}
        <div className="hidden md:flex absolute left-1/2 top-48 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-red-600 text-white font-black text-xs items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
          VS
        </div>

        {/* Combatant A */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <form onSubmit={handleSelectPokemonA} className="flex gap-2">
            <input
              type="text"
              value={searchA}
              onChange={(e) => setSearchA(e.target.value)}
              placeholder={t.compare.searchFirst}
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {loadingA || !pokemonA ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                  {formatPokemonId(pokemonA.id)}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 font-sans">
                  {getDisplayName(pokemonA)}
                </h3>
                <div className="flex gap-1.5 mt-2">
                  {pokemonA.types.map((type) => (
                    <PokemonTypeBadge key={type} type={type} size="sm" />
                  ))}
                </div>
                <div className="my-4">
                  <PokemonArtwork
                    id={pokemonA.id}
                    name={pokemonA.name}
                    artwork={pokemonA.artwork}
                    size={170}
                  />
                </div>
              </div>

              {/* Stats for A */}
              {pokemonB && (
                <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-700">
                    <span>Total Base Stats</span>
                    <span className="font-mono">{pokemonA.stats.total}</span>
                  </div>
                  <PokemonStatBar
                    label={t.common.hp}
                    value={pokemonA.stats.hp}
                    highlight={getHighlight(pokemonA.stats.hp, pokemonB.stats.hp).a}
                  />
                  <PokemonStatBar
                    label={t.common.attack}
                    value={pokemonA.stats.attack}
                    highlight={getHighlight(pokemonA.stats.attack, pokemonB.stats.attack).a}
                  />
                  <PokemonStatBar
                    label={t.common.defense}
                    value={pokemonA.stats.defense}
                    highlight={getHighlight(pokemonA.stats.defense, pokemonB.stats.defense).a}
                  />
                  <PokemonStatBar
                    label={t.common.spAtk}
                    value={pokemonA.stats.specialAttack}
                    highlight={getHighlight(pokemonA.stats.specialAttack, pokemonB.stats.specialAttack).a}
                  />
                  <PokemonStatBar
                    label={t.common.spDef}
                    value={pokemonA.stats.specialDefense}
                    highlight={getHighlight(pokemonA.stats.specialDefense, pokemonB.stats.specialDefense).a}
                  />
                  <PokemonStatBar
                    label={t.common.speed}
                    value={pokemonA.stats.speed}
                    highlight={getHighlight(pokemonA.stats.speed, pokemonB.stats.speed).a}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Combatant B */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <form onSubmit={handleSelectPokemonB} className="flex gap-2">
            <input
              type="text"
              value={searchB}
              onChange={(e) => setSearchB(e.target.value)}
              placeholder={t.compare.searchSecond}
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {loadingB || !pokemonB ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                  {formatPokemonId(pokemonB.id)}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 font-sans">
                  {getDisplayName(pokemonB)}
                </h3>
                <div className="flex gap-1.5 mt-2">
                  {pokemonB.types.map((type) => (
                    <PokemonTypeBadge key={type} type={type} size="sm" />
                  ))}
                </div>
                <div className="my-4">
                  <PokemonArtwork
                    id={pokemonB.id}
                    name={pokemonB.name}
                    artwork={pokemonB.artwork}
                    size={170}
                  />
                </div>
              </div>

              {/* Stats for B */}
              {pokemonA && (
                <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-700">
                    <span>Total Base Stats</span>
                    <span className="font-mono">{pokemonB.stats.total}</span>
                  </div>
                  <PokemonStatBar
                    label={t.common.hp}
                    value={pokemonB.stats.hp}
                    highlight={getHighlight(pokemonA.stats.hp, pokemonB.stats.hp).b}
                  />
                  <PokemonStatBar
                    label={t.common.attack}
                    value={pokemonB.stats.attack}
                    highlight={getHighlight(pokemonA.stats.attack, pokemonB.stats.attack).b}
                  />
                  <PokemonStatBar
                    label={t.common.defense}
                    value={pokemonB.stats.defense}
                    highlight={getHighlight(pokemonA.stats.defense, pokemonB.stats.defense).b}
                  />
                  <PokemonStatBar
                    label={t.common.spAtk}
                    value={pokemonB.stats.specialAttack}
                    highlight={getHighlight(pokemonA.stats.specialAttack, pokemonB.stats.specialAttack).b}
                  />
                  <PokemonStatBar
                    label={t.common.spDef}
                    value={pokemonB.stats.specialDefense}
                    highlight={getHighlight(pokemonA.stats.specialDefense, pokemonB.stats.specialDefense).b}
                  />
                  <PokemonStatBar
                    label={t.common.speed}
                    value={pokemonB.stats.speed}
                    highlight={getHighlight(pokemonA.stats.speed, pokemonB.stats.speed).b}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Educational Disclaimer */}
      <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>{t.compare.disclaimer}</p>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
