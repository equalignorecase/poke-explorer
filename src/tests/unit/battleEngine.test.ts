import { describe, it, expect } from "vitest";
import {
  createCombatant,
  calculateDamage,
  resolveTurn,
  BattleState,
} from "@/lib/games/battleEngine";
import { PokemonDetailData } from "@/lib/pokeapi/types";

describe("Battle Simulator Engine", () => {
  const dummyPikachu: PokemonDetailData = {
    id: 25,
    name: "pikachu",
    types: ["electric"],
    generation: 1,
    artwork: "",
    sprite: "",
    shinyArtwork: "",
    shinySprite: "",
    height: 0.4,
    weight: 6,
    abilities: [],
    stats: {
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90,
      total: 320,
    },
    cries: { latest: null, legacy: null },
    flavorText: { en: "Pikachu test" },
  };

  const dummyGyarados: PokemonDetailData = {
    id: 130,
    name: "gyarados",
    types: ["water", "flying"],
    generation: 1,
    artwork: "",
    sprite: "",
    shinyArtwork: "",
    shinySprite: "",
    height: 6.5,
    weight: 235,
    abilities: [],
    stats: {
      hp: 95,
      attack: 125,
      defense: 79,
      specialAttack: 60,
      specialDefense: 100,
      speed: 81,
      total: 540,
    },
    cries: { latest: null, legacy: null },
    flavorText: { en: "Gyarados test" },
  };

  it("calculates derived combat stats correctly", () => {
    const combatant = createCombatant(dummyPikachu);
    expect(combatant.maxHp).toBe(100 + 35 * 2); // 170
    expect(combatant.currentHp).toBe(170);
    expect(combatant.attack).toBe(55);
    expect(combatant.speed).toBe(90);
  });

  it("applies type advantages in battle calculations", () => {
    const pika = createCombatant(dummyPikachu);
    const gyarados = createCombatant(dummyGyarados);

    // Electric vs Water/Flying is 4x super effective
    const { damage, multiplier, effectiveness } = calculateDamage(pika, gyarados, "power");
    expect(multiplier).toBe(4);
    expect(effectiveness).toBe("super");
    expect(damage).toBeGreaterThan(50);
  });

  it("resolves a turn and manages combat HP and winner", () => {
    const player = createCombatant(dummyPikachu);
    const opponent = createCombatant(dummyGyarados);

    const initialState: BattleState = {
      player,
      opponent,
      turn: 0,
      logs: [],
      winner: null,
      isResolving: false,
    };

    const nextState = resolveTurn(initialState, "quick");
    expect(nextState.turn).toBe(1);
    expect(nextState.logs.length).toBeGreaterThan(0);
    expect(nextState.player.currentHp).toBeLessThanOrEqual(nextState.player.maxHp);
    expect(nextState.opponent.currentHp).toBeLessThanOrEqual(nextState.opponent.maxHp);
  });
});

