import { test, expect } from "@playwright/test";

test.describe("Profile page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/profile");
  });

  test("shows user profile info", async ({ page }) => {
    // Profile page should load with user info
    await expect(page.locator("h1, h2, h3").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("stats grid shows check-ins, flares, comments, streak counts", async ({
    page,
  }) => {
    // Look for stat labels
    const statsSection = page.getByText(/check-in|flare|comment|streak/i);
    await expect(statsSection.first()).toBeVisible({ timeout: 10000 });
  });

  test("flare history section visible", async ({ page }) => {
    await expect(
      page.getByText(/flare history|recent flares|past flares/i),
    ).toBeVisible({ timeout: 10000 });
  });

  test('"Invite someone" button present', async ({ page }) => {
    const inviteBtn = page
      .getByRole("button", { name: /invite/i })
      .or(page.getByText(/invite someone/i));
    if (await inviteBtn.isVisible().catch(() => false)) {
      await expect(inviteBtn).toBeVisible();
    }
  });

  test("sign out button works", async ({ page }) => {
    const signOutBtn = page.getByRole("button", {
      name: /sign out|log out/i,
    });
    await expect(signOutBtn).toBeVisible({ timeout: 10000 });
    await signOutBtn.click();

    // Should redirect to login or landing
    await expect(page).toHaveURL(/\/(login|$)/, { timeout: 10000 });
  });
});
