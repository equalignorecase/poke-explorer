import { PokemonDetailData, PokemonTypeName } from "../pokeapi/types";
import { getTypeMultiplier } from "./typeRelations";

export type BattleAction = "quick" | "power" | "defend";

export interface Combatant {
  id: number;
  name: string;
  types: PokemonTypeName[];
  artwork: string;
  maxHp: number;
  currentHp: number;
  attack: number;
  defense: number;
  speed: number;
  isDefending: boolean;
}

export interface BattleTurnLog {
  turn: number;
  actor: "player" | "opponent";
  action: BattleAction;
  damage: number;
  effectiveness: "super" | "normal" | "notVery" | "immune" | "defend";
  text: string;
}

export interface BattleState {
  player: Combatant;
  opponent: Combatant;
  turn: number;
  logs: BattleTurnLog[];
  winner: "player" | "opponent" | null;
  isResolving: boolean;
}

export function createCombatant(pokemon: PokemonDetailData): Combatant {
  // Simplified derived stats from base stats
  const maxHp = 100 + pokemon.stats.hp * 2;
  const attack = Math.max(pokemon.stats.attack, pokemon.stats.specialAttack);
  const defense = Math.max(pokemon.stats.defense, pokemon.stats.specialDefense);
  const speed = pokemon.stats.speed;
  const displayName = pokemon.japaneseName?.katakana || pokemon.name;

  return {
    id: pokemon.id,
    name: displayName,
    types: pokemon.types,
    artwork: pokemon.artwork,
    maxHp,
    currentHp: maxHp,
    attack,
    defense,
    speed,
    isDefending: false,
  };
}

export function calculateDamage(
  attacker: Combatant,
  defender: Combatant,
  action: BattleAction
): { damage: number; multiplier: number; effectiveness: BattleTurnLog["effectiveness"] } {
  if (action === "defend") {
    return { damage: 0, multiplier: 1, effectiveness: "defend" };
  }

  const actionPower = action === "quick" ? 35 : 65;
  const primaryType = attacker.types[0] || "normal";
  const typeMultiplier = getTypeMultiplier(primaryType, defender.types);

  if (typeMultiplier === 0) {
    return { damage: 0, multiplier: 0, effectiveness: "immune" };
  }

  // Bounded random factor between 0.90 and 1.10
  const randomFactor = 0.9 + Math.random() * 0.2;

  let rawDamage = (actionPower * attacker.attack) / Math.max(1, defender.defense);
  rawDamage *= typeMultiplier * randomFactor;

  // Defend action halves incoming damage
  if (defender.isDefending) {
    rawDamage *= 0.5;
  }

  const damage = Math.max(1, Math.floor(rawDamage));

  let effectiveness: BattleTurnLog["effectiveness"] = "normal";
  if (typeMultiplier >= 2) effectiveness = "super";
  else if (typeMultiplier < 1) effectiveness = "notVery";

  return { damage, multiplier: typeMultiplier, effectiveness };
}

/**
 * Determine AI move based on player state and type relations
 */
export function chooseAiAction(ai: Combatant, player: Combatant): BattleAction {
  // If low HP (under 25%), 40% chance to defend
  if (ai.currentHp < ai.maxHp * 0.25 && Math.random() < 0.4) {
    return "defend";
  }

  const primaryType = ai.types[0] || "normal";
  const mult = getTypeMultiplier(primaryType, player.types);

  if (mult >= 2) {
    // Super effective: prefer Power Attack
    return Math.random() < 0.75 ? "power" : "quick";
  }

  // Default distribution: 45% Quick, 45% Power, 10% Defend
  const rand = Math.random();
  if (rand < 0.45) return "quick";
  if (rand < 0.90) return "power";
  return "defend";
}

/**
 * Resolves a full turn given player and AI actions
 */
export function resolveTurn(
  current: BattleState,
  playerAction: BattleAction
): BattleState {
  if (current.winner) return current;

  const nextPlayer = { ...current.player, isDefending: playerAction === "defend" };
  const aiAction = chooseAiAction(current.opponent, current.player);
  const nextOpponent = { ...current.opponent, isDefending: aiAction === "defend" };

  const logs: BattleTurnLog[] = [...current.logs];
  const turnNum = current.turn + 1;

  // Action Priority: Quick Attack (1), Power Attack (0), Defend (2)
  const getPriority = (a: BattleAction) => (a === "defend" ? 2 : a === "quick" ? 1 : 0);

  const playerPriority = getPriority(playerAction);
  const aiPriority = getPriority(aiAction);

  let playerGoesFirst = true;
  if (playerPriority > aiPriority) {
    playerGoesFirst = true;
  } else if (aiPriority > playerPriority) {
    playerGoesFirst = false;
  } else {
    // Speed tie-breaker
    if (nextPlayer.speed === nextOpponent.speed) {
      playerGoesFirst = Math.random() < 0.5;
    } else {
      playerGoesFirst = nextPlayer.speed > nextOpponent.speed;
    }
  }

  // Execute first attack
  const executePlayerAttack = () => {
    if (playerAction === "defend") {
      logs.push({
        turn: turnNum,
        actor: "player",
        action: "defend",
        damage: 0,
        effectiveness: "defend",
        text: `${nextPlayer.name.toUpperCase()} braced itself and took a defensive stance!`,
      });
      return;
    }
    const { damage, effectiveness } = calculateDamage(nextPlayer, nextOpponent, playerAction);
    nextOpponent.currentHp = Math.max(0, nextOpponent.currentHp - damage);

    const effText =
      effectiveness === "super"
        ? "It's super effective!"
        : effectiveness === "notVery"
        ? "It's not very effective..."
        : effectiveness === "immune"
        ? "It had no effect!"
        : "";

    logs.push({
      turn: turnNum,
      actor: "player",
      action: playerAction,
      damage,
      effectiveness,
      text: `${nextPlayer.name.toUpperCase()} used ${playerAction === "quick" ? "Quick Attack" : "Power Attack"} dealing ${damage} damage! ${effText}`,
    });
  };

  const executeAiAttack = () => {
    if (aiAction === "defend") {
      logs.push({
        turn: turnNum,
        actor: "opponent",
        action: "defend",
        damage: 0,
        effectiveness: "defend",
        text: `${nextOpponent.name.toUpperCase()} braced itself and took a defensive stance!`,
      });
      return;
    }
    const { damage, effectiveness } = calculateDamage(nextOpponent, nextPlayer, aiAction);
    nextPlayer.currentHp = Math.max(0, nextPlayer.currentHp - damage);

    const effText =
      effectiveness === "super"
        ? "It's super effective!"
        : effectiveness === "notVery"
        ? "It's not very effective..."
        : effectiveness === "immune"
        ? "It had no effect!"
        : "";

    logs.push({
      turn: turnNum,
      actor: "opponent",
      action: aiAction,
      damage,
      effectiveness,
      text: `${nextOpponent.name.toUpperCase()} used ${aiAction === "quick" ? "Quick Attack" : "Power Attack"} dealing ${damage} damage! ${effText}`,
    });
  };

  if (playerGoesFirst) {
    executePlayerAttack();
    if (nextOpponent.currentHp > 0) {
      executeAiAttack();
    }
  } else {
    executeAiAttack();
    if (nextPlayer.currentHp > 0) {
      executePlayerAttack();
    }
  }

  let winner: "player" | "opponent" | null = null;
  if (nextOpponent.currentHp <= 0) {
    winner = "player";
  } else if (nextPlayer.currentHp <= 0) {
    winner = "opponent";
  }

  return {
    player: nextPlayer,
    opponent: nextOpponent,
    turn: turnNum,
    logs,
    winner,
    isResolving: false,
  };
}

