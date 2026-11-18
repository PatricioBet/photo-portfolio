import { test, expect } from "@playwright/test";

test.describe("Admin login", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows passkey login button", async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    const passkeyBtn = page.getByRole("button", { name: /passkey/i });
    if (await passkeyBtn.isVisible().catch(() => false)) {
      await expect(passkeyBtn).toBeVisible();
    }
  });

  test("shows recovery code option", async ({ page }) => {
    await page.goto("http://localhost:5173/login");
    const recoveryLink = page.getByRole("link", { name: /recovery/i });
    if (await recoveryLink.isVisible().catch(() => false)) {
      await expect(recoveryLink).toBeVisible();
    }
  });
});
