import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    //
    // Public tests — no auth needed, run independently
    //
    {
      name: "public",
      use: {
        ...devices["Desktop Chrome"],
        storageState: { cookies: [], origins: [] },
      },
      testMatch: [
        "landing.spec.ts",
        "auth.spec.ts",
        "post-public.spec.ts",
        "pwa.spec.ts",
        "middleware.spec.ts",
      ],
    },

    //
    // Auth setup — logs in via Inbucket magic link, saves state
    //
    { name: "setup", testMatch: /auth\.setup\.ts/ },

    //
    // Authenticated tests — depend on auth setup
    //
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: [
        "feed.spec.ts",
        "post.spec.ts",
        "flare.spec.ts",
        "checkin.spec.ts",
        "profile.spec.ts",
      ],
    },
    {
      name: "mobile",
      use: {
        ...devices["iPhone 14"],
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
      testMatch: [
        "feed.spec.ts",
        "post.spec.ts",
        "flare.spec.ts",
        "checkin.spec.ts",
        "profile.spec.ts",
      ],
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
