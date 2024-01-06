import { chromium } from "@playwright/test";
import { AUTH_FILE_PATH } from "./constants";

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://localhost:3333/dev');
    await page.pause();
    await page.context().storageState({ path: AUTH_FILE_PATH });
    browser.close();
})();