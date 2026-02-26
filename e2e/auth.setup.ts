import { test as setup, expect } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

const INBUCKET_URL = process.env.INBUCKET_URL || "http://localhost:54324";
const TEST_EMAIL = "e2e-test@goutwize.local";

/**
 * Fetch the latest email for the given address from Inbucket.
 * Inbucket API: GET /api/v1/mailbox/{email} returns an array of message headers.
 */
async function getLatestEmail(email: string) {
  const mailbox = email.split("@")[0];

  // Poll for the email (may take a moment to arrive)
  for (let i = 0; i < 10; i++) {
    const res = await fetch(`${INBUCKET_URL}/api/v1/mailbox/${mailbox}`);
    const messages = await res.json();

    if (messages.length > 0) {
      // Get the most recent message
      const latest = messages[messages.length - 1];
      const msgRes = await fetch(
        `${INBUCKET_URL}/api/v1/mailbox/${mailbox}/${latest.id}`,
      );
      return msgRes.json();
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  throw new Error(`No email received for ${email} after 10s`);
}

/**
 * Extract the magic link URL from the email body.
 * Supabase magic link emails contain a confirmation URL.
 */
function extractMagicLink(emailBody: string): string {
  // Match the Supabase auth confirmation URL
  const match = emailBody.match(
    /https?:\/\/[^\s"<>]+\/auth\/v1\/verify[^\s"<>]*/,
  );
  if (!match) {
    // Fallback: look for any link with token/code params
    const fallback = emailBody.match(
      /https?:\/\/[^\s"<>]*(?:token|code|confirm)[^\s"<>]*/,
    );
    if (!fallback) {
      throw new Error(
        `Could not extract magic link from email body:\n${emailBody}`,
      );
    }
    return fallback[0];
  }
  return match[0];
}

/**
 * Clear the Inbucket mailbox before starting so we don't pick up stale emails.
 */
async function clearMailbox(email: string) {
  const mailbox = email.split("@")[0];
  try {
    await fetch(`${INBUCKET_URL}/api/v1/mailbox/${mailbox}`, {
      method: "DELETE",
    });
  } catch {
    // Ignore — mailbox may not exist yet
  }
}

setup("authenticate", async ({ page }) => {
  // Clear any previous emails
  await clearMailbox(TEST_EMAIL);

  // Navigate to login and request magic link
  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill(TEST_EMAIL);
  await page.getByRole("button", { name: /send magic link/i }).click();

  // Confirm the "check your email" screen appeared
  await expect(page.getByText(/check your email/i)).toBeVisible({
    timeout: 5000,
  });

  // Fetch the magic link from Inbucket
  const email = await getLatestEmail(TEST_EMAIL);
  const body = email.body?.text || email.body?.html || "";
  const magicLink = extractMagicLink(body);

  // Navigate to the magic link to complete auth
  await page.goto(magicLink);

  // Should redirect to /feed or /onboarding after auth
  await expect(page).toHaveURL(/\/(feed|onboarding)/, { timeout: 15000 });

  // Save authenticated state
  await page.context().storageState({ path: authFile });
});
