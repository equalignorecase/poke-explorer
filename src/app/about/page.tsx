"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  ShieldAlert,
  Code2,
  Database,
  Globe,
  ExternalLink,
} from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Title */}
      <div className="space-y-3">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {t.about.title}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {t.about.description}
        </p>
      </div>

      {/* Fan Project & Copyright Disclaimer */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <span>{t.about.disclaimerTitle}</span>
        </div>
        <p className="text-xs text-amber-900/80 leading-relaxed">
          {t.about.disclaimerText}
        </p>
      </div>

      {/* Tech Stack */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Code2 className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-bold text-slate-900">
            {t.about.techStack}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 text-sm">Next.js App Router</span>
            <p className="text-slate-500">
              Modern React Server & Client Components architecture with fast route handling.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 text-sm">TypeScript & Strict Mode</span>
            <p className="text-slate-500">
              End-to-end typed API contracts, game models, and deterministic state transitions.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 text-sm">Tailwind CSS</span>
            <p className="text-slate-500">
              Clean, Modern Minimal design system with accessible contrast and smooth responsiveness.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 text-sm">PokéAPI v2 & TanStack Query</span>
            <p className="text-slate-500">
              Real-time API integration with client-side deduplication and in-memory caching.
            </p>
          </div>
        </div>
      </div>

      {/* Data Storage Policy */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Privacy & Ephemeral Memory
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Pokédex Explorer respects user privacy completely. The application does NOT use persistent cookies, localStorage, IndexedDB, or user tracking databases. All favorites, team selections, and game scores exist exclusively within the browser&apos;s runtime memory for the current session.
        </p>
      </div>

      {/* PokéAPI Credits */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-slate-900">
              {t.about.apiCredit}
            </h2>
          </div>
          <a
            href="https://pokeapi.co/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
          >
            <span>pokeapi.co</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          All Pokémon information, stats, cries, and official artwork are fetched from the public PokéAPI v2 database. We are grateful to the PokéAPI community for maintaining this exceptional developer resource.
        </p>
      </div>
    </div>
  );
}
