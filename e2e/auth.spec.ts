import { test, expect } from "@playwright/test";

test.describe("Auth flow", () => {
  test("/login page shows Magic Link form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByRole("button", { name: /send magic link/i }),
    ).toBeVisible();
  });

  test("submitting email triggers form submission", async ({ page }) => {
    await page.goto("/login");
    await page
      .getByPlaceholder("you@example.com")
      .fill("test@example.com", { timeout: 10000 });
    await page.getByRole("button", { name: /send magic link/i }).click();

    // After submission, expect either:
    // - "Check your email" confirmation (success)
    // - An error message from Supabase (email validation, rate limit, etc.)
    // Both confirm the form submitted and Supabase responded.
    const confirmation = page.getByText(/check your email/i);
    const error = page.getByText(/invalid|error|failed|try again/i);
    await expect(confirmation.or(error)).toBeVisible({ timeout: 10000 });
  });

  test("unauthenticated user on /feed redirected to /login", async ({
    page,
  }) => {
    await page.goto("/feed");
    await expect(page).toHaveURL(/\/login/);
  });
});
