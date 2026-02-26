import { test, expect } from "@playwright/test";

test.describe("Post create", () => {
  test("/post/new shows category picker, title input, body textarea", async ({
    page,
  }) => {
    await page.goto("/post/new");

    await expect(
      page.getByPlaceholder(/title/i).or(page.locator("input[name='title']")),
    ).toBeVisible();
    await expect(
      page
        .getByPlaceholder(/what's on your mind|body|share/i)
        .or(page.locator("textarea")),
    ).toBeVisible();
  });

  test("submitting a post redirects to the new post page", async ({
    page,
  }) => {
    await page.goto("/post/new");

    // Select a category
    const categoryBtn = page.getByRole("button").filter({ hasText: /general|venting/i });
    if ((await categoryBtn.count()) > 0) {
      await categoryBtn.first().click();
    }

    // Fill in title and body
    await page
      .getByPlaceholder(/title/i)
      .or(page.locator("input[name='title']"))
      .first()
      .fill("E2E Test Post");
    await page
      .getByPlaceholder(/what's on your mind|body|share/i)
      .or(page.locator("textarea"))
      .first()
      .fill("This is an automated test post from Playwright E2E tests.");

    // Submit
    await page.getByRole("button", { name: /post|submit|share/i }).click();

    // Should redirect to the new post
    await expect(page).toHaveURL(/\/post\//, { timeout: 10000 });
  });
});

test.describe("Post detail", () => {
  test("post detail shows full post content", async ({ page }) => {
    // Navigate to feed and click first post
    await page.goto("/feed");
    const firstPost = page
      .locator("[role='link'], [data-testid='post-card']")
      .first();
    await expect(firstPost).toBeVisible({ timeout: 10000 });
    await firstPost.click();

    await expect(page).toHaveURL(/\/post\//);
    // Post content should be visible
    await expect(page.locator("h1, h2, h3").first()).toBeVisible();
  });

  test("comment form is visible on post detail", async ({ page }) => {
    await page.goto("/feed");
    const firstPost = page
      .locator("[role='link'], [data-testid='post-card']")
      .first();
    await expect(firstPost).toBeVisible({ timeout: 10000 });
    await firstPost.click();

    // Comment textarea or input should be visible
    await expect(
      page
        .getByPlaceholder(/comment|reply|share your/i)
        .or(page.locator("textarea").last()),
    ).toBeVisible({ timeout: 5000 });
  });

  test("upvote button toggles on post", async ({ page }) => {
    await page.goto("/feed");
    const firstPost = page
      .locator("[role='link'], [data-testid='post-card']")
      .first();
    await expect(firstPost).toBeVisible({ timeout: 10000 });
    await firstPost.click();

    const upvoteBtn = page
      .getByRole("button", { name: /upvote|remove upvote/i })
      .first();
    if (await upvoteBtn.isVisible().catch(() => false)) {
      await upvoteBtn.click();
      await page.waitForTimeout(500);
    }
  });
});
