import { test, expect } from "@playwright/test";

/**
 * Website-specific tests using WebKit
 * These tests verify that content created in Sanity Studio appears correctly on the website
 */

const ARTIST_NAME = "E2E Test Artist";
const ARTIST_NAME_UPDATED = "E2E Test Artist Updated";
const ARTIST_SLUG = "e2e-test-artist";

test.describe("Website - Artist Display", () => {
  test("should display the newly created artist on the website", async ({
    page,
  }) => {
    // Navigate to the artists page or the specific artist page
    // The exact URL structure depends on your Next.js routing
    await page.goto(`/artist/${ARTIST_SLUG}`);

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Verify the artist name is displayed
    const artistHeading = page.getByRole("heading", { name: ARTIST_NAME });
    await expect(artistHeading).toBeVisible({ timeout: 10000 });

    // Verify the content is displayed
    const content = page.getByText(/This is an E2E test artist/i);
    await expect(content).toBeVisible({ timeout: 5000 });
  });

  test("should display the updated artist information on the website", async ({
    page,
  }) => {
    // Navigate to the artist page
    await page.goto(`/artist/${ARTIST_SLUG}`);
    await page.waitForLoadState("networkidle");

    // Verify the updated artist name is displayed
    const updatedHeading = page.getByRole("heading", {
      name: ARTIST_NAME_UPDATED,
    });
    await expect(updatedHeading).toBeVisible({ timeout: 10000 });
  });
});
