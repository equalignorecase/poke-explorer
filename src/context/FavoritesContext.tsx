"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { PokemonListItem } from "@/lib/pokeapi/types";

interface FavoritesContextType {
  favorites: PokemonListItem[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (pokemon: PokemonListItem) => void;
  removeFavorite: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // Temporary state only - per requirements: "Favorites must NOT permanently save user data"
  const [favorites, setFavorites] = useState<PokemonListItem[]>([]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((item) => item.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((pokemon: PokemonListItem) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === pokemon.id);
      if (exists) {
        return prev.filter((item) => item.id !== pokemon.id);
      }
      return [...prev, pokemon];
    });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

