import { chromium } from "@playwright/test";

import { resetE2EDataset } from "./helpers/reset-dataset";

const SANITY_PROJECT_ID = "05hvmwlk";
const CMS_DEV_URL = "http://localhost:3333/dev";
const AUTH_STATE_PATH = "e2e/.auth/storage-state.json";

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
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to Studio so its origin is established, then inject the token into
  // localStorage. Sanity Studio v4 reads __sanity_auth_token_<projectId> on load.
  await page.goto(CMS_DEV_URL);
  await page.evaluate(
    ({ projectId, authToken }) => {
      localStorage.setItem(`__sanity_auth_token_${projectId}`, authToken);
    },
    { projectId: SANITY_PROJECT_ID, authToken: token },
  );

  await context.storageState({ path: AUTH_STATE_PATH });
  await browser.close();
}
