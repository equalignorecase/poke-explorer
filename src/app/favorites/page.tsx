"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { Heart, Compass, Info } from "lucide-react";

export default function FavoritesPage() {
  const { t } = useLanguage();
  const { favorites } = useFavorites();

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {t.favorites.title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.favorites.subtitle}
        </p>
      </div>

      {/* Session reminder notice banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>{t.favorites.sessionNotice}</span>
      </div>

      {/* Grid or Empty state */}
      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t.favorites.emptyTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.favorites.emptyDescription}
          </p>
          <div className="pt-2">
            <Link
              href="/pokedex"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>{t.favorites.browsePokedex}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favorites.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
}

