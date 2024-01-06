import { Locator, Page } from "@playwright/test";
import { Panel } from "./panel";

export class MediaPage {
    public static readonly URL = "dev/media";

    public assetDetailsModal: AssetDetailsModal = new AssetDetailsModal(this.root)

    constructor(private _page: Page) { }

    public get root(): Locator {
        return this._page.getByTestId('studio-layout');
    }

    public imgByName(name: string) {
        return this._page.locator('.virtuoso-grid-item').filter({ hasText: name }).locator('img');
    }

    public static async openIn(page: Page): Promise<MediaPage> {
        await page.goto(`${process.env.SANITY_BASE_URL}${MediaPage.URL}`);
        return new MediaPage(page);
    }
}

export class AssetDetailsModal extends Panel {
    public readonly deleteConfirmModal: DeleteConfirmModal = new DeleteConfirmModal(this.root);

    public get root(): Locator {
        return this._parentLocator.page().locator('[aria-modal="true"]', { hasText: 'Asset details' });
    }

    public get btnDelete(): Locator {
        return this.root.getByRole('button', { name: 'delete' });
    }

}

export class DeleteConfirmModal extends Panel {
    public get root(): Locator {
        return this._parentLocator.page().locator('[aria-modal="true"]', { hasText: 'Confirm deletion' });
    }

    public get btnConfirm(): Locator {
        return this.root.getByRole('button', { name: 'yes' });
    }
}