"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useTeam } from "@/context/TeamContext";
import { PokemonDetailData, PokemonListItem, PokemonTypeName } from "@/lib/pokeapi/types";
import { PokemonArtwork } from "@/components/pokemon/PokemonArtwork";
import { PokemonTypeBadge } from "@/components/pokemon/PokemonTypeBadge";
import { PokemonStatBar } from "@/components/pokemon/PokemonStatBar";
import { formatPokemonId, getDisplayName } from "@/lib/utils";
import {
  Heart,
  Users,
  ArrowLeftRight,
  Volume2,
  VolumeX,
  Shuffle,
  ChevronLeft,
  Loader2,
  Sparkles,
  Info,
} from "lucide-react";

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInTeam, addToTeam, removeFromTeam, isFull } = useTeam();

  const [pokemon, setPokemon] = useState<PokemonDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const [isPlayingCry, setIsPlayingCry] = useState(false);
  const [teamNotice, setTeamNotice] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsError(false);

    fetch(`/api/pokemon/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setPokemon(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setIsError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [id]);

  const handlePlayCry = () => {
    if (!pokemon) return;
    const cryUrl = pokemon.cries.latest || pokemon.cries.legacy;
    if (!cryUrl) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(cryUrl);
    audioRef.current = audio;
    setIsPlayingCry(true);
    audio.play().catch((e) => {
      console.warn("Audio playback prevented:", e);
      setIsPlayingCry(false);
    });
    audio.onended = () => setIsPlayingCry(false);
  };

  const handleTeamAction = () => {
    if (!pokemon) return;
    if (isInTeam(pokemon.id)) {
      removeFromTeam(pokemon.id);
      setTeamNotice(null);
    } else {
      const listItem: PokemonListItem = {
        id: pokemon.id,
        name: pokemon.name,
        japaneseName: pokemon.japaneseName,
        types: pokemon.types,
        generation: pokemon.generation,
        sprite: pokemon.sprite,
        artwork: pokemon.artwork,
      };
      const result = addToTeam(listItem);
      if (!result.success) {
        setTeamNotice(result.reason === "full" ? t.pokemonDetail.teamFull : "Already in team");
      } else {
        setTeamNotice(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <p className="text-sm font-medium">{t.common.loading}</p>
      </div>
    );
  }

  if (isError || !pokemon) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 my-12">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Pokémon Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          The requested Pokémon ID or name does not exist.
        </p>
        <Link
          href="/pokedex"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t.common.back}</span>
        </Link>
      </div>
    );
  }

  const listItem: PokemonListItem = {
    id: pokemon.id,
    name: pokemon.name,
    japaneseName: pokemon.japaneseName,
    types: pokemon.types,
    generation: pokemon.generation,
    sprite: pokemon.sprite,
    artwork: pokemon.artwork,
  };

  const favorited = isFavorite(pokemon.id);
  const inTeam = isInTeam(pokemon.id);
  const cryAvailable = Boolean(pokemon.cries.latest || pokemon.cries.legacy);

  return (
    <div className="space-y-8 py-2">
      {/* Top Breadcrumb & Random Button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t.common.back}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const nextId = Math.floor(Math.random() * 386) + 1;
            router.push(`/pokemon/${nextId}`);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
        >
          <Shuffle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          <span>Random</span>
        </button>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Artwork & Visual Actions */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-xs">
          <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 dark:text-slate-500">
            <span>{formatPokemonId(pokemon.id)}</span>
            <span>Gen {pokemon.generation}</span>
          </div>

          <div className="my-6 relative flex items-center justify-center">
            <PokemonArtwork
              id={pokemon.id}
              name={pokemon.name}
              artwork={isShiny ? pokemon.shinyArtwork : pokemon.artwork}
              sprite={isShiny ? pokemon.shinySprite : pokemon.sprite}
              size={240}
              priority
            />
          </div>

          {/* Shiny Toggle & Cry button */}
          <div className="flex items-center gap-3 w-full justify-center pt-2">
            <button
              type="button"
              onClick={() => setIsShiny(!isShiny)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isShiny
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isShiny ? t.common.shiny : t.common.defaultSprite}</span>
            </button>

            {cryAvailable ? (
              <button
                type="button"
                onClick={handlePlayCry}
                disabled={isPlayingCry}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingCry ? "animate-pulse text-red-600" : ""}`} />
                <span>{isPlayingCry ? "Playing..." : t.pokemonDetail.playCry}</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800">
                <VolumeX className="w-3 h-3" />
                <span>No Cry Audio</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Details & Stats */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            {/* Title & Type Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                  {formatPokemonId(pokemon.id)}
                </span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                  {getDisplayName(pokemon)}
                </h1>
              </div>

              <div className="flex gap-2">
                {pokemon.types.map((type) => (
                  <PokemonTypeBadge key={type} type={type} size="md" />
                ))}
              </div>
            </div>

            {/* Flavor Text */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              &ldquo;{pokemon.flavorText.en}&rdquo;
            </p>

            {/* Physical Profile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {t.common.height}
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-base mt-0.5">
                  {pokemon.height} m
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {t.common.weight}
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-base mt-0.5">
                  {pokemon.weight} kg
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {t.common.abilities}
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-100 text-xs mt-0.5 capitalize truncate">
                  {pokemon.abilities.map((a) => a.name).join(", ")}
                </p>
              </div>
            </div>

            {/* Base Stats */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span>{t.pokemonDetail.baseStats}</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  Total: {pokemon.stats.total}
                </span>
              </div>
              <div className="space-y-2 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <PokemonStatBar label={t.common.hp} value={pokemon.stats.hp} />
                <PokemonStatBar label={t.common.attack} value={pokemon.stats.attack} />
                <PokemonStatBar label={t.common.defense} value={pokemon.stats.defense} />
                <PokemonStatBar label={t.common.spAtk} value={pokemon.stats.specialAttack} />
                <PokemonStatBar label={t.common.spDef} value={pokemon.stats.specialDefense} />
                <PokemonStatBar label={t.common.speed} value={pokemon.stats.speed} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {teamNotice && (
                <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-medium flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{teamNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Favorite */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(listItem)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    favorited
                      ? "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? "fill-red-600 text-red-600" : ""}`} />
                  <span>{favorited ? t.pokemonDetail.removeFromFavorites : t.pokemonDetail.addToFavorites}</span>
                </button>

                {/* Team */}
                <button
                  type="button"
                  onClick={handleTeamAction}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    inTeam
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                      : "bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>{inTeam ? t.pokemonDetail.removeFromTeam : t.pokemonDetail.addToTeam}</span>
                </button>

                {/* Compare */}
                <Link
                  href={`/compare?p1=${pokemon.id}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>{t.pokemonDetail.compareWith}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

