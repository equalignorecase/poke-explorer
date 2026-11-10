"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTeam } from "@/context/TeamContext";
import { PokemonArtwork } from "@/components/pokemon/PokemonArtwork";
import { PokemonTypeBadge } from "@/components/pokemon/PokemonTypeBadge";
import {
  getTeamDefensiveWeaknesses,
  getTeamTypeDistribution,
} from "@/lib/games/typeRelations";
import { capitalize } from "@/lib/utils";
import {
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Info,
  ShieldAlert,
} from "lucide-react";

export default function TeamPage() {
  const { t } = useLanguage();
  const { team, removeFromTeam, reorderTeam, clearTeam } = useTeam();

  const weaknesses = getTeamDefensiveWeaknesses(team);
  const typeDistribution = getTeamTypeDistribution(team);

  const emptySlotsCount = 6 - team.length;

  return (
    <div className="space-y-8 py-2">
      {/* Header & Clear Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {t.team.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t.team.subtitle}
          </p>
        </div>

        {team.length > 0 && (
          <button
            type="button"
            onClick={clearTeam}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.team.clearTeam}</span>
          </button>
        )}
      </div>

      {/* Session notice banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-800">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <span>{t.team.sessionNotice}</span>
      </div>

      {/* 6 Team Slots */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>
            {t.team.slotsUsed}: {team.length} / 6
          </span>
          {team.length === 6 && (
            <span className="text-red-600 font-bold">Team is Full</span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Active members */}
          {team.map((pokemon, index) => (
            <div
              key={pokemon.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-between shadow-xs relative group"
            >
              {/* Member order & controls */}
              <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400">
                <span>#{index + 1}</span>
                <div className="flex items-center gap-0.5">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => reorderTeam(index, index - 1)}
                      className="p-1 hover:text-slate-800 cursor-pointer"
                      title="Move left"
                    >
                      <ArrowUp className="w-3 h-3 rotate-270 sm:rotate-0" />
                    </button>
                  )}
                  {index < team.length - 1 && (
                    <button
                      type="button"
                      onClick={() => reorderTeam(index, index + 1)}
                      className="p-1 hover:text-slate-800 cursor-pointer"
                      title="Move right"
                    >
                      <ArrowDown className="w-3 h-3 rotate-270 sm:rotate-0" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFromTeam(pokemon.id)}
                    className="p-1 text-slate-300 hover:text-rose-600 cursor-pointer"
                    title="Remove from team"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Artwork */}
              <Link href={`/pokemon/${pokemon.id}`} className="my-2">
                <PokemonArtwork
                  id={pokemon.id}
                  name={pokemon.name}
                  artwork={pokemon.artwork}
                  size={100}
                />
              </Link>

              {/* Name & types */}
              <Link
                href={`/pokemon/${pokemon.id}`}
                className="font-bold text-slate-800 text-xs text-center hover:text-red-600 truncate w-full"
              >
                {capitalize(pokemon.name)}
              </Link>
              <div className="flex gap-1 mt-1.5">
                {pokemon.types.map((type) => (
                  <PokemonTypeBadge key={type} type={type} size="sm" />
                ))}
              </div>
            </div>
          ))}

          {/* Empty placeholders */}
          {Array.from({ length: emptySlotsCount }).map((_, i) => (
            <Link
              key={i}
              href="/pokedex"
              className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-red-300 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-red-500 transition-colors min-h-[180px] group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-red-50 flex items-center justify-center mb-2 transition-colors">
                <Plus className="w-5 h-5 text-slate-400 group-hover:text-red-600" />
              </div>
              <span className="text-xs font-bold">{t.team.emptySlot}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Team Analysis Section (Type Coverage & Defensive Weaknesses) */}
      {team.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Defensive Weaknesses */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-base">
                {t.team.defensiveWeaknesses}
              </h2>
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                Weak Count
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Types that deal super-effective damage to members of your current squad:
            </p>

            {weaknesses.length === 0 ? (
              <p className="text-xs text-emerald-600 font-medium">
                No common defensive vulnerabilities found!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {weaknesses.map((w) => (
                  <div
                    key={w.type}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <PokemonTypeBadge type={w.type} size="sm" />
                    <span className="text-xs font-mono font-bold text-rose-600">
                      {w.weakCount} weak
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Type Distribution */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-slate-900 text-base">
              {t.team.typeCoverage}
            </h2>
            <p className="text-xs text-slate-500">
              Total elemental types represented in your Pokémon squad:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(typeDistribution)
                .filter(([_, count]) => count > 0)
                .map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center gap-1.5 p-1.5 pr-2.5 rounded-full bg-slate-50 border border-slate-200"
                  >
                    <PokemonTypeBadge type={type as any} size="sm" />
                    <span className="text-xs font-mono font-bold text-slate-700">
                      x{count}
                    </span>
                  </div>
                ))}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2 text-[11px] text-slate-500">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{t.team.weaknessNotice}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
