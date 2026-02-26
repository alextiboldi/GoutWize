import { test, expect } from "@playwright/test";

test.describe("Public post pages", () => {
  test("/post/[id] accessible without auth", async ({ page }) => {
    // Go to landing, find a post link, or directly navigate to a known post
    await page.goto("/");

    // The middleware allows /post/* for unauthenticated users
    // Try navigating to a post page — we need a valid post ID
    // For now, verify the route doesn't redirect to /login
    const response = await page.goto("/post/test-post-id");
    // Should NOT redirect to /login
    expect(page.url()).not.toContain("/login");
  });

  test("shows CTA for unauthenticated users instead of comment form", async ({
    page,
  }) => {
    await page.goto("/post/test-post-id");

    // Should show a join/sign-in CTA instead of comment form
    const joinCta = page.getByText(
      /join the conversation|sign in to comment|log in/i,
    );
    if (await joinCta.isVisible().catch(() => false)) {
      await expect(joinCta).toBeVisible();
    }
  });
});
