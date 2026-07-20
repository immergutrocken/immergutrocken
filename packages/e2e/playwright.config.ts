import { defineConfig, devices } from "@playwright/test";

// Public read-only Sanity project/dataset for e2e fixtures — not a secret.
const SANITY_STUDIO_PROJECT_ID = "05hvmwlk";
const SANITY_STUDIO_DATASET = "e2e-test";

const baseURL = "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  // Uses `next dev` rather than `next build && next start`: a full production build
  // statically exports every page in the site, which would require the e2e-test
  // dataset to have fixture data for all of them. Dev mode only renders the page
  // actually requested, so it only needs data for what the test visits.
  webServer: {
    command: "pnpm --filter website run dev",
    cwd: "../../",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      SANITY_STUDIO_PROJECT_ID,
      SANITY_STUDIO_DATASET,
    },
  },
});
