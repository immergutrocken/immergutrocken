import { test, expect } from "@playwright/test";

// Dataset reset and auth are handled by global-setup.ts.
// The cms-chromium project sets baseURL to http://localhost:3333/dev and
// applies storageState so all pages start authenticated.

const ARTIST_NAME = "E2E Test Artist";
const ARTIST_NAME_UPDATED = "E2E Test Artist Updated";

test.describe("Sanity Studio - Artist Management", () => {
  test("should create an artist in Sanity Studio", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const createButton = page.getByRole("button", { name: /create/i }).first();

    if (await createButton.isVisible()) {
      await createButton.click();
      await page.getByText("Künstler*in").click();
    } else {
      await page.goto("/desk/artist");
      await page.waitForLoadState("networkidle");

      const newButton = page.getByRole("button", { name: /new|erstellen/i });
      if (await newButton.isVisible()) {
        await newButton.click();
      }
    }

    await page.waitForTimeout(2000);

    const titleInput = page.getByLabel(/titel/i).first();
    await titleInput.fill(ARTIST_NAME);

    const subtitleInput = page.getByLabel(/untertitel/i).first();
    if (await subtitleInput.isVisible()) {
      await subtitleInput.fill("Test Subtitle for E2E");
    }

    const slugInput = page.getByLabel(/slug/i).first();
    if (await slugInput.isVisible()) {
      await slugInput.fill("e2e-test-artist");
    }

    const categorySelect = page.getByLabel(/kategorie/i);
    if (await categorySelect.isVisible()) {
      await categorySelect.click();
      await page.waitForTimeout(500);
      await page.getByText("Musik", { exact: true }).first().click();
    }

    const contentEditor = page.locator('[data-testid="pt-editor"]').first();
    if (await contentEditor.isVisible()) {
      await contentEditor.click();
      await page.keyboard.type(
        "This is an E2E test artist. This content validates the complete workflow.",
      );
    }

    await page.waitForTimeout(1000);

    const publishButton = page.getByRole("button", { name: /publish/i });
    if (await publishButton.isVisible()) {
      await publishButton.click();
      await page.waitForTimeout(3000);
    }

    await page.goto("/desk/artist");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(ARTIST_NAME)).toBeVisible({ timeout: 10000 });
  });

  test("should edit an existing artist in Sanity Studio", async ({ page }) => {
    await page.goto("/desk/artist");
    await page.waitForLoadState("networkidle");

    const artistLink = page.getByText(ARTIST_NAME);
    await expect(artistLink).toBeVisible({ timeout: 10000 });
    await artistLink.click();

    await page.waitForTimeout(2000);

    const titleInput = page.getByLabel(/titel/i).first();
    await titleInput.click();
    await titleInput.fill("");
    await titleInput.fill(ARTIST_NAME_UPDATED);

    await page.waitForTimeout(2000);

    const publishButton = page.getByRole("button", { name: /publish/i });
    if (await publishButton.isVisible()) {
      await publishButton.click();
      await page.waitForTimeout(3000);
    }

    await page.goto("/desk/artist");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(ARTIST_NAME_UPDATED)).toBeVisible({
      timeout: 10000,
    });
  });
});
