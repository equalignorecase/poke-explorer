export type GameDifficulty = "easy" | "normal" | "hard";

export interface GameState<TQuestion> {
  status: "idle" | "loading" | "playing" | "feedback" | "completed";
  currentRound: number;
  totalRounds: number;
  score: number;
  streak: number;
  currentQuestion: TQuestion | null;
  userAnswer: any | null;
  isCorrect: boolean | null;
}

export function getDifficultyRange(difficulty: GameDifficulty): { start: number; end: number } {
  switch (difficulty) {
    case "easy":
      return { start: 1, end: 151 }; // Gen 1
    case "normal":
      return { start: 1, end: 386 }; // Gen 1 - 3
    case "hard":
    default:
      return { start: 1, end: 1025 }; // All generations
  }
}

/**
 * Returns a random integer in range [min, max]
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random Pokémon ID for the given difficulty
 */
export function getRandomPokemonId(difficulty: GameDifficulty = "normal", excludeIds: number[] = []): number {
  const { start, end } = getDifficultyRange(difficulty);
  const excludeSet = new Set(excludeIds);

  let id = getRandomInt(start, end);
  let attempts = 0;
  while (excludeSet.has(id) && attempts < 20) {
    id = getRandomInt(start, end);
    attempts++;
  }
  return id;
}

/**
 * Shuffles an array deterministically in place
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate N unique choices including the correct Pokémon
 */
export function generateQuizOptions<T extends { id: number; name: string }>(
  correct: T,
  candidates: T[],
  count = 4
): T[] {
  const others = candidates.filter((c) => c.id !== correct.id);
  const shuffledOthers = shuffleArray(others);
  const choices = [correct, ...shuffledOthers.slice(0, count - 1)];
  return shuffleArray(choices);
}

/**
 * Score calculation helper
 */
export function calculateAccuracy(score: number, maxScore: number): number {
  if (maxScore <= 0) return 0;
  return Math.round((score / maxScore) * 100);
}

