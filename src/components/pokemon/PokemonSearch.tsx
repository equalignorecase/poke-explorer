"use client";

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PokemonSearchProps {
  value: string;
  onChange: (val: string) => void;
  debounceMs?: number;
}

export function PokemonSearch({
  value,
  onChange,
  debounceMs = 300,
}: PokemonSearchProps) {
  const { t } = useLanguage();
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [internalValue, debounceMs, onChange, value]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={t.common.searchPlaceholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-xs"
      />
      {internalValue && (
        <button
          type="button"
          onClick={() => {
            setInternalValue("");
            onChange("");
          }}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

