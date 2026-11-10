import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { JapaneseName } from "./pokeapi/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPokemonId(id: number | string): string {
  const num = typeof id === "string" ? parseInt(id, 10) : id;
  if (isNaN(num)) return `#${id}`;
  return `#${num.toString().padStart(4, "0")}`;
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
}

export function getDisplayName(pokemon?: {
  name: string;
  japaneseName?: JapaneseName;
} | null): string {
  if (!pokemon) return "";
  return pokemon.japaneseName?.katakana || capitalize(pokemon.name);
}
