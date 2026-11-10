import {
  PokemonDetailData,
  PokemonListItem,
  PokemonTypeName,
  PokemonStats,
} from "./types";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

export const GENERATION_RANGES: { gen: number; name: string; start: number; end: number }[] = [
  { gen: 1, name: "Generation I (Kanto)", start: 1, end: 151 },
  { gen: 2, name: "Generation II (Johto)", start: 152, end: 251 },
  { gen: 3, name: "Generation III (Hoenn)", start: 252, end: 386 },
  { gen: 4, name: "Generation IV (Sinnoh)", start: 387, end: 493 },
  { gen: 5, name: "Generation V (Unova)", start: 494, end: 649 },
  { gen: 6, name: "Generation VI (Kalos)", start: 650, end: 721 },
  { gen: 7, name: "Generation VII (Alola)", start: 722, end: 809 },
  { gen: 8, name: "Generation VIII (Galar)", start: 810, end: 905 },
  { gen: 9, name: "Generation IX (Paldea)", start: 906, end: 1025 },
];

export function getGenerationFromId(id: number): number {
  for (const range of GENERATION_RANGES) {
    if (id >= range.start && id <= range.end) {
      return range.gen;
    }
  }
  return 9;
}

export function cleanFlavorText(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\f\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetch wrapper with error handling and Next.js revalidation
 */
async function fetchPokeApi<T>(endpoint: string, revalidate = 86400): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${POKEAPI_BASE}${endpoint}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`PokéAPI request failed: ${res.status} ${res.statusText} (${url})`);
  }

  return res.json() as Promise<T>;
}

export async function getPokemon(idOrName: string | number): Promise<PokemonDetailData> {
  const [pokemon, species] = await Promise.all([
    fetchPokeApi<any>(`/pokemon/${idOrName}`),
    fetchPokeApi<any>(`/pokemon-species/${idOrName}`).catch(() => null),
  ]);

  const id = pokemon.id;
  const types: PokemonTypeName[] = pokemon.types.map((t: any) => t.type.name as PokemonTypeName);

  const rawStats = pokemon.stats.reduce((acc: any, s: any) => {
    acc[s.stat.name] = s.base_stat;
    return acc;
  }, {});

  const stats: PokemonStats = {
    hp: rawStats["hp"] || 50,
    attack: rawStats["attack"] || 50,
    defense: rawStats["defense"] || 50,
    specialAttack: rawStats["special-attack"] || 50,
    specialDefense: rawStats["special-defense"] || 50,
    speed: rawStats["speed"] || 50,
    total:
      (rawStats["hp"] || 50) +
      (rawStats["attack"] || 50) +
      (rawStats["defense"] || 50) +
      (rawStats["special-attack"] || 50) +
      (rawStats["special-defense"] || 50) +
      (rawStats["speed"] || 50),
  };

  const artwork =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  const shinyArtwork =
    pokemon.sprites?.other?.["official-artwork"]?.front_shiny ||
    pokemon.sprites?.front_shiny ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;

  const sprite =
    pokemon.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  const shinySprite =
    pokemon.sprites?.front_shiny ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;

  // English description
  let enFlavor = "A remarkable Pokémon.";
  if (species?.flavor_text_entries) {
    const enEntry = species.flavor_text_entries.find(
      (entry: any) => entry.language.name === "en"
    );
    if (enEntry) {
      enFlavor = cleanFlavorText(enEntry.flavor_text);
    }
  }

  // Generation detection
  let generation = getGenerationFromId(id);
  if (species?.generation?.url) {
    const genSegments = species.generation.url.split("/").filter(Boolean);
    const genId = parseInt(genSegments[genSegments.length - 1], 10);
    if (!isNaN(genId)) {
      generation = genId;
    }
  }

  return {
    id,
    name: pokemon.name,
    types,
    generation,
    artwork,
    sprite,
    shinyArtwork,
    shinySprite,
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    abilities: pokemon.abilities.map((a: any) => ({
      name: a.ability.name,
      is_hidden: a.is_hidden,
    })),
    stats,
    cries: {
      latest: pokemon.cries?.latest || null,
      legacy: pokemon.cries?.legacy || null,
    },
    flavorText: {
      en: enFlavor,
    },
  };
}

export async function getPokemonSpecies(idOrName: string | number) {
  return fetchPokeApi<any>(`/pokemon-species/${idOrName}`);
}

export async function getPokemonType(idOrName: string | number) {
  return fetchPokeApi<any>(`/type/${idOrName}`);
}

export async function getPokemonGeneration(idOrName: string | number) {
  return fetchPokeApi<any>(`/generation/${idOrName}`);
}

export async function getPokemonEvolutionChain(id: number) {
  return fetchPokeApi<any>(`/evolution-chain/${id}`);
}

export async function getPokemonByIds(ids: number[]): Promise<PokemonListItem[]> {
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const p = await getPokemon(id);
        return {
          id: p.id,
          name: p.name,
          types: p.types,
          generation: p.generation,
          sprite: p.sprite,
          artwork: p.artwork,
        };
      } catch {
        return {
          id,
          name: `pokemon-${id}`,
          types: ["normal" as PokemonTypeName],
          generation: getGenerationFromId(id),
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      }
    })
  );
  return results;
}

/**
 * Filtered Pokémon search with generation & type intersection logic
 */
export async function getFilteredPokemonList({
  query = "",
  type = "",
  generation = 0,
  page = 1,
  pageSize = 24,
}: {
  query?: string;
  type?: string;
  generation?: number;
  page?: number;
  pageSize?: number;
}): Promise<{ total: number; page: number; pageSize: number; items: PokemonListItem[] }> {
  // 1. Fetch base names & ids
  let eligibleList: { id: number; name: string }[] = [];

  if (generation > 0) {
    const genData = await getPokemonGeneration(generation);
    eligibleList = genData.pokemon_species.map((s: any) => {
      const parts = s.url.split("/").filter(Boolean);
      return {
        id: parseInt(parts[parts.length - 1], 10),
        name: s.name,
      };
    });
  } else {
    // Up to 1025 standard Pokemon
    const allList = await fetchPokeApi<{ results: { name: string; url: string }[] }>(
      `/pokemon?limit=1025&offset=0`
    );
    eligibleList = allList.results.map((p, idx) => ({
      id: idx + 1,
      name: p.name,
    }));
  }

  // 2. Intersect with Type filter if provided
  if (type) {
    const typeData = await getPokemonType(type);
    const typePokemonNames = new Set(typeData.pokemon.map((p: any) => p.pokemon.name));
    eligibleList = eligibleList.filter((p) => typePokemonNames.has(p.name));
  }

  // 3. Search query filter
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    eligibleList = eligibleList.filter(
      (p) => p.name.toLowerCase().includes(q) || p.id.toString() === q.replace(/^#/, "")
    );
  }

  // Sort by ID
  eligibleList.sort((a, b) => a.id - b.id);

  const total = eligibleList.length;
  const start = (page - 1) * pageSize;
  const pageSlice = eligibleList.slice(start, start + pageSize);

  // Fetch details for only the slice
  const items = await getPokemonByIds(pageSlice.map((p) => p.id));

  return {
    total,
    page,
    pageSize,
    items,
  };
}
