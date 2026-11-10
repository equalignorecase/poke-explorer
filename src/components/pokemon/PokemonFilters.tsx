"use client";

import React from "react";
import { POKEMON_TYPES } from "@/lib/games/typeRelations";
import { GENERATION_RANGES } from "@/lib/pokeapi/client";
import { useLanguage } from "@/context/LanguageContext";
import { Filter, RotateCcw } from "lucide-react";

interface PokemonFiltersProps {
  selectedType: string;
  onSelectType: (type: string) => void;
  selectedGeneration: number;
  onSelectGeneration: (gen: number) => void;
  onReset: () => void;
}

export function PokemonFilters({
  selectedType,
  onSelectType,
  selectedGeneration,
  onSelectGeneration,
  onReset,
}: PokemonFiltersProps) {
  const { t } = useLanguage();

  const hasActiveFilters = selectedType !== "" || selectedGeneration !== 0;

  return (
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      {/* Type dropdown */}
      <div className="relative">
        <select
          value={selectedType}
          onChange={(e) => onSelectType(e.target.value)}
          className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-xs cursor-pointer capitalize"
          aria-label="Filter by Pokémon type"
        >
          <option value="">{t.common.allTypes}</option>
          {POKEMON_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <Filter className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* Generation dropdown */}
      <div className="relative">
        <select
          value={selectedGeneration}
          onChange={(e) => onSelectGeneration(parseInt(e.target.value, 10))}
          className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-xs cursor-pointer"
          aria-label="Filter by Generation"
        >
          <option value={0}>{t.common.allGenerations}</option>
          {GENERATION_RANGES.map((g) => (
            <option key={g.gen} value={g.gen}>
              {g.name}
            </option>
          ))}
        </select>
        <Filter className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* Reset button if filter is active */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.common.reset}</span>
        </button>
      )}
    </div>
  );
}
