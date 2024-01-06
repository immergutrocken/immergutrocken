import { Locator, Page } from "@playwright/test";

export class MenuButtonPopover {
    public static getItemByText(page: Page, text: string): Locator {
        return page.locator('[data-ui="MenuButton__popover"]').locator('button', { hasText: text });
    }
}