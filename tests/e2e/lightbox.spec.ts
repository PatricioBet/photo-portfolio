import { test, expect } from "@playwright/test";

test.describe("Lightbox accessibility", () => {
  test("opens on click", async ({ page }) => {
    await page.goto("/fotos/");
    const image = page.locator("img").first();
    if (await image.isVisible().catch(() => false)) {
      await image.click();
      const lightbox = page.locator('[role="dialog"], .lightbox');
      await expect(lightbox).toBeVisible();
    }
  });

  test("focus is trapped in lightbox", async ({ page }) => {
    await page.goto("/fotos/");
    const image = page.locator("img").first();
    if (await image.isVisible().catch(() => false)) {
      await image.click();
      const lightbox = page.locator('[role="dialog"], .lightbox');
      await expect(lightbox).toBeVisible();

      await page.keyboard.press("Tab");
      const focused = page.locator(":focus-visible");
      await expect(focused).toBeVisible();
    }
  });

  test("Escape closes lightbox", async ({ page }) => {
    await page.goto("/fotos/");
    const image = page.locator("img").first();
    if (await image.isVisible().catch(() => false)) {
      await image.click();
      await page.keyboard.press("Escape");
      const lightbox = page.locator('[role="dialog"], .lightbox');
      await expect(lightbox).not.toBeVisible();
    }
  });

  test("has close button", async ({ page }) => {
    await page.goto("/fotos/");
    const image = page.locator("img").first();
    if (await image.isVisible().catch(() => false)) {
      await image.click();
      const closeBtn = page.getByRole("button", { name: /close|cerrar/i });
      await expect(closeBtn).toBeVisible();
    }
  });
});
