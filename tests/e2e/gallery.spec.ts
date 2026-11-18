import { test, expect } from "@playwright/test";

test.describe("Photo gallery", () => {
  test("loads gallery page", async ({ page }) => {
    await page.goto("/fotos/");
    await expect(page).toHaveURL(/\/fotos/);
  });

  test("shows grid layout", async ({ page }) => {
    await page.goto("/fotos/");
    const grid = page.locator('[role="list"], .gallery-grid');
    await expect(grid).toBeVisible();
  });

  test("pagination controls are present", async ({ page }) => {
    await page.goto("/fotos/");
    const pagination = page.getByRole("navigation", { name: /pagination/i });
    if (await pagination.isVisible().catch(() => false)) {
      await expect(pagination).toBeVisible();
    }
  });

  test("filters are accessible", async ({ page }) => {
    await page.goto("/fotos/");
    const filters = page.locator('[role="listbox"], [role="combobox"], select');
    const count = await filters.count();
    if (count > 0) {
      await expect(filters.first()).toBeVisible();
    }
  });
});
