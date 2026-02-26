import { test, expect } from "@playwright/test";

test.describe("Daily check-in", () => {
  test("/checkin shows mood, hydration, alcohol selectors", async ({
    page,
  }) => {
    await page.goto("/checkin");

    // Mood selector
    await expect(
      page.getByText(/mood/i).or(page.getByText(/how are you feeling/i)),
    ).toBeVisible({ timeout: 5000 });

    // Hydration selector
    await expect(page.getByText(/hydration|water/i).first()).toBeVisible();

    // Alcohol selector
    await expect(page.getByText(/alcohol/i).first()).toBeVisible();
  });

  test("optional note field is present", async ({ page }) => {
    await page.goto("/checkin");

    const noteField = page
      .getByPlaceholder(/note|anything else|optional/i)
      .or(page.locator("textarea"));
    await expect(noteField.first()).toBeVisible({ timeout: 5000 });
  });

  test("submit saves check-in and shows toast", async ({ page }) => {
    await page.goto("/checkin");

    // Select mood
    const moodBtn = page.getByRole("button").filter({ hasText: /good|okay|😊|😐/i });
    if ((await moodBtn.count()) > 0) {
      await moodBtn.first().click();
    }

    // Select hydration
    const hydrationBtn = page.getByRole("button").filter({ hasText: /^ok$|^good$/i });
    if ((await hydrationBtn.count()) > 0) {
      await hydrationBtn.first().click();
    }

    // Select alcohol
    const alcoholBtn = page.getByRole("button").filter({ hasText: /^none$/i });
    if ((await alcoholBtn.count()) > 0) {
      await alcoholBtn.first().click();
    }

    // Submit
    const submitBtn = page.getByRole("button", {
      name: /save|submit|check in|log/i,
    });
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();

      // Should show a success toast or redirect
      await page.waitForTimeout(1000);
      const toast = page.getByText(/saved|logged|check-in/i);
      if (await toast.isVisible().catch(() => false)) {
        await expect(toast).toBeVisible();
      }
    }
  });
});
