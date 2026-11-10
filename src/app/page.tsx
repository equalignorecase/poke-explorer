"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { PokemonArtwork } from "@/components/pokemon/PokemonArtwork";
import { PokemonTypeBadge } from "@/components/pokemon/PokemonTypeBadge";
import { PokemonListItem, PokemonTypeName } from "@/lib/pokeapi/types";
import { POKEMON_TYPES } from "@/lib/games/typeRelations";
import { capitalize, formatPokemonId, getDisplayName } from "@/lib/utils";
import {
  Sparkles,
  Gamepad2,
  Compass,
  ArrowRight,
  Shuffle,
  Eye,
  Volume2,
  TrendingUp,
  Shield,
  Layers,
  Swords,
  Heart,
} from "lucide-react";

// Featured starter/iconic Pokémon
const FEATURED_POKEMON: PokemonListItem[] = [
  {
    id: 1,
    name: "bulbasaur",
    japaneseName: { katakana: "フシギダネ", romaji: "Fushigidane" },
    types: ["grass", "poison"],
    generation: 1,
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    artwork: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
  },
  {
    id: 4,
    name: "charmander",
    japaneseName: { katakana: "ヒトカゲ", romaji: "Hitokage" },
    types: ["fire"],
    generation: 1,
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    artwork: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
  },
  {
    id: 7,
    name: "squirtle",
    japaneseName: { katakana: "ゼニガメ", romaji: "Zenigame" },
    types: ["water"],
    generation: 1,
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    artwork: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
  },
  {
    id: 25,
    name: "pikachu",
    japaneseName: { katakana: "ピカチュウ", romaji: "Pikachu" },
    types: ["electric"],
    generation: 1,
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    artwork: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
  },
  {
    id: 133,
    name: "eevee",
    japaneseName: { katakana: "イーブイ", romaji: "Eievui" },
    types: ["normal"],
    generation: 1,
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
    artwork: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
  },
  {
    id: 151,
    name: "mew",
    japaneseName: { katakana: "ミュウ", romaji: "Mew" },
    types: ["psychic"],
    generation: 1,
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
    artwork: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png",
  },
];

export default function HomePage() {
  const { t } = useLanguage();
  const [randomId, setRandomId] = useState<number>(25);
  const [randomPokemon, setRandomPokemon] = useState<any>(null);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);

  const fetchRandom = async (id: number) => {
    setIsLoadingRandom(true);
    try {
      const res = await fetch(`/api/pokemon/${id}`);
      if (res.ok) {
        const data = await res.json();
        setRandomPokemon(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingRandom(false);
    }
  };

  useEffect(() => {
    fetchRandom(randomId);
  }, [randomId]);

  const handleShuffle = () => {
    const nextId = Math.floor(Math.random() * 386) + 1;
    setRandomId(nextId);
  };

  const miniGamesList = [
    {
      title: t.games.guess.title,
      desc: t.games.guess.desc,
      href: "/games/guess",
      icon: Eye,
      tag: "Trivia",
    },
    {
      title: t.games.silhouette.title,
      desc: t.games.silhouette.desc,
      href: "/games/silhouette",
      icon: Sparkles,
      tag: "Visual",
    },
    {
      title: t.games.higherLower.title,
      desc: t.games.higherLower.desc,
      href: "/games/higher-lower",
      icon: TrendingUp,
      tag: "Stats",
    },
    {
      title: t.games.cry.title,
      desc: t.games.cry.desc,
      href: "/games/cry",
      icon: Volume2,
      tag: "Audio",
    },
    {
      title: t.games.typeMatch.title,
      desc: t.games.typeMatch.desc,
      href: "/games/type-match",
      icon: Shield,
      tag: "Knowledge",
    },
    {
      title: t.games.memory.title,
      desc: t.games.memory.desc,
      href: "/games/memory",
      icon: Layers,
      tag: "Puzzle",
    },
    {
      title: t.games.battle.title,
      desc: t.games.battle.desc,
      href: "/games/battle",
      icon: Swords,
      tag: "Simulator",
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PokéAPI v2 Powered</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {t.home.heroTitle}
            </h1>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              {t.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/pokedex"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Compass className="w-4 h-4" />
                <span>{t.home.explorePokedex}</span>
              </Link>
              <Link
                href="/games"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>{t.home.playGames}</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              <div className="absolute inset-0 bg-red-50 rounded-full scale-95" />
              <PokemonArtwork
                id={25}
                name="Pikachu"
                artwork="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                size={260}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Pokémon */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.home.featuredPokemon}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Popular and iconic Pokémon to jumpstart your adventure.
            </p>
          </div>
          <Link
            href="/pokedex"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700"
          >
            <span>{t.home.explorePokedex}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {FEATURED_POKEMON.map((pokemon) => (
            <Link
              key={pokemon.id}
              href={`/pokemon/${pokemon.id}`}
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center hover:border-red-400 hover:shadow-md transition-all group"
            >
              <span className="text-xs font-mono text-slate-400 mb-1">
                {formatPokemonId(pokemon.id)}
              </span>
              <PokemonArtwork
                id={pokemon.id}
                name={pokemon.name}
                artwork={pokemon.artwork}
                size={110}
              />
              <span className="font-bold text-slate-800 text-sm group-hover:text-red-600 mt-2 font-sans tracking-wide">
                {getDisplayName(pokemon)}
              </span>
              <div className="flex gap-1 mt-1.5">
                {pokemon.types.map((type) => (
                  <PokemonTypeBadge key={type} type={type} size="sm" />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Explore by Type */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {t.home.exploreByType}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter Pokémon instantly by their elemental affinities.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {POKEMON_TYPES.map((type) => (
            <Link key={type} href={`/pokedex?type=${type}`}>
              <PokemonTypeBadge type={type} size="md" />
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Mini Games Preview */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t.home.gamesPreview}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Challenge yourself across 7 diverse Pokémon games with zero required signup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {miniGamesList.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.href}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {game.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {game.desc}
                  </p>
                </div>

                <Link
                  href={game.href}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 hover:bg-red-600 hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  <span>Play</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Random Pokémon Spotlight */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.home.randomPokemon}</span>
            </div>
            {isLoadingRandom ? (
              <div className="h-20 animate-pulse bg-white/10 rounded-xl" />
            ) : randomPokemon ? (
              <div>
                <span className="text-xs font-mono text-slate-400">
                  {formatPokemonId(randomPokemon.id)}
                </span>
                <h3 className="text-3xl font-black tracking-tight mt-0.5 font-sans">
                  {getDisplayName(randomPokemon)}
                </h3>
                <p className="text-sm text-slate-300 mt-2 line-clamp-2 italic">
                  &ldquo;{randomPokemon.flavorText.en}&rdquo;
                </p>
                <div className="flex gap-2 mt-4">
                  {randomPokemon.types.map((type: PokemonTypeName) => (
                    <PokemonTypeBadge key={type} type={type} size="sm" />
                  ))}
                </div>
              </div>
            ) : null}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleShuffle}
                disabled={isLoadingRandom}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{t.home.randomCta}</span>
              </button>
              {randomPokemon && (
                <Link
                  href={`/pokemon/${randomPokemon.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white"
                >
                  <span>{t.common.viewDetails}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            {randomPokemon ? (
              <PokemonArtwork
                id={randomPokemon.id}
                name={randomPokemon.name}
                artwork={randomPokemon.artwork}
                size={200}
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-white/5 animate-pulse" />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
