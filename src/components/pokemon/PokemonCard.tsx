"use client";

import React from "react";
import Link from "next/link";
import { PokemonListItem } from "@/lib/pokeapi/types";
import { formatPokemonId, getDisplayName } from "@/lib/utils";
import { PokemonArtwork } from "./PokemonArtwork";
import { PokemonTypeBadge } from "./PokemonTypeBadge";
import { useFavorites } from "@/context/FavoritesContext";
import { Heart } from "lucide-react";

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(pokemon.id);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 transition-all hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 flex flex-col items-center">
      {/* Top bar: ID and Favorite button */}
      <div className="w-full flex items-center justify-between">
        <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
          {formatPokemonId(pokemon.id)}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(pokemon);
          }}
          className="p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              favorited ? "fill-red-500 text-red-500" : "text-slate-300 dark:text-slate-600 hover:text-slate-400"
            }`}
          />
        </button>
      </div>

      {/* Artwork Link */}
      <Link
        href={`/pokemon/${pokemon.id}`}
        className="my-3 flex items-center justify-center cursor-pointer"
      >
        <PokemonArtwork
          id={pokemon.id}
          name={pokemon.name}
          artwork={pokemon.artwork}
          sprite={pokemon.sprite}
          size={140}
        />
      </Link>

      {/* Japanese Name Only */}
      <Link
        href={`/pokemon/${pokemon.id}`}
        className="font-bold text-slate-800 dark:text-slate-100 text-base group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-center font-sans tracking-wide"
      >
        {getDisplayName(pokemon)}
      </Link>

      {/* Types */}
      <div className="flex flex-wrap gap-1.5 justify-center mt-2">
        {pokemon.types.map((type) => (
          <PokemonTypeBadge key={type} type={type} size="sm" />
        ))}
      </div>
    </div>
  );
}
