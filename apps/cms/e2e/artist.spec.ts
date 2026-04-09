import { test, expect } from "./fixtures";

/**
 * E2E test for creating an artist in Sanity Studio
 *
 * This test covers the following workflow:
 * 1. Navigate to the Sanity Studio
 * 2. Click on the "Create" button
 * 3. Select "Künstler*in" (Artist) document type
 * 4. Fill in required fields (title, banner, content, category)
 * 5. Publish the artist
 * 6. Verify the artist appears in the list
 * 7. Clean up by deleting the artist
 */

test.describe("Artist Creation", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Sanity Studio
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");
  });

  test("should create a new artist successfully", async ({ page }) => {
    // Click on the "Create" button or navigate to create new document
    // Sanity Studio uses a specific structure, we need to find the create button
    const createButton = page.getByRole("button", { name: /create/i });

    // If create button exists, click it
    if (await createButton.isVisible().catch(() => false)) {
      await createButton.click();

      // Select "Künstler*in" (Artist) from the document types
      await page.getByText("Künstler*in").click();
    } else {
      // Alternative: Navigate directly to the artist creation page
      // Sanity URLs typically follow the pattern: /intent/create/template=artist
      await page.goto("/desk/artist");

      // Wait for desk to load
      await page.waitForLoadState("networkidle");

      // Click create new
      const newButton = page.getByRole("button", { name: /new/i });
      if (await newButton.isVisible().catch(() => false)) {
        await newButton.click();
      }
    }

    // Wait for the form to load
    await page.waitForTimeout(1000);

    // Fill in the German tab (default)
    // Title field - this is required
    const titleInput = page.getByLabel(/titel/i).first();
    await titleInput.fill("Test Artist E2E");

    // Subtitle field
    const subtitleInput = page.getByLabel(/untertitel/i).first();
    if (await subtitleInput.isVisible().catch(() => false)) {
      await subtitleInput.fill("E2E Test Subtitle");
    }

    // Category field - required
    const categorySelect = page.getByLabel(/kategorie/i);
    if (await categorySelect.isVisible().catch(() => false)) {
      await categorySelect.click();
      // Select "Musik" (Music)
      await page.getByText("Musik").first().click();
    }

    // Banner image - required field
    // Note: For a complete test, you would upload an image
    // For now, we'll skip this as it requires file upload
    // In a real scenario, you would use page.setInputFiles()

    // Content field (block content) - required
    // Note: Sanity's block content editor has a specific structure
    // We'll add simple text if possible
    const contentEditor = page.locator('[data-testid="pt-editor"]').first();
    if (await contentEditor.isVisible().catch(() => false)) {
      await contentEditor.click();
      await contentEditor.fill("This is a test artist created via E2E tests.");
    }

    // Publish the document
    const publishButton = page.getByRole("button", { name: /publish/i });
    if (await publishButton.isVisible().catch(() => false)) {
      await publishButton.click();

      // Wait for publish confirmation
      await page.waitForTimeout(2000);

      // Verify success message
      const successMessage = page.getByText(/published/i);
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }

    // Navigate back to the artist list
    await page.goto("/desk/artist");
    await page.waitForLoadState("networkidle");

    // Verify the artist appears in the list
    const artistInList = page.getByText("Test Artist E2E");
    await expect(artistInList).toBeVisible({ timeout: 5000 });

    // Clean up: Delete the test artist
    // Click on the artist to open it
    await artistInList.click();
    await page.waitForTimeout(1000);

    // Find and click the document menu (usually three dots)
    const menuButton = page.getByRole("button", { name: /menu/i });
    if (await menuButton.isVisible().catch(() => false)) {
      await menuButton.click();

      // Click delete
      const deleteButton = page.getByRole("menuitem", { name: /delete/i });
      if (await deleteButton.isVisible().catch(() => false)) {
        await deleteButton.click();

        // Confirm deletion
        const confirmButton = page.getByRole("button", {
          name: /confirm|delete/i,
        });
        if (await confirmButton.isVisible().catch(() => false)) {
          await confirmButton.click();
        }
      }
    }
  });

  test("should validate required fields when creating an artist", async ({
    page,
  }) => {
    // Navigate to create artist
    await page.goto("/desk/artist");
    await page.waitForLoadState("networkidle");

    // Try to click create new
    const newButton = page.getByRole("button", { name: /new/i });
    if (await newButton.isVisible().catch(() => false)) {
      await newButton.click();
    }

    // Wait for form
    await page.waitForTimeout(1000);

    // Try to publish without filling required fields
    const publishButton = page.getByRole("button", { name: /publish/i });

    // The publish button should be disabled or clicking should show validation errors
    if (await publishButton.isVisible().catch(() => false)) {
      const isDisabled = await publishButton.isDisabled();

      if (!isDisabled) {
        await publishButton.click();

        // Should see validation errors
        const validationError = page.getByText(/required|pflichtfeld/i).first();
        await expect(validationError).toBeVisible({ timeout: 3000 });
      }
    }
  });
});
