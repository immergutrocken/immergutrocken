import { Page, expect } from "@playwright/test";
import { DeskPage } from "../pages/sanity/desk.page";
import { MenuButtonPopover } from "../pages/sanity/menu-button.popover";
import { Toast } from "../pages/sanity/popover";

export class SortingScenario {
    public static async addArtist(page: Page, prefix: string): Promise<unknown> {
        const deskPage: DeskPage = await DeskPage.openIn(page);
        await deskPage.contentMenuPanel.btnSortierungen.hover({ force: true });
        await deskPage.contentMenuPanel.btnSortierungen.click();

        await deskPage.sortierungenPanel.artistSortierungen.btnAdd.click();
        await deskPage.sortierungenPanel.artistSortierungen.inptAddSearch.fill(prefix);
        await deskPage.sortierungenPanel.artistSortierungen.getSearchResultByText(prefix).click();

        await expect(deskPage.sortierungenPanel.btnReviewChanges).toHaveText('just now', { timeout: 10000 });
        await expect(deskPage.sortierungenPanel.btnPublish).toBeEnabled();
        await deskPage.sortierungenPanel.btnPublish.click();
        const successToast: Toast = Toast.fromText(page, 'The document was published');
        return await successToast.icnClose.click();
    }

    public static async removeArtist(page: Page, prefix: string): Promise<unknown> {
        const deskPage: DeskPage = await DeskPage.openIn(page);
        await deskPage.contentMenuPanel.btnSortierungen.hover({ force: true });
        await deskPage.contentMenuPanel.btnSortierungen.click();

        await deskPage.sortierungenPanel.artistSortierungen.btnAdd.scrollIntoViewIfNeeded();
        await deskPage.sortierungenPanel.artistSortierungen.getRowMenuButtonByText(prefix).click();
        await MenuButtonPopover.getItemByText(page, 'Remove').click();

        await expect(deskPage.sortierungenPanel.btnReviewChanges).toHaveText('just now', { timeout: 10000 });
        await expect(deskPage.sortierungenPanel.btnPublish).toBeEnabled();
        await deskPage.sortierungenPanel.btnPublish.click();
        const successToast: Toast = Toast.fromText(page, 'The document was published');
        return await successToast.icnClose.click();
    }
}