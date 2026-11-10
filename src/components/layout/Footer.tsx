"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldAlert } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
              Pokédex Explorer
            </div>
            <p className="mt-1 text-slate-500 max-w-md">
              {t.home.aboutSnippet}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-600">
            <Link href="/pokedex" className="hover:text-red-600 transition-colors">
              {t.nav.pokedex}
            </Link>
            <Link href="/compare" className="hover:text-red-600 transition-colors">
              {t.nav.compare}
            </Link>
            <Link href="/team" className="hover:text-red-600 transition-colors">
              {t.nav.team}
            </Link>
            <Link href="/games" className="hover:text-red-600 transition-colors">
              {t.nav.games}
            </Link>
            <Link href="/about" className="hover:text-red-600 transition-colors">
              {t.nav.about}
            </Link>
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-600 transition-colors underline"
            >
              PokéAPI v2
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-400">
          <p className="flex items-center gap-1.5 leading-relaxed">
            <ShieldAlert className="w-4 h-4 shrink-0 text-slate-400" />
            <span>{t.about.disclaimerText}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
