import { Locator, Page } from "@playwright/test";

export class Toast {
    private constructor(private _root: Locator) { }

    public get root(): Locator {
        return this._root
    }

    public get icnClose(): Locator {
        return this.root.locator('svg[data-sanity-icon="close"]');
    }

    public static fromText(page: Page, text: string) {
        return new Toast(page.locator('[role="alert"]', { hasText: text }));

    }
}

export class PopupMenu {
    public static entryByName(page: Page, name: string): Locator {
        return page.locator('[data-ui="MenuButton__popover"]').g
    }
}