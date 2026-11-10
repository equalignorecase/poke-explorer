"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { PokemonSearch } from "@/components/pokemon/PokemonSearch";
import { PokemonFilters } from "@/components/pokemon/PokemonFilters";
import { PokemonCard } from "@/components/pokemon/PokemonCard";
import { PokemonListItem } from "@/lib/pokeapi/types";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

function PokedexContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "");
  const [selectedGeneration, setSelectedGeneration] = useState(
    searchParams.get("gen") ? parseInt(searchParams.get("gen")!, 10) : 0
  );
  const [page, setPage] = useState(1);
  const [pageSize] = useState(24);

  const [items, setItems] = useState<PokemonListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setIsError(false);

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedType) params.set("type", selectedType);
    if (selectedGeneration) params.set("gen", selectedGeneration.toString());
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString());

    fetch(`/api/pokemon?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setItems(data.items || []);
          setTotal(data.total || 0);
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
    };
  }, [query, selectedType, selectedGeneration, page, pageSize]);

  // When filters or query change, reset page to 1
  const handleQueryChange = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setPage(1);
  };

  const handleGenerationChange = (gen: number) => {
    setSelectedGeneration(gen);
    setPage(1);
  };

  const handleResetFilters = () => {
    setQuery("");
    setSelectedType("");
    setSelectedGeneration(0);
    setPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {t.pokedex.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t.pokedex.subtitle}
        </p>
      </div>

      {/* Search & Filters Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <PokemonSearch value={query} onChange={handleQueryChange} />
          </div>
          <PokemonFilters
            selectedType={selectedType}
            onSelectType={handleTypeChange}
            selectedGeneration={selectedGeneration}
            onSelectGeneration={handleGenerationChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Count indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
          <span>
            {t.pokedex.showing} {items.length} {t.pokedex.of} {total} {t.pokedex.pokemon}
          </span>
          {totalPages > 1 && (
            <span>
              Page {page} of {totalPages}
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <p className="text-sm font-medium">{t.common.loading}</p>
        </div>
      ) : isError ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">{t.common.error}</h3>
          <button
            type="button"
            onClick={() => setPage(page)}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer"
          >
            {t.common.retry}
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <p className="text-slate-500 text-sm font-medium">{t.common.noResults}</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
          >
            {t.common.reset}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <span className="px-4 py-2 text-xs font-semibold text-slate-600">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PokedexPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <PokedexContent />
    </Suspense>
  );
}

