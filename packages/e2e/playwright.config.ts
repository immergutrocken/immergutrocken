import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";
import { defineConfig, devices, type ReporterDescription } from "@playwright/test";

// Public read-only Sanity project/dataset for e2e fixtures — not a secret.
const SANITY_STUDIO_PROJECT_ID = "05hvmwlk";
const SANITY_STUDIO_DATASET = "e2e-test";

const baseURL = "http://localhost:3000";

const reporters: ReporterDescription[] = [["list"]];
if (process.env.CI) {
  reporters.push(["html", { open: "never" }]);
}
reporters.push([
  "@argos-ci/playwright/reporter",
  createArgosReporterOptions({
    // Outside CI the reporter only writes screenshots to ./screenshots (gitignored);
    // uploads — and therefore the hosted baselines — only happen from CI.
    uploadToArgos: !!process.env.CI,
  }),
]);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: reporters,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "webkit",
      // `browserName` is set explicitly: the device descriptor only carries
      // `defaultBrowserType`, which Argos' reporter doesn't read — without this it
      // warns about missing Chromium-only font-rendering flags that don't apply here.
      use: { ...devices["Desktop Safari"], browserName: "webkit" },
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
