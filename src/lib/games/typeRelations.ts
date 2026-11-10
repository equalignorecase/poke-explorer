import { PokemonTypeName, PokemonListItem } from "../pokeapi/types";

export const POKEMON_TYPES: PokemonTypeName[] = [
  "normal",
  "fire",
  "water",
  "grass",
  "electric",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "steel",
  "fairy",
  "dark",
];

export const TYPE_COLORS: Record<PokemonTypeName, { bg: string; text: string; badge: string }> = {
  normal: { bg: "bg-slate-400", text: "text-white", badge: "#94A3B8" },
  fire: { bg: "bg-orange-500", text: "text-white", badge: "#F97316" },
  water: { bg: "bg-blue-500", text: "text-white", badge: "#3B82F6" },
  grass: { bg: "bg-emerald-500", text: "text-white", badge: "#10B981" },
  electric: { bg: "bg-amber-400", text: "text-slate-900", badge: "#FBBF24" },
  ice: { bg: "bg-cyan-400", text: "text-slate-900", badge: "#22D3EE" },
  fighting: { bg: "bg-red-700", text: "text-white", badge: "#B91C1C" },
  poison: { bg: "bg-purple-600", text: "text-white", badge: "#9333EA" },
  ground: { bg: "bg-amber-700", text: "text-white", badge: "#B45309" },
  flying: { bg: "bg-indigo-400", text: "text-white", badge: "#818CF8" },
  psychic: { bg: "bg-pink-500", text: "text-white", badge: "#EC4899" },
  bug: { bg: "bg-lime-600", text: "text-white", badge: "#65A30D" },
  rock: { bg: "bg-stone-500", text: "text-white", badge: "#78716C" },
  ghost: { bg: "bg-violet-700", text: "text-white", badge: "#6D28D9" },
  dragon: { bg: "bg-violet-600", text: "text-white", badge: "#7C3AED" },
  steel: { bg: "bg-slate-500", text: "text-white", badge: "#64748B" },
  fairy: { bg: "bg-rose-400", text: "text-white", badge: "#FB7185" },
  dark: { bg: "bg-neutral-800", text: "text-white", badge: "#262626" },
};

// Attack multiplier: offensiveType -> defendingType -> multiplier
export const TYPE_CHART: Record<PokemonTypeName, Partial<Record<PokemonTypeName, number>>> = {
  normal: {
    rock: 0.5,
    ghost: 0,
    steel: 0.5,
  },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: {
    fire: 2,
    water: 0.5,
    grass: 0.5,
    ground: 2,
    rock: 2,
    dragon: 0.5,
  },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: {
    fighting: 2,
    poison: 2,
    psychic: 0.5,
    dark: 0,
    steel: 0.5,
  },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: {
    normal: 0,
    psychic: 2,
    ghost: 2,
    dark: 0.5,
  },
  dragon: {
    dragon: 2,
    steel: 0.5,
    fairy: 0,
  },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2,
  },
  fairy: {
    fire: 0.5,
    fighting: 2,
    poison: 0.5,
    dragon: 2,
    dark: 2,
    steel: 0.5,
  },
  dark: {
    fighting: 0.5,
    psychic: 2,
    ghost: 2,
    dark: 0.5,
    fairy: 0.5,
  },
};

/**
 * Calculate the exact damage multiplier of an attacking move against defending types
 */
export function getTypeMultiplier(
  moveType: PokemonTypeName,
  defenderTypes: PokemonTypeName[]
): number {
  if (!defenderTypes.length) return 1;

  let multiplier = 1;
  const attackRelations = TYPE_CHART[moveType] || {};

  for (const defType of defenderTypes) {
    if (defType in attackRelations) {
      multiplier *= attackRelations[defType]!;
    }
  }

  return multiplier;
}

/**
 * Returns weak types (>1x effectiveness) against a specific defending dual-type
 */
export function getDefensiveWeaknesses(
  defenderTypes: PokemonTypeName[]
): { type: PokemonTypeName; multiplier: number }[] {
  const result: { type: PokemonTypeName; multiplier: number }[] = [];

  for (const atkType of POKEMON_TYPES) {
    const mult = getTypeMultiplier(atkType, defenderTypes);
    if (mult > 1) {
      result.push({ type: atkType, multiplier: mult });
    }
  }

  return result.sort((a, b) => b.multiplier - a.multiplier);
}

/**
 * Calculate team type distribution
 */
export function getTeamTypeDistribution(
  team: PokemonListItem[]
): Record<PokemonTypeName, number> {
  const counts = POKEMON_TYPES.reduce((acc, t) => {
    acc[t] = 0;
    return acc;
  }, {} as Record<PokemonTypeName, number>);

  for (const pokemon of team) {
    for (const t of pokemon.types) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }

  return counts;
}

/**
 * Calculate team-wide defensive weaknesses (number of Pokémon weak to each incoming type)
 */
export function getTeamDefensiveWeaknesses(
  team: PokemonListItem[]
): { type: PokemonTypeName; weakCount: number; resistCount: number }[] {
  return POKEMON_TYPES.map((incomingType) => {
    let weakCount = 0;
    let resistCount = 0;

    for (const pokemon of team) {
      const mult = getTypeMultiplier(incomingType, pokemon.types);
      if (mult > 1) {
        weakCount += 1;
      } else if (mult < 1) {
        resistCount += 1;
      }
    }

    return { type: incomingType, weakCount, resistCount };
  }).filter((item) => item.weakCount > 0)
    .sort((a, b) => b.weakCount - a.weakCount);
}

