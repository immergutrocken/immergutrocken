import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env.e2e.local") });

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
  webServer:
    process.env.CI && process.env.E2E_BASE_URL
      ? undefined
      : {
          command: "pnpm --filter website run build && pnpm --filter website run start",
          cwd: "../../",
          url: process.env.E2E_BASE_URL ?? "http://localhost:3000",
          reuseExistingServer: !process.env.CI,
          timeout: 180_000,
        },
});
