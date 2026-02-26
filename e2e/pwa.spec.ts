import { test, expect } from "@playwright/test";

test.describe("PWA & meta tags", () => {
  test("/manifest.webmanifest returns valid JSON", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.ok()).toBeTruthy();

    const manifest = await response.json();
    expect(manifest).toHaveProperty("name");
    expect(manifest).toHaveProperty("short_name");
    expect(manifest).toHaveProperty("start_url");
    expect(manifest).toHaveProperty("display");
    expect(manifest).toHaveProperty("icons");
  });

  test("meta tags present: theme-color, viewport", async ({ page }) => {
    await page.goto("/");

    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveAttribute("content", /.+/);

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute("content", /width/);
  });

  test("apple-mobile-web-app-capable meta tag present", async ({ page }) => {
    await page.goto("/");

    const appleMeta = page.locator(
      'meta[name="apple-mobile-web-app-capable"]',
    );
    if ((await appleMeta.count()) > 0) {
      await expect(appleMeta).toHaveAttribute("content", "yes");
    }
  });

  test("OG tags present on landing page", async ({ page }) => {
    await page.goto("/");

    const ogTitle = page.locator('meta[property="og:title"]');
    if ((await ogTitle.count()) > 0) {
      await expect(ogTitle).toHaveAttribute("content", /.+/);
    }

    const ogDescription = page.locator('meta[property="og:description"]');
    if ((await ogDescription.count()) > 0) {
      await expect(ogDescription).toHaveAttribute("content", /.+/);
    }
  });
});
