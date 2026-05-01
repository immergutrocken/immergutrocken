import { test, expect, chromium, webkit } from "@playwright/test";
import { resetE2EDataset } from "./helpers/reset-dataset";

/**
 * E2E Happy Path Test: Artist Creation and Publishing
 *
 * This test validates the complete workflow:
 * 1. Create an artist in Sanity Studio (Chromium)
 * 2. View the artist on the website (WebKit)
 * 3. Edit the artist in Sanity Studio (Chromium)
 * 4. Verify the changes on the website (WebKit)
 *
 * This test uses both Chromium (for CMS) and WebKit (for website) browsers
 * to simulate real-world cross-browser compatibility.
 */

const ARTIST_NAME = "E2E Test Artist";
const ARTIST_NAME_UPDATED = "E2E Test Artist Updated";
const ARTIST_SLUG = "e2e-test-artist";

test.describe("Artist End-to-End Workflow", () => {
  test.beforeAll(async () => {
    // Reset the E2E dataset before running tests
    await resetE2EDataset();
  });

  test("should complete full artist lifecycle: create in CMS, view on website, edit in CMS, verify on website", async () => {
    const cmsBaseURL = process.env.CMS_BASE_URL ?? "http://localhost:3333";
    const websiteBaseURL =
      process.env.WEBSITE_BASE_URL ?? "http://localhost:3000";

    // Step 1: Create artist in Sanity Studio (Chromium)
    const chromiumBrowser = await chromium.launch();
    const chromiumContext = await chromiumBrowser.newContext();
    const cmsPage = await chromiumContext.newPage();

    // Navigate to Sanity Studio
    await cmsPage.goto(cmsBaseURL);
    await cmsPage.waitForLoadState("networkidle");

    // Navigate to artist creation
    const createButton = cmsPage.getByRole("button", { name: /create/i }).first();

    if (await createButton.isVisible().catch(() => false)) {
      await createButton.click();
      await cmsPage.getByText("Künstler*in").click();
    } else {
      await cmsPage.goto(`${cmsBaseURL}/desk/artist`);
      await cmsPage.waitForLoadState("networkidle");

      const newButton = cmsPage.getByRole("button", { name: /new|erstellen/i });
      if (await newButton.isVisible().catch(() => false)) {
        await newButton.click();
      }
    }

    await cmsPage.waitForTimeout(2000);

    // Fill in the artist form
    const titleInput = cmsPage.getByLabel(/titel/i).first();
    await titleInput.fill(ARTIST_NAME);

    const subtitleInput = cmsPage.getByLabel(/untertitel/i).first();
    if (await subtitleInput.isVisible().catch(() => false)) {
      await subtitleInput.fill("Test Subtitle for E2E");
    }

    const slugInput = cmsPage.getByLabel(/slug/i).first();
    if (await slugInput.isVisible().catch(() => false)) {
      await slugInput.fill(ARTIST_SLUG);
    }

    const categorySelect = cmsPage.getByLabel(/kategorie/i);
    if (await categorySelect.isVisible().catch(() => false)) {
      await categorySelect.click();
      await cmsPage.waitForTimeout(500);
      await cmsPage.getByText("Musik", { exact: true }).first().click();
    }

    const contentEditor = cmsPage.locator('[data-testid="pt-editor"]').first();
    if (await contentEditor.isVisible().catch(() => false)) {
      await contentEditor.click();
      await cmsPage.keyboard.type(
        "This is an E2E test artist. This content validates the complete workflow.",
      );
    }

    await cmsPage.waitForTimeout(1000);

    // Publish the document
    const publishButton = cmsPage.getByRole("button", { name: /publish/i });
    if (await publishButton.isVisible().catch(() => false)) {
      await publishButton.click();
      await cmsPage.waitForTimeout(3000);
    }

    // Verify the artist was created
    await cmsPage.goto(`${cmsBaseURL}/desk/artist`);
    await cmsPage.waitForLoadState("networkidle");

    const artistInList = cmsPage.getByText(ARTIST_NAME);
    await expect(artistInList).toBeVisible({ timeout: 10000 });

    await chromiumContext.close();
    await chromiumBrowser.close();

    // Step 2: View the artist on the website (WebKit)
    const webkitBrowser = await webkit.launch();
    const webkitContext = await webkitBrowser.newContext();
    const websitePage = await webkitContext.newPage();

    await websitePage.goto(`${websiteBaseURL}/artist/${ARTIST_SLUG}`);
    await websitePage.waitForLoadState("networkidle");

    const artistHeading = websitePage.getByRole("heading", {
      name: ARTIST_NAME,
    });
    await expect(artistHeading).toBeVisible({ timeout: 10000 });

    const content = websitePage.getByText(/This is an E2E test artist/i);
    await expect(content).toBeVisible({ timeout: 5000 });

    await webkitContext.close();
    await webkitBrowser.close();

    // Step 3: Edit the artist in Sanity Studio (Chromium)
    const chromiumBrowser2 = await chromium.launch();
    const chromiumContext2 = await chromiumBrowser2.newContext();
    const cmsPage2 = await chromiumContext2.newPage();

    await cmsPage2.goto(`${cmsBaseURL}/desk/artist`);
    await cmsPage2.waitForLoadState("networkidle");

    const artistLink = cmsPage2.getByText(ARTIST_NAME);
    await expect(artistLink).toBeVisible({ timeout: 10000 });
    await artistLink.click();

    await cmsPage2.waitForTimeout(2000);

    const titleInput2 = cmsPage2.getByLabel(/titel/i).first();
    await titleInput2.click();
    await titleInput2.fill("");
    await titleInput2.fill(ARTIST_NAME_UPDATED);

    await cmsPage2.waitForTimeout(2000);

    const publishButton2 = cmsPage2.getByRole("button", { name: /publish/i });
    if (await publishButton2.isVisible().catch(() => false)) {
      await publishButton2.click();
      await cmsPage2.waitForTimeout(3000);
    }

    // Verify the change in CMS
    await cmsPage2.goto(`${cmsBaseURL}/desk/artist`);
    await cmsPage2.waitForLoadState("networkidle");

    const updatedArtistInList = cmsPage2.getByText(ARTIST_NAME_UPDATED);
    await expect(updatedArtistInList).toBeVisible({ timeout: 10000 });

    await chromiumContext2.close();
    await chromiumBrowser2.close();

    // Step 4: Verify the changes on the website (WebKit)
    const webkitBrowser2 = await webkit.launch();
    const webkitContext2 = await webkitBrowser2.newContext();
    const websitePage2 = await webkitContext2.newPage();

    await websitePage2.goto(`${websiteBaseURL}/artist/${ARTIST_SLUG}`);
    await websitePage2.waitForLoadState("networkidle");

    const updatedHeading = websitePage2.getByRole("heading", {
      name: ARTIST_NAME_UPDATED,
    });
    await expect(updatedHeading).toBeVisible({ timeout: 10000 });

    await webkitContext2.close();
    await webkitBrowser2.close();
  });
});
