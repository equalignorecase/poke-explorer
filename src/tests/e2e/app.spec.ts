import { test, expect } from "@playwright/test";

test.describe("Pokédex Explorer E2E User Journeys", () => {
  test("homepage loads and displays core elements", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Pokédex Explorer/i);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Discover the World of Pokémon/i);
    await expect(page.getByText(/Featured Pokémon/i)).toBeVisible();
  });

  test("language switching between English and Thai works immediately without reload", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Discover the World of Pokémon/i);

    // Click TH button in LanguageSwitcher
    await page.getByRole("button", { name: "Switch to Thai" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/สำรวจโลกแห่งโปเกมอน/i);

    // Switch back to EN
    await page.getByRole("button", { name: "Switch to English" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Discover the World of Pokémon/i);
  });

  test("pokedex explorer page loads and supports search", async ({ page }) => {
    await page.goto("/pokedex");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Pokédex Explorer/i);

    const searchInput = page.getByPlaceholder(/Search by Pokémon name/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill("pikachu");

    // Wait for card to appear
    await expect(page.getByText(/Pikachu/i).first()).toBeVisible();
  });

  test("pokemon details page displays stats and actions", async ({ page }) => {
    await page.goto("/pokemon/25");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Pikachu/i);
    await expect(page.getByText(/Base Stats/i)).toBeVisible();
    await expect(page.getByText(/HP/i).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Add to Favorites/i })).toBeVisible();
  });

  test("games hub lists all 7 interactive mini-games", async ({ page }) => {
    await page.goto("/games");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Pokémon Mini Games/i);
    await expect(page.getByText(/Who's That Pokémon\?/i)).toBeVisible();
    await expect(page.getByText(/Silhouette Challenge/i)).toBeVisible();
    await expect(page.getByText(/Higher or Lower/i)).toBeVisible();
    await expect(page.getByText(/Pokémon Cry Quiz/i)).toBeVisible();
    await expect(page.getByText(/Type Match/i)).toBeVisible();
    await expect(page.getByText(/Memory Card Game/i)).toBeVisible();
    await expect(page.getByText(/Battle Simulator/i)).toBeVisible();
  });

  test("battle simulator allows turn action resolution", async ({ page }) => {
    await page.goto("/games/battle");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Battle Simulator/i);

    // Click Quick Attack
    const quickAttackBtn = page.getByRole("button", { name: /Quick Attack/i });
    await expect(quickAttackBtn).toBeVisible();
    await quickAttackBtn.click();

    // Check log updated
    await expect(page.getByText(/used Quick Attack/i)).toBeVisible();
  });
});

