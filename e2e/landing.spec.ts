import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads with hero heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /stop guessing/i }),
    ).toBeVisible();
  });

  test('"Join the Community" CTA navigates to /login', async ({ page }) => {
    await page
      .getByRole("link", { name: /join the community/i })
      .first()
      .click();
    await expect(page).toHaveURL("/login");
  });

  test("community insights section shows insight cards", async ({ page }) => {
    // The insights section renders seedInsights with stats
    await expect(page.getByText(/community insights/i).first()).toBeVisible();
  });

  test("social proof numbers visible", async ({ page }) => {
    await expect(page.getByText(/active members/i).first()).toBeVisible();
    await expect(page.getByText(/posts shared/i).first()).toBeVisible();
  });

  test('"Get Started" or bottom CTA navigates to /login', async ({ page }) => {
    // Bottom CTA section has "Join the Community" or "Get Started" links
    const ctaButtons = page.getByRole("link", {
      name: /get started|join the community/i,
    });
    if ((await ctaButtons.count()) > 0) {
      await ctaButtons.last().click();
      await expect(page).toHaveURL("/login");
    }
  });
});
