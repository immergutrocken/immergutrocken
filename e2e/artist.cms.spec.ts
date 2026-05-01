import { test, expect } from "@playwright/test";
import { resetE2EDataset } from "./helpers/reset-dataset";

/**
 * CMS-specific tests using Chromium
 * These tests interact with Sanity Studio to create and manage content
 */

const ARTIST_NAME = "E2E Test Artist";
const ARTIST_NAME_UPDATED = "E2E Test Artist Updated";

// Global setup to reset dataset
test.beforeAll(async () => {
  await resetE2EDataset();
});

test.describe("Sanity Studio - Artist Management", () => {
  test("should create an artist in Sanity Studio", async ({ page }) => {
    // Navigate to Sanity Studio
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Navigate to artist creation
    // Try to find the create button or navigate directly
    const createButton = page.getByRole("button", { name: /create/i }).first();

    if (await createButton.isVisible().catch(() => false)) {
      await createButton.click();
      // Select "Künstler*in" (Artist) from the document types
      await page.getByText("Künstler*in").click();
    } else {
      // Alternative: Navigate directly to the artist section
      await page.goto("/desk/artist");
      await page.waitForLoadState("networkidle");

      const newButton = page.getByRole("button", { name: /new|erstellen/i });
      if (await newButton.isVisible().catch(() => false)) {
        await newButton.click();
      }
    }

    // Wait for the form to load
    await page.waitForTimeout(2000);

    // Fill in the German tab (default)
    // Title field - required
    const titleInput = page.getByLabel(/titel/i).first();
    await titleInput.fill(ARTIST_NAME);

    // Subtitle field
    const subtitleInput = page.getByLabel(/untertitel/i).first();
    if (await subtitleInput.isVisible().catch(() => false)) {
      await subtitleInput.fill("Test Subtitle for E2E");
    }

    // Slug field
    const slugInput = page.getByLabel(/slug/i).first();
    if (await slugInput.isVisible().catch(() => false)) {
      await slugInput.fill("e2e-test-artist");
    }

    // Category field - required
    const categorySelect = page.getByLabel(/kategorie/i);
    if (await categorySelect.isVisible().catch(() => false)) {
      await categorySelect.click();
      await page.waitForTimeout(500);
      // Select "Musik" (Music)
      await page.getByText("Musik", { exact: true }).first().click();
    }

    // Content field (block content) - required
    // Try to fill in portable text editor
    const contentEditor = page.locator('[data-testid="pt-editor"]').first();
    if (await contentEditor.isVisible().catch(() => false)) {
      await contentEditor.click();
      await page.keyboard.type(
        "This is an E2E test artist. This content validates the complete workflow.",
      );
    }

    // Save as draft first (if needed)
    await page.waitForTimeout(1000);

    // Publish the document
    const publishButton = page.getByRole("button", { name: /publish/i });
    if (await publishButton.isVisible().catch(() => false)) {
      await publishButton.click();

      // Wait for publish confirmation
      await page.waitForTimeout(3000);
    }

    // Verify the artist was created
    await page.goto("/desk/artist");
    await page.waitForLoadState("networkidle");

    const artistInList = page.getByText(ARTIST_NAME);
    await expect(artistInList).toBeVisible({ timeout: 10000 });
  });

  test("should edit an existing artist in Sanity Studio", async ({ page }) => {
    // Navigate to Sanity Studio
    await page.goto("/desk/artist");
    await page.waitForLoadState("networkidle");

    // Find and click on the test artist
    const artistLink = page.getByText(ARTIST_NAME);
    await expect(artistLink).toBeVisible({ timeout: 10000 });
    await artistLink.click();

    await page.waitForTimeout(2000);

    // Edit the title
    const titleInput = page.getByLabel(/titel/i).first();
    await titleInput.click();
    await titleInput.fill("");
    await titleInput.fill(ARTIST_NAME_UPDATED);

    // Wait for auto-save or manual save
    await page.waitForTimeout(2000);

    // Publish the changes
    const publishButton = page.getByRole("button", { name: /publish/i });
    if (await publishButton.isVisible().catch(() => false)) {
      await publishButton.click();
      await page.waitForTimeout(3000);
    }

    // Verify the change
    await page.goto("/desk/artist");
    await page.waitForLoadState("networkidle");

    const updatedArtist = page.getByText(ARTIST_NAME_UPDATED);
    await expect(updatedArtist).toBeVisible({ timeout: 10000 });
  });
});
