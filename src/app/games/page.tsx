"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  Eye,
  Sparkles,
  TrendingUp,
  Volume2,
  Shield,
  Layers,
  Swords,
  ArrowRight,
  Gamepad2,
} from "lucide-react";

export default function GamesHubPage() {
  const { t } = useLanguage();

  const games = [
    {
      id: "guess",
      title: t.games.guess.title,
      desc: t.games.guess.desc,
      href: "/games/guess",
      icon: Eye,
      tag: "10 Rounds",
      color: "text-amber-500 bg-amber-50",
    },
    {
      id: "silhouette",
      title: t.games.silhouette.title,
      desc: t.games.silhouette.desc,
      href: "/games/silhouette",
      icon: Sparkles,
      tag: "Visual Challenge",
      color: "text-purple-600 bg-purple-50",
    },
    {
      id: "higher-lower",
      title: t.games.higherLower.title,
      desc: t.games.higherLower.desc,
      href: "/games/higher-lower",
      icon: TrendingUp,
      tag: "Stats Trivia",
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "cry",
      title: t.games.cry.title,
      desc: t.games.cry.desc,
      href: "/games/cry",
      icon: Volume2,
      tag: "Audio Quiz",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: "type-match",
      title: t.games.typeMatch.title,
      desc: t.games.typeMatch.desc,
      href: "/games/type-match",
      icon: Shield,
      tag: "Type Chart",
      color: "text-rose-600 bg-rose-50",
    },
    {
      id: "memory",
      title: t.games.memory.title,
      desc: t.games.memory.desc,
      href: "/games/memory",
      icon: Layers,
      tag: "Card Matching",
      color: "text-cyan-600 bg-cyan-50",
    },
    {
      id: "battle",
      title: t.games.battle.title,
      desc: t.games.battle.desc,
      href: "/games/battle",
      icon: Swords,
      tag: "Turn-based AI",
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>7 Playable Modes</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {t.games.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          {t.games.subtitle}
        </p>
      </div>

      {/* Grid of 7 games */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${game.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {game.tag}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  {game.title}
                </h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {game.desc}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href={game.href}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-red-600 hover:text-white text-slate-800 text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  <span>Play Game</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

