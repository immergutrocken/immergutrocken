import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "cms-chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.CMS_BASE_URL ?? "http://localhost:3333",
      },
      testMatch: /.*\.cms\.spec\.ts/,
    },
    {
      name: "website-webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: process.env.WEBSITE_BASE_URL ?? "http://localhost:3000",
      },
      testMatch: /.*\.website\.spec\.ts/,
    },
    {
      name: "happy-path",
      use: {
        // Happy path tests manage their own browser contexts
        // and don't need a default baseURL
      },
      testMatch: /.*-lifecycle\.spec\.ts/,
    },
  ],
});
