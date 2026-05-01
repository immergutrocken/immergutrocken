import { test, expect, chromium, webkit } from "@playwright/test";

const ARTIST_NAME = "E2E Test Artist";
const ARTIST_NAME_UPDATED = "E2E Test Artist Updated";
const ARTIST_SLUG = "e2e-test-artist";

// Dataset reset is handled by global-setup.ts before all tests run.

const CMS_BASE_URL = "http://localhost:3333/dev";
const WEBSITE_BASE_URL = "http://localhost:3000";
const AUTH_STATE_PATH = "e2e/.auth/storage-state.json";

test.describe("Artist End-to-End Workflow", () => {
  test("should complete full artist lifecycle: create in CMS, view on website, edit in CMS, verify on website", async () => {
    // Step 1: Create artist in Sanity Studio (Chromium)
    const chromiumBrowser = await chromium.launch();
    const chromiumContext = await chromiumBrowser.newContext({
      storageState: AUTH_STATE_PATH,
    });
    const cmsPage = await chromiumContext.newPage();

    await cmsPage.goto(CMS_BASE_URL);
    await cmsPage.waitForLoadState("networkidle");

    const createButton = cmsPage
      .getByRole("button", { name: /create/i })
      .first();

    if (await createButton.isVisible().catch(() => false)) {
      await createButton.click();
      await cmsPage.getByText("Künstler*in").click();
    } else {
      await cmsPage.goto(`${CMS_BASE_URL}/desk/artist`);
      await cmsPage.waitForLoadState("networkidle");

      const newButton = cmsPage.getByRole("button", {
        name: /new|erstellen/i,
      });
      if (await newButton.isVisible().catch(() => false)) {
        await newButton.click();
      }
    }

    await cmsPage.waitForTimeout(2000);

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

    const contentEditor = cmsPage
      .locator('[data-testid="pt-editor"]')
      .first();
    if (await contentEditor.isVisible().catch(() => false)) {
      await contentEditor.click();
      await cmsPage.keyboard.type(
        "This is an E2E test artist. This content validates the complete workflow.",
      );
    }

    await cmsPage.waitForTimeout(1000);

    const publishButton = cmsPage.getByRole("button", { name: /publish/i });
    if (await publishButton.isVisible().catch(() => false)) {
      await publishButton.click();
      await cmsPage.waitForTimeout(3000);
    }

    await cmsPage.goto(`${CMS_BASE_URL}/desk/artist`);
    await cmsPage.waitForLoadState("networkidle");

    await expect(cmsPage.getByText(ARTIST_NAME)).toBeVisible({
      timeout: 10000,
    });

    await chromiumContext.close();
    await chromiumBrowser.close();

    // Step 2: View the artist on the website (WebKit)
    const webkitBrowser = await webkit.launch();
    const webkitContext = await webkitBrowser.newContext();
    const websitePage = await webkitContext.newPage();

    await websitePage.goto(`${WEBSITE_BASE_URL}/artist/${ARTIST_SLUG}`);
    await websitePage.waitForLoadState("networkidle");

    await expect(
      websitePage.getByRole("heading", { name: ARTIST_NAME }),
    ).toBeVisible({ timeout: 10000 });

    await expect(
      websitePage.getByText(/This is an E2E test artist/i),
    ).toBeVisible({ timeout: 5000 });

    await webkitContext.close();
    await webkitBrowser.close();

    // Step 3: Edit the artist in Sanity Studio (Chromium)
    const chromiumBrowser2 = await chromium.launch();
    const chromiumContext2 = await chromiumBrowser2.newContext({
      storageState: AUTH_STATE_PATH,
    });
    const cmsPage2 = await chromiumContext2.newPage();

    await cmsPage2.goto(`${CMS_BASE_URL}/desk/artist`);
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

    await cmsPage2.goto(`${CMS_BASE_URL}/desk/artist`);
    await cmsPage2.waitForLoadState("networkidle");

    await expect(cmsPage2.getByText(ARTIST_NAME_UPDATED)).toBeVisible({
      timeout: 10000,
    });

    await chromiumContext2.close();
    await chromiumBrowser2.close();

    // Step 4: Verify the changes on the website (WebKit)
    const webkitBrowser2 = await webkit.launch();
    const webkitContext2 = await webkitBrowser2.newContext();
    const websitePage2 = await webkitContext2.newPage();

    await websitePage2.goto(`${WEBSITE_BASE_URL}/artist/${ARTIST_SLUG}`);
    await websitePage2.waitForLoadState("networkidle");

    await expect(
      websitePage2.getByRole("heading", { name: ARTIST_NAME_UPDATED }),
    ).toBeVisible({ timeout: 10000 });

    await webkitContext2.close();
    await webkitBrowser2.close();
  });
});
