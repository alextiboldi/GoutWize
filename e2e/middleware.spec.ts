import { test, expect } from "@playwright/test";

test.describe("Route protection (unauthenticated)", () => {
  test("public routes accessible: /", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });

  test("public routes accessible: /login", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL("/login");
  });

  test("public routes accessible: /post/[id]", async ({ page }) => {
    await page.goto("/post/some-post-id");
    // Should NOT redirect to /login
    expect(page.url()).toContain("/post/");
  });

  test("protected /feed redirects to /login", async ({ page }) => {
    await page.goto("/feed");
    await expect(page).toHaveURL(/\/login/);
  });

  test("protected /checkin redirects to /login", async ({ page }) => {
    await page.goto("/checkin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("protected /flare redirects to /login", async ({ page }) => {
    await page.goto("/flare");
    await expect(page).toHaveURL(/\/login/);
  });

  test("protected /profile redirects to /login", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/);
  });

  test("static assets not intercepted", async ({ request }) => {
    // .webmanifest should serve directly, not redirect
    const response = await request.get("/manifest.webmanifest");
    expect(response.ok()).toBeTruthy();
  });
});
