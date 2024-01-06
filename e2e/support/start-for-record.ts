import { chromium } from "@playwright/test";
import * as fs from 'node:fs';
import { AUTH_FILE_PATH } from "./constants";

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage({ storageState: getStorageState() as any });
    await page.goto('http://localhost:3333/dev/desk');

    await page.pause();

    browser.close();
})();

function getStorageState(): object {
    let storageState = { cookies: [], origins: [] };
    if (fs.existsSync(AUTH_FILE_PATH)) {
        storageState = JSON.parse(fs.readFileSync(AUTH_FILE_PATH).toString());
    };
    return storageState;
}