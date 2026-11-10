import { describe, it, expect } from "vitest";
import {
  getTypeMultiplier,
  getDefensiveWeaknesses,
  getTeamTypeDistribution,
  getTeamDefensiveWeaknesses,
} from "@/lib/games/typeRelations";
import { PokemonListItem } from "@/lib/pokeapi/types";

describe("Type Relations System", () => {
  it("calculates single-type effectiveness correctly", () => {
    expect(getTypeMultiplier("fire", ["grass"])).toBe(2);
    expect(getTypeMultiplier("water", ["fire"])).toBe(2);
    expect(getTypeMultiplier("electric", ["ground"])).toBe(0);
    expect(getTypeMultiplier("fighting", ["ghost"])).toBe(0);
    expect(getTypeMultiplier("normal", ["ghost"])).toBe(0);
    expect(getTypeMultiplier("fire", ["water"])).toBe(0.5);
    expect(getTypeMultiplier("normal", ["normal"])).toBe(1);
  });

  it("calculates dual-type effectiveness multiplicatively", () => {
    // Charizard: Fire / Flying -> Rock moves deal 2 * 2 = 4x
    expect(getTypeMultiplier("rock", ["fire", "flying"])).toBe(4);

    // Bulbasaur: Grass / Poison -> Fire deals 2 * 1 = 2x
    expect(getTypeMultiplier("fire", ["grass", "poison"])).toBe(2);

    // Swampert: Water / Ground -> Grass deals 2 * 2 = 4x, Electric deals 2 * 0 = 0x
    expect(getTypeMultiplier("grass", ["water", "ground"])).toBe(4);
    expect(getTypeMultiplier("electric", ["water", "ground"])).toBe(0);
  });

  it("returns weaknesses for a dual type", () => {
    // Gyarados: Water / Flying -> weak to Electric (4x) and Rock (2x)
    const weaknesses = getDefensiveWeaknesses(["water", "flying"]);
    const electric = weaknesses.find((w) => w.type === "electric");
    const rock = weaknesses.find((w) => w.type === "rock");

    expect(electric?.multiplier).toBe(4);
    expect(rock?.multiplier).toBe(2);
  });

  it("calculates team type distribution and defensive weaknesses", () => {
    const dummyTeam: PokemonListItem[] = [
      {
        id: 1,
        name: "bulbasaur",
        types: ["grass", "poison"],
        generation: 1,
        sprite: "",
        artwork: "",
      },
      {
        id: 4,
        name: "charmander",
        types: ["fire"],
        generation: 1,
        sprite: "",
        artwork: "",
      },
      {
        id: 7,
        name: "squirtle",
        types: ["water"],
        generation: 1,
        sprite: "",
        artwork: "",
      },
    ];

    const distribution = getTeamTypeDistribution(dummyTeam);
    expect(distribution.grass).toBe(1);
    expect(distribution.poison).toBe(1);
    expect(distribution.fire).toBe(1);
    expect(distribution.water).toBe(1);
    expect(distribution.dragon).toBe(0);

    const weaknesses = getTeamDefensiveWeaknesses(dummyTeam);
    expect(weaknesses.length).toBeGreaterThan(0);
  });
});

