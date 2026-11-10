export type PokemonTypeName =
  | "normal"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "steel"
  | "fairy"
  | "dark";

export interface PokemonListItem {
  id: number;
  name: string;
  thaiName?: string;
  types: PokemonTypeName[];
  generation: number;
  sprite: string;
  artwork: string;
}

export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  total: number;
}

export interface PokemonDetailData {
  id: number;
  name: string;
  thaiName?: string;
  types: PokemonTypeName[];
  generation: number;
  artwork: string;
  sprite: string;
  shinyArtwork: string;
  shinySprite: string;
  height: number; // in meters
  weight: number; // in kg
  abilities: { name: string; is_hidden: boolean }[];
  stats: PokemonStats;
  cries: {
    latest: string | null;
    legacy: string | null;
  };
  flavorText: {
    en: string;
    th?: string;
  };
}

