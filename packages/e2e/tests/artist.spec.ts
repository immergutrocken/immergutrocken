import { argosScreenshot } from "@argos-ci/playwright";
import { expect, test } from "@playwright/test";

import {
  ARTIST_BANNER_ALT,
  ARTIST_SLUG,
  ARTIST_SOCIAL_LINKS,
  ARTIST_TITLE,
} from "../fixture-data";

test("artist page renders title and banner image", async ({ page }) => {
  // "de" is the defaultLocale (see apps/website/next.config.mjs), so it has no path prefix.
  await page.goto(`/artist/${ARTIST_SLUG}`);

  await expect(page.getByRole("heading", { level: 1, name: ARTIST_TITLE })).toBeVisible();
  await expect(page.getByRole("img", { name: ARTIST_BANNER_ALT })).toBeVisible();
  await expect(page).toHaveTitle(new RegExp(ARTIST_TITLE));

  // Social media links render as icon-only <a> tags with no accessible name, so assert by href.
  for (const href of ARTIST_SOCIAL_LINKS) {
    await expect(page.locator(`a[href="${href}"]`)).toBeVisible();
  }
});

test("artist page matches visual baseline", async ({ page }) => {
  await page.goto(`/artist/${ARTIST_SLUG}`);

  // Wait for the slowest content, so the screenshot isn't taken mid-render.
  await expect(page.getByRole("heading", { level: 1, name: ARTIST_TITLE })).toBeVisible();
  await expect(page.getByRole("img", { name: ARTIST_BANNER_ALT })).toBeVisible();

  // argosScreenshot stabilizes the page for us: it disables animations/transitions,
  // hides text carets and waits for images and web fonts to finish loading.
  await argosScreenshot(page, "artist-page", {
    fullPage: true,
    // The footer countdown renders "<n> days left" relative to the current date, so its
    // pixels change every day. It's a class-only element with no role or stable text,
    // hence the CSS locator rather than the semantic ones preferred elsewhere.
    mask: [page.locator("footer div.fixed.bottom-0")],
  });
});
