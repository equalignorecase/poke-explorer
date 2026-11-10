export type Language = "en" | "th";

export interface Translations {
  nav: {
    home: string;
    pokedex: string;
    compare: string;
    favorites: string;
    team: string;
    games: string;
    about: string;
    temporaryNotice: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    explorePokedex: string;
    playGames: string;
    featuredPokemon: string;
    exploreByType: string;
    gamesPreview: string;
    randomPokemon: string;
    randomCta: string;
    aboutSnippet: string;
  };
  common: {
    search: string;
    searchPlaceholder: string;
    filterByType: string;
    filterByGeneration: string;
    allTypes: string;
    allGenerations: string;
    noResults: string;
    loading: string;
    error: string;
    retry: string;
    back: string;
    next: string;
    reset: string;
    points: string;
    round: string;
    score: string;
    streak: string;
    playAgain: string;
    viewDetails: string;
    generation: string;
    hp: string;
    attack: string;
    defense: string;
    spAtk: string;
    spDef: string;
    speed: string;
    total: string;
    height: string;
    weight: string;
    abilities: string;
    cry: string;
    shiny: string;
    defaultSprite: string;
  };
  pokedex: {
    title: string;
    subtitle: string;
    showing: string;
    of: string;
    pokemon: string;
    loadMore: string;
    emptySearch: string;
  };
  pokemonDetail: {
    addToFavorites: string;
    removeFromFavorites: string;
    addToTeam: string;
    removeFromTeam: string;
    teamFull: string;
    compareWith: string;
    playCry: string;
    stopCry: string;
    flavorText: string;
    evolutionChain: string;
    baseStats: string;
    profile: string;
  };
  compare: {
    title: string;
    subtitle: string;
    selectFirst: string;
    selectSecond: string;
    searchFirst: string;
    searchSecond: string;
    higher: string;
    lower: string;
    equal: string;
    totalStats: string;
    statComparison: string;
    disclaimer: string;
  };
  favorites: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    browsePokedex: string;
    sessionNotice: string;
  };
  team: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    slotsUsed: string;
    teamFullNotice: string;
    clearTeam: string;
    typeCoverage: string;
    defensiveWeaknesses: string;
    weaknessNotice: string;
    sessionNotice: string;
    emptySlot: string;
  };
  games: {
    title: string;
    subtitle: string;
    difficulty: {
      label: string;
      easy: string;
      normal: string;
      hard: string;
    };
    gameOver: string;
    finalScore: string;
    accuracy: string;
    backToGames: string;
    guess: {
      title: string;
      desc: string;
      instruction: string;
      correct: string;
      wrong: string;
    };
    silhouette: {
      title: string;
      desc: string;
      instruction: string;
      revealText: string;
    };
    higherLower: {
      title: string;
      desc: string;
      instruction: string;
      isHigher: string;
      isLower: string;
      statLabel: string;
      correct: string;
      wrong: string;
    };
    cry: {
      title: string;
      desc: string;
      instruction: string;
      listenPrompt: string;
      playAudio: string;
      audioUnsupported: string;
    };
    typeMatch: {
      title: string;
      desc: string;
      instruction: string;
      questionPrompt: string;
      superEffective: string;
      normalDamage: string;
      notVeryEffective: string;
      noEffect: string;
      multiplier: string;
    };
    memory: {
      title: string;
      desc: string;
      instruction: string;
      moves: string;
      pairs: string;
      time: string;
      completed: string;
      pairsFound: string;
    };
    battle: {
      title: string;
      desc: string;
      instruction: string;
      choosePokemon: string;
      opponent: string;
      player: string;
      quickAttack: string;
      powerAttack: string;
      defend: string;
      turn: string;
      battleLog: string;
      victory: string;
      defeat: string;
      disclaimer: string;
    };
  };
  about: {
    title: string;
    description: string;
    features: string;
    techStack: string;
    apiCredit: string;
    disclaimerTitle: string;
    disclaimerText: string;
  };
}

