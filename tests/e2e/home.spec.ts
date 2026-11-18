import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Patricio Betancourt/i);
  });

  test("shows navigation", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation");
    await expect(nav).toBeVisible();

    const links = await nav.getByRole("link").all();
    expect(links.length).toBeGreaterThan(0);
  });

  test("shows empty state when no media published", async ({ page }) => {
    await page.goto("/");
    const emptyState = page.getByRole("status", { name: /coming/i });
    await expect(emptyState).toBeVisible();
  });

  test("navigation is keyboard accessible", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus-visible");
    await expect(focused).toBeVisible();
  });

  test("footer is visible", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
  });
});
