import { defineConfig, devices } from "@playwright/test";

import "./load-env";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  // Skipped in CI when E2E_BASE_URL points at an already-running/deployed site.
  //
  // Uses `next dev` rather than `next build && next start`: a full production build
  // statically exports every page in the site, which would require the e2e-test
  // dataset to have fixture data for all of them. Dev mode only renders the page
  // actually requested, so it only needs data for what the test visits.
  webServer:
    process.env.CI && process.env.E2E_BASE_URL
      ? undefined
      : {
          command: "pnpm --filter website run dev",
          cwd: "../../",
          url: process.env.E2E_BASE_URL ?? "http://localhost:3000",
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
});
