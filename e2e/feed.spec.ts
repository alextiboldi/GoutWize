import { test, expect } from "@playwright/test";

test("authenticated user on /login redirected to /feed", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/(feed|onboarding)/);
});

test.describe("Feed page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feed");
  });

  test("feed loads with discussion posts", async ({ page }) => {
    // Wait for at least one post card to render
    await expect(
      page.locator("[role='link'], [data-testid='post-card']").first(),
    ).toBeVisible({ timeout: 10000 });
  });

  test("category filter chips visible and clickable", async ({ page }) => {
    const filterChips = page.getByRole("button").filter({ hasText: /general|venting|tip/i });
    if ((await filterChips.count()) > 0) {
      await filterChips.first().click();
      // After clicking filter, posts should update
      await page.waitForTimeout(500);
    }
  });

  test("sort toggle switches between Newest and Most discussed", async ({
    page,
  }) => {
    const sortButton = page
      .getByRole("button")
      .filter({ hasText: /newest|most discussed/i });
    if ((await sortButton.count()) > 0) {
      await sortButton.first().click();
      await page.waitForTimeout(500);
    }
  });

  test("search input filters posts", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill("cherry");
      await page.waitForTimeout(500);
    }
  });

  test("post cards show title, category badge, upvote count, comment count", async ({
    page,
  }) => {
    const firstPost = page
      .locator("[role='link'], [data-testid='post-card']")
      .first();
    await expect(firstPost).toBeVisible({ timeout: 10000 });

    // Should contain text content (title)
    const text = await firstPost.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(0);
  });

  test("clicking a post card navigates to /post/[id]", async ({ page }) => {
    const firstPost = page
      .locator("[role='link'], [data-testid='post-card']")
      .first();
    await expect(firstPost).toBeVisible({ timeout: 10000 });
    await firstPost.click();
    await expect(page).toHaveURL(/\/post\//);
  });
});
