import { test, expect, Page } from '@playwright/test';
import { DeskPage } from "../pages/sanity/desk.page";
import { MediaPage } from "../pages/sanity/media.page";
import { Toast } from "../pages/sanity/popover";
import { MenuButtonPopover } from '../pages/sanity/menu-button.popover';

export class ArtistScenario {
    public static async createArtist(page: Page, prefix: string): Promise<unknown> {
        const white1pxPngB64: string = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII="
        const white1pxPngBuffer: Buffer = Buffer.from(Uint8Array.from(atob(white1pxPngB64), c => c.charCodeAt(0)).buffer);

        const deskPage: DeskPage = await DeskPage.openIn(page);
        await deskPage.contentMenuPanel.btnKuenstler.hover({ force: true });
        await deskPage.contentMenuPanel.btnKuenstler.click();
        await deskPage.artistMenuPanel.btnNew.click();
        await expect(deskPage.artistPanel.root).toBeVisible({ timeout: 20000 });
        await expect(deskPage.artistPanel.languages.root).toBeVisible({ timeout: 20000 });
        await expect(deskPage.artistPanel.languages.german.root).toBeVisible({ timeout: 20000 });

        await deskPage.artistPanel.languages.german.inptTitle.fill(`${prefix} Name`);
        await deskPage.artistPanel.languages.german.inptSubtitle.fill(`${prefix} Untertitel`);

        await expect(deskPage.artistPanel.languages.german.banner.root).toBeVisible({ timeout: 2000 });
        await deskPage.artistPanel.languages.german.banner.btnToggle.click();
        await deskPage.artistPanel.languages.german.banner.inptFile.setInputFiles({ name: `${prefix}-1px-white.png`, mimeType: 'image/png', buffer: white1pxPngBuffer });
        await deskPage.artistPanel.languages.german.banner.inptCaption.fill(`${prefix} Image caption`);
        await deskPage.artistPanel.languages.german.banner.inptAlt.fill(`${prefix} Image alt`);
        await deskPage.artistPanel.languages.german.banner.inptCredits.fill(`${prefix} Image credits`);

        await deskPage.artistPanel.languages.german.textBoxContent.clickToActivateOverlay.click();
        await deskPage.artistPanel.languages.german.textBoxContent.textbox.fill(`${prefix} content`);

        await deskPage.artistPanel.languages.german.textBoxContent.btnAddYoutube.click();
        await deskPage.artistPanel.languages.german.textBoxContent.overlayYouTube.inptUrl.fill(`https://www.youtube.com/watch?v=mYdf0yqK_Fc`);
        await deskPage.artistPanel.languages.german.textBoxContent.overlayYouTube.btnClose.click();

        await expect(deskPage.artistPanel.languages.german.textBoxContent.btnAddMedia).toBeVisible({ timeout: 2000 });
        await deskPage.artistPanel.languages.german.textBoxContent.btnAddMedia.click();
        await expect(deskPage.artistPanel.languages.german.textBoxContent.btnAddMediaMenuEntryGalery).toBeVisible({ timeout: 2000 });
        await deskPage.artistPanel.languages.german.textBoxContent.btnAddMediaMenuEntryGalery.click();
        await deskPage.artistPanel.languages.german.textBoxContent.overlayBildergalerie.btnAdd.click();
        await deskPage.artistPanel.languages.german.textBoxContent.overlayBildergalerie.overlayEditBild.btnSelect.click();
        await deskPage.artistPanel.languages.german.textBoxContent.overlayBildergalerie.overlayEditBild.btnSelectMenuEntryMedia.click();
        const mediaPage: MediaPage = new MediaPage(page);
        await mediaPage.imgByName(`1px-white.png`).click();
        await deskPage.artistPanel.languages.german.textBoxContent.overlayBildergalerie.overlayEditBild.inptAltText.fill(`${prefix} alt`);
        await deskPage.artistPanel.languages.german.textBoxContent.overlayBildergalerie.overlayEditBild.inptCaption.fill(`${prefix} caption`);
        await deskPage.artistPanel.languages.german.textBoxContent.overlayBildergalerie.overlayEditBild.inptCredits.fill(`${prefix} credits`);
        await deskPage.artistPanel.languages.german.textBoxContent.overlayBildergalerie.overlayEditBild.btnClose.click();
        await deskPage.artistPanel.languages.german.textBoxContent.overlayBildergalerie.btnClose.click();

        await deskPage.artistPanel.slctKategorie.selectOption('Musik');
        await deskPage.artistPanel.btnGenerateSlug.click();
        await expect(deskPage.artistPanel.btnReviewChanges).toHaveText('just now', { timeout: 10000 });
        await expect(deskPage.artistPanel.btnPublish).toBeEnabled();
        await deskPage.artistPanel.btnPublish.click();

        const successToast: Toast = Toast.fromText(page, 'The document was published');
        return await successToast.icnClose.click();
    }

    public static async deleteArtist(page: Page, prefix: string) {
        const deskPage: DeskPage = await DeskPage.openIn(page);
        await deskPage.contentMenuPanel.btnKuenstler.hover({ force: true });
        await deskPage.contentMenuPanel.btnKuenstler.click();

        await deskPage.artistMenuPanel.getItemByName(prefix).hover({ force: true });
        await deskPage.artistMenuPanel.getItemByName(prefix).click();

        await deskPage.artistPanel.btnOpenDocumentActions.click();

        await MenuButtonPopover.getItemByText(page, 'Delete').click();
        await page.getByTestId('confirm-delete-button').click();

        let successToast: Toast = Toast.fromText(page, 'The document was successfully deleted');
        await successToast.icnClose.click();

        const mediaPage: MediaPage = await MediaPage.openIn(page);
        await mediaPage.imgByName('1px-white.png').click();
        await mediaPage.assetDetailsModal.btnDelete.click();
        await mediaPage.assetDetailsModal.deleteConfirmModal.btnConfirm.click();

        successToast = Toast.fromText(page, '1 asset deleted');
        await successToast.icnClose.click();
    }
}