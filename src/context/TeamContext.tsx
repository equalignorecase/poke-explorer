"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { PokemonListItem } from "@/lib/pokeapi/types";

interface TeamContextType {
  team: PokemonListItem[];
  addToTeam: (pokemon: PokemonListItem) => { success: boolean; reason?: "full" | "duplicate" };
  removeFromTeam: (id: number) => void;
  isInTeam: (id: number) => boolean;
  reorderTeam: (startIndex: number, endIndex: number) => void;
  clearTeam: () => void;
  isFull: boolean;
}

const MAX_TEAM_SIZE = 6;
const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  // Temporary state only - per requirements: "Team selections must NOT permanently save user data"
  const [team, setTeam] = useState<PokemonListItem[]>([]);

  const isInTeam = useCallback(
    (id: number) => team.some((p) => p.id === id),
    [team]
  );

  const addToTeam = useCallback(
    (pokemon: PokemonListItem): { success: boolean; reason?: "full" | "duplicate" } => {
      if (team.some((p) => p.id === pokemon.id)) {
        return { success: false, reason: "duplicate" };
      }
      if (team.length >= MAX_TEAM_SIZE) {
        return { success: false, reason: "full" };
      }
      let added = false;
      setTeam((prev) => {
        if (prev.some((p) => p.id === pokemon.id) || prev.length >= MAX_TEAM_SIZE) {
          return prev;
        }
        added = true;
        return [...prev, pokemon];
      });
      return added ? { success: true } : { success: false, reason: "full" };
    },
    [team]
  );

  const removeFromTeam = useCallback((id: number) => {
    setTeam((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const reorderTeam = useCallback((startIndex: number, endIndex: number) => {
    setTeam((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const clearTeam = useCallback(() => {
    setTeam([]);
  }, []);

  return (
    <TeamContext.Provider
      value={{
        team,
        addToTeam,
        removeFromTeam,
        isInTeam,
        reorderTeam,
        clearTeam,
        isFull: team.length >= MAX_TEAM_SIZE,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
}
