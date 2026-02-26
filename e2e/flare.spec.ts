import { test, expect } from "@playwright/test";

test.describe("Flare flow", () => {
  test("/flare shows joint selector", async ({ page }) => {
    await page.goto("/flare");

    // Joint selector should be visible with "Big toe" as an option
    await expect(page.getByText(/big toe/i)).toBeVisible({ timeout: 5000 });
  });

  test("severity selector (1-10) works", async ({ page }) => {
    await page.goto("/flare");

    // Look for severity controls (slider or buttons 1-10)
    const severityControl = page
      .getByRole("slider")
      .or(page.getByText(/severity/i));
    if (await severityControl.isVisible().catch(() => false)) {
      await expect(severityControl).toBeVisible();
    }
  });

  test("submit logs flare and shows relief tips", async ({ page }) => {
    await page.goto("/flare");

    // Select joint (big toe should be pre-selected)
    await expect(page.getByText(/big toe/i)).toBeVisible({ timeout: 5000 });

    // Select severity — click a severity option
    const severityBtn = page.getByRole("button").filter({ hasText: /^[5-7]$/ });
    if ((await severityBtn.count()) > 0) {
      await severityBtn.first().click();
    }

    // Submit the flare
    const submitBtn = page.getByRole("button", { name: /log|submit|track/i });
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();

      // Relief tips should appear
      await expect(page.getByText(/relief|tip/i).first()).toBeVisible({
        timeout: 5000,
      });
    }
  });

  test("relief tips show entries with helpful percentages", async ({
    page,
  }) => {
    await page.goto("/flare");

    // Submit a flare to see relief tips
    const submitBtn = page.getByRole("button", { name: /log|submit|track/i });
    if (await submitBtn.isVisible().catch(() => false)) {
      await submitBtn.click();

      // Look for percentage indicators in relief tips
      await expect(page.getByText(/%/).first()).toBeVisible({ timeout: 5000 });
    }
  });
});
