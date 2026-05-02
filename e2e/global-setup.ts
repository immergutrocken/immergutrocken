import { mkdir } from "fs/promises";
import { dirname } from "path";

import { chromium } from "@playwright/test";

import { resetE2EDataset } from "./helpers/reset-dataset";

const CMS_DEV_URL = "http://localhost:3333/dev";
const AUTH_STATE_PATH = "e2e/.auth/storage-state.json";

const STUDIO_SELECTOR =
  '[data-testid="studio"], [data-ui="NavDrawer"], nav[aria-label]';
// "E-mail / password" button on the Sanity "Choose login provider" screen.
const EMAIL_BTN_SELECTOR = 'button:has-text("E-mail")';

export default async function globalSetup() {
  await resetE2EDataset();
  await saveCmsAuthState();
}

async function saveCmsAuthState() {
  const email = process.env.SANITY_USER_EMAIL;
  const password = process.env.SANITY_USER_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "SANITY_USER_EMAIL and SANITY_USER_PASSWORD are required for e2e tests",
    );
  }

  const browser = await chromium.launch();
  // ignoreHTTPSErrors is needed in environments that intercept TLS traffic
  // with a corporate CA not trusted by Chromium's bundled cert store.
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto(CMS_DEV_URL);

  // Wait for Studio (already authenticated) or the login provider chooser.
  try {
    await Promise.race([
      page.waitForSelector(STUDIO_SELECTOR, { timeout: 30_000 }),
      page.waitForSelector(EMAIL_BTN_SELECTOR, { timeout: 30_000 }),
    ]);
  } catch {
    await page.screenshot({ path: "e2e/.auth/global-setup-timeout.png" });
    console.warn(
      "globalSetup: neither Studio nor login screen appeared within 30s",
    );
  }

  // Already logged in — save state and exit.
  if (await page.locator(STUDIO_SELECTOR).first().isVisible()) {
    await mkdir(dirname(AUTH_STATE_PATH), { recursive: true });
    await context.storageState({ path: AUTH_STATE_PATH });
    await browser.close();
    return;
  }

  // --- Email / password login flow ---
  const emailButton = page.locator(EMAIL_BTN_SELECTOR).first();
  if (!(await emailButton.isVisible())) {
    await page.screenshot({ path: "e2e/.auth/global-setup-no-login-btn.png" });
    throw new Error(
      "globalSetup: 'E-mail / password' button not found on Studio login page",
    );
  }
  await emailButton.click();

  // Enter email and submit.
  await page.waitForSelector('input[type="email"]', { timeout: 10_000 });
  await page.fill('input[type="email"]', email);
  await page.locator('button[type="submit"]').first().click();

  // Sanity sometimes shows password on the same page after a short delay,
  // and sometimes navigates to a separate password page.
  await page
    .waitForLoadState("networkidle", { timeout: 15_000 })
    .catch(() => {});

  const passwordInput = page.locator('input[type="password"]');
  if (await passwordInput.isVisible({ timeout: 10_000 }).catch(() => false)) {
    await passwordInput.fill(password);
    await page.locator('button[type="submit"]').last().click();
    await page
      .waitForLoadState("networkidle", { timeout: 15_000 })
      .catch(() => {});
  }

  // Wait for the Studio to fully load after login.
  try {
    await page.waitForSelector(STUDIO_SELECTOR, { timeout: 60_000 });
  } catch {
    await page.screenshot({ path: "e2e/.auth/global-setup-login-failed.png" });
    throw new Error(
      "globalSetup: Studio did not load after login — verify SANITY_USER_EMAIL and SANITY_USER_PASSWORD are correct",
    );
  }

  await mkdir(dirname(AUTH_STATE_PATH), { recursive: true });
  await context.storageState({ path: AUTH_STATE_PATH });
  await browser.close();
}
