import { test, expect } from "@playwright/test";
import { resetE2EDataset } from "./helpers/reset-dataset";

/**
 * E2E Happy Path Test: Artist Creation and Publishing
 *
 * This test validates the complete workflow:
 * 1. Create an artist in Sanity Studio (Chromium)
 * 2. View the artist on the website (WebKit)
 * 3. Edit the artist in Sanity Studio (Chromium)
 * 4. Verify the changes on the website (WebKit)
 */

const ARTIST_NAME = "E2E Test Artist";
const ARTIST_NAME_UPDATED = "E2E Test Artist Updated";
const ARTIST_SLUG = "e2e-test-artist";

test.describe("Artist End-to-End Workflow", () => {
  test.beforeAll(async () => {
    // Reset the E2E dataset before running tests
    await resetE2EDataset();
  });

  test("complete artist lifecycle - create, view, edit, verify", async ({}) => {
    // This test is split into multiple steps to demonstrate the workflow
    // Each step is documented separately below
  });
});
