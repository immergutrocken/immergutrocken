import { expect, test } from "@playwright/test";

import { ARTIST_BANNER_ALT, ARTIST_SLUG, ARTIST_TITLE } from "../seed/fixture-data";

test("artist page renders title and banner image", async ({ page }) => {
  // "de" is the defaultLocale (see apps/website/next.config.mjs), so it has no path prefix.
  await page.goto(`/artist/${ARTIST_SLUG}`);

  await expect(page.getByRole("heading", { level: 1, name: ARTIST_TITLE })).toBeVisible();
  await expect(page.getByRole("img", { name: ARTIST_BANNER_ALT })).toBeVisible();
  await expect(page).toHaveTitle(new RegExp(ARTIST_TITLE));
});
