import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoritesProvider, useFavorites } from "@/context/FavoritesContext";
import { TeamProvider, useTeam } from "@/context/TeamContext";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { PokemonListItem } from "@/lib/pokeapi/types";

function FavoritesTestConsumer() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const testPoke: PokemonListItem = {
    id: 25,
    name: "pikachu",
    types: ["electric"],
    generation: 1,
    sprite: "",
    artwork: "",
  };

  return (
    <div>
      <span data-testid="count">{favorites.length}</span>
      <span data-testid="is-fav">{isFavorite(25) ? "yes" : "no"}</span>
      <button onClick={() => toggleFavorite(testPoke)}>Toggle Fav</button>
    </div>
  );
}

function TeamTestConsumer() {
  const { team, addToTeam, isFull } = useTeam();

  const handleAddBatch = () => {
    for (let i = 1; i <= 7; i++) {
      addToTeam({
        id: i,
        name: `poke-${i}`,
        types: ["normal"],
        generation: 1,
        sprite: "",
        artwork: "",
      });
    }
  };

  return (
    <div>
      <span data-testid="team-size">{team.length}</span>
      <span data-testid="is-full">{isFull ? "full" : "not-full"}</span>
      <button onClick={handleAddBatch}>Fill Team</button>
    </div>
  );
}

function LanguageTestConsumer() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <span data-testid="nav-home">{t.nav.home}</span>
      <button onClick={() => setLanguage("th")}>Set Thai</button>
      <button onClick={() => setLanguage("en")}>Set English</button>
    </div>
  );
}

describe("Integration Tests: Contexts & State Management", () => {
  it("toggles favorites in session state", async () => {
    const user = userEvent.setup();
    render(
      <FavoritesProvider>
        <FavoritesTestConsumer />
      </FavoritesProvider>
    );

    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("is-fav").textContent).toBe("no");

    await user.click(screen.getByText("Toggle Fav"));
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("is-fav").textContent).toBe("yes");

    await user.click(screen.getByText("Toggle Fav"));
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("is-fav").textContent).toBe("no");
  });

  it("enforces team maximum of 6 Pokémon and rejects duplicates", async () => {
    const user = userEvent.setup();
    render(
      <TeamProvider>
        <TeamTestConsumer />
      </TeamProvider>
    );

    expect(screen.getByTestId("team-size").textContent).toBe("0");

    await user.click(screen.getByText("Fill Team"));
    // Attempted to add 7, should cap at 6
    expect(screen.getByTestId("team-size").textContent).toBe("6");
    expect(screen.getByTestId("is-full").textContent).toBe("full");
  });

  it("switches language dynamically between English and Thai", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <LanguageTestConsumer />
      </LanguageProvider>
    );

    expect(screen.getByTestId("current-lang").textContent).toBe("en");
    expect(screen.getByTestId("nav-home").textContent).toBe("Home");

    await user.click(screen.getByText("Set Thai"));
    expect(screen.getByTestId("current-lang").textContent).toBe("th");
    expect(screen.getByTestId("nav-home").textContent).toBe("หน้าแรก");

    await user.click(screen.getByText("Set English"));
    expect(screen.getByTestId("current-lang").textContent).toBe("en");
    expect(screen.getByTestId("nav-home").textContent).toBe("Home");
  });
});
