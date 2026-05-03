import { mkdir } from "fs/promises";
import { dirname } from "path";

import { chromium } from "@playwright/test";

import { resetE2EDataset } from "./helpers/reset-dataset";

const CMS_DEV_URL = "http://localhost:3333/dev";
const AUTH_STATE_PATH = "e2e/.auth/storage-state.json";

const STUDIO_SELECTOR =
  '[data-testid="studio"], [data-ui="NavDrawer"], nav[aria-label]';

// localStorage key used by sanity@4.x (getStorageKey in sanity/lib/index.js).
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID ?? "05hvmwlk";
const SANITY_AUTH_STORAGE_KEY = `__studio_auth_token_${PROJECT_ID}`;

export default async function globalSetup() {
  await resetE2EDataset();
  await saveCmsAuthState();
}

async function saveCmsAuthState() {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error("SANITY_API_TOKEN is required for e2e tests");
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({ ignoreHTTPSErrors: true });

  // Inject the API token into localStorage before the page loads so the Studio
  // skips the login screen entirely. Format matches @sanity/sdk's auth store.
  await context.addInitScript(
    ({ key, value }) => localStorage.setItem(key, value),
    {
      key: SANITY_AUTH_STORAGE_KEY,
      value: JSON.stringify({ token }),
    },
  );

  const page = await context.newPage();

  // Log browser console messages so CORS errors and JS errors appear in CI output.
  page.on("console", (msg) => {
    if (msg.type() === "error") console.error("[browser]", msg.text());
    else console.log("[browser]", msg.text());
  });
  page.on("pageerror", (err) => console.error("[browser error]", err.message));

  // Log failed network requests — CORS blocks show up as failed fetches here.
  page.on("requestfailed", (req) =>
    console.error(
      "[request failed]",
      req.method(),
      req.url(),
      req.failure()?.errorText,
    ),
  );

  console.log("[globalSetup] navigating to", CMS_DEV_URL);
  await page.goto(CMS_DEV_URL);
  console.log("[globalSetup] page URL after navigation:", page.url());

  try {
    // Allow up to 120s: Vite compiles the /dev bundle on first request in CI.
    await page.waitForSelector(STUDIO_SELECTOR, { timeout: 120_000 });
  } catch {
    await mkdir(dirname(AUTH_STATE_PATH), { recursive: true });
    await page.screenshot({ path: "e2e/.auth/global-setup-timeout.png" });
    await browser.close();
    throw new Error(
      "globalSetup: Studio did not load after token injection — verify SANITY_API_TOKEN is valid and has editor access to the e2e-test dataset",
    );
  }

  await mkdir(dirname(AUTH_STATE_PATH), { recursive: true });
  await context.storageState({ path: AUTH_STATE_PATH });
  await browser.close();
}
