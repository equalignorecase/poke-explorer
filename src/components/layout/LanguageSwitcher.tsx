"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs font-semibold border border-slate-200">
      <Globe className="w-3.5 h-3.5 ml-1.5 text-slate-500" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2 py-0.5 rounded-full transition-all ${
          language === "en"
            ? "bg-red-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("th")}
        className={`px-2 py-0.5 rounded-full transition-all ${
          language === "th"
            ? "bg-red-600 text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
        aria-label="Switch to Thai"
      >
        TH
      </button>
    </div>
  );
}

