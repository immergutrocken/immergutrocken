import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  webServer: [
    {
      command: "pnpm --filter cms dev",
      url: "http://localhost:3333",
      timeout: 300_000,
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        SANITY_STUDIO_DATASET_DEVELOPMENT: "e2e-test",
        SANITY_STUDIO_DATASET_PREVIEW: "e2e-test",
        SANITY_STUDIO_DATASET_PRODUCTION: "e2e-test",
        SANITY_STUDIO_PROJECT_ID: "05hvmwlk",
      },
    },
    {
      command: "pnpm --filter website dev",
      url: "http://localhost:3000",
      timeout: 300_000,
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe",
      env: {
        SANITY_STUDIO_DATASET: "e2e-test",
        SANITY_STUDIO_PROJECT_ID: "05hvmwlk",
      },
    },
  ],

  projects: [
    {
      name: "cms-chromium",
      use: {
        ...devices["Desktop Chrome"],
        // /dev = the dev workspace in sanity.config.ts (active when import.meta.env.DEV is true)
        baseURL: "http://localhost:3333/dev",
        storageState: "e2e/.auth/storage-state.json",
      },
      testMatch: /.*\.cms\.spec\.ts/,
    },
    {
      name: "website-webkit",
      use: {
        ...devices["Desktop Safari"],
        baseURL: "http://localhost:3000",
      },
      testMatch: /.*\.website\.spec\.ts/,
    },
    {
      name: "happy-path",
      use: {
        ...devices["Desktop Chrome"],
      },
      testMatch: /.*-lifecycle\.spec\.ts/,
    },
  ],
});
