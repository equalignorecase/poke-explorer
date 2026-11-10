import { describe, it, expect } from "vitest";
import {
  getDifficultyRange,
  getRandomPokemonId,
  generateQuizOptions,
  calculateAccuracy,
} from "@/lib/games/engine";
import { formatPokemonId, capitalize } from "@/lib/utils";

describe("Engine & Utility Functions", () => {
  it("formats Pokémon ID correctly", () => {
    expect(formatPokemonId(1)).toBe("#0001");
    expect(formatPokemonId(25)).toBe("#0025");
    expect(formatPokemonId("151")).toBe("#0151");
    expect(formatPokemonId(1025)).toBe("#1025");
  });

  it("capitalizes strings and hyphens correctly", () => {
    expect(capitalize("pikachu")).toBe("Pikachu");
    expect(capitalize("ho-oh")).toBe("Ho oh");
    expect(capitalize("")).toBe("");
  });

  it("returns correct ranges for difficulty levels", () => {
    expect(getDifficultyRange("easy")).toEqual({ start: 1, end: 151 });
    expect(getDifficultyRange("normal")).toEqual({ start: 1, end: 386 });
    expect(getDifficultyRange("hard")).toEqual({ start: 1, end: 1025 });
  });

  it("generates random Pokémon ID within difficulty boundary and honors exclude list", () => {
    const id = getRandomPokemonId("easy", [1, 2, 3]);
    expect(id).toBeGreaterThanOrEqual(1);
    expect(id).toBeLessThanOrEqual(151);
    expect([1, 2, 3]).not.toContain(id);
  });

  it("generates exactly N unique quiz choices with correct answer included", () => {
    const correct = { id: 25, name: "pikachu" };
    const candidates = [
      { id: 1, name: "bulbasaur" },
      { id: 4, name: "charmander" },
      { id: 7, name: "squirtle" },
      { id: 133, name: "eevee" },
      { id: 151, name: "mew" },
    ];

    const options = generateQuizOptions(correct, candidates, 4);
    expect(options.length).toBe(4);
    expect(options.some((o) => o.id === 25)).toBe(true);

    const ids = options.map((o) => o.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(4);
  });

  it("calculates accuracy percentage accurately", () => {
    expect(calculateAccuracy(100, 100)).toBe(100);
    expect(calculateAccuracy(70, 100)).toBe(70);
    expect(calculateAccuracy(0, 100)).toBe(0);
    expect(calculateAccuracy(5, 0)).toBe(0);
  });
});
