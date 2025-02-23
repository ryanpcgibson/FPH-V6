import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Load env vars once in config
dotenv.config({ path: ".env.test" });
const baseURL: string = process.env.APP_URL || "";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // Disable parallel execution
  workers: 1, // Run one test at a time
  use: {
    baseURL: baseURL,
    headless: false,
    screenshot: "only-on-failure",
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: "**/auth.setup.ts",
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "./playwright/.auth/user.json",
        // Keep browser window open between tests
        launchOptions: {
          slowMo: 500,
        },
      },
      dependencies: ["setup"], // This makes chromium tests wait for auth
      testMatch: "**/*.spec.ts",
      testIgnore: "**/auth.setup.ts",
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
