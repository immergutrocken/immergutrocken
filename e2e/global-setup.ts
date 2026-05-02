import { mkdir } from "fs/promises";
import { dirname } from "path";

import { chromium } from "@playwright/test";

import { resetE2EDataset } from "./helpers/reset-dataset";

const CMS_DEV_URL = "http://localhost:3333/dev";
const AUTH_STATE_PATH = "e2e/.auth/storage-state.json";

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
  // ignoreHTTPSErrors is required in environments that intercept TLS traffic
  // (e.g. sandboxed CI workers with a corporate CA not trusted by Chromium).
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto(CMS_DEV_URL);

  const studioSelector =
    '[data-testid="studio"], [data-ui="NavDrawer"], nav[aria-label]';
  const emailButtonSelector = 'button:has-text("E-mail")';

  // Wait for either the Studio (already logged in) or the login provider choice.
  try {
    await Promise.race([
      page.waitForSelector(studioSelector, { timeout: 30_000 }),
      page.waitForSelector(emailButtonSelector, { timeout: 30_000 }),
    ]);
  } catch {
    await page.screenshot({ path: "e2e/.auth/global-setup-timeout.png" });
    console.warn(
      "globalSetup: neither Studio nor login screen appeared within 30s",
    );
  }

  // If Studio is already authenticated (storage state reuse) we're done.
  if (await page.locator(studioSelector).first().isVisible()) {
    await mkdir(dirname(AUTH_STATE_PATH), { recursive: true });
    await context.storageState({ path: AUTH_STATE_PATH });
    await browser.close();
    return;
  }

  // Click "E-mail / password" to open the credentials form.
  const emailButton = page.locator(emailButtonSelector).first();
  if (!(await emailButton.isVisible())) {
    await page.screenshot({ path: "e2e/.auth/global-setup-no-login.png" });
    throw new Error(
      "globalSetup: could not find 'E-mail / password' login button on Studio login page",
    );
  }
  await emailButton.click();

  // Fill email.
  await page.waitForSelector('input[type="email"]', { timeout: 10_000 });
  await page.fill('input[type="email"]', email);
  await page.locator('button[type="submit"]').first().click();

  // Sanity may split email and password onto separate pages.
  const passwordInput = page.locator('input[type="password"]');
  if (await passwordInput.isVisible({ timeout: 8_000 }).catch(() => false)) {
    await passwordInput.fill(password);
    await page.locator('button[type="submit"]').last().click();
  }

  // Wait for Studio to load after successful login.
  try {
    await page.waitForSelector(studioSelector, { timeout: 60_000 });
  } catch {
    await page.screenshot({ path: "e2e/.auth/global-setup-login-failed.png" });
    throw new Error(
      "globalSetup: Studio did not load after login — check credentials",
    );
  }

  await mkdir(dirname(AUTH_STATE_PATH), { recursive: true });
  await context.storageState({ path: AUTH_STATE_PATH });
  await browser.close();
}
