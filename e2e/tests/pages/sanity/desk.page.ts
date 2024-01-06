import { Locator, Page } from "@playwright/test";
import { ArtistMenuPanel } from "./artist-menu.panel";
import { ArtistPanel } from "./artist.panel";
import { ContentMenuPanel } from "./content-menu.panel";
import { SortierungenPanel } from "./sortierungen.panel";

export class DeskPage {
    public static readonly URL = "dev/desk";

    public readonly contentMenuPanel: ContentMenuPanel = new ContentMenuPanel(this.root);
    public readonly artistMenuPanel: ArtistMenuPanel = new ArtistMenuPanel(this.root);
    public readonly artistPanel: ArtistPanel = new ArtistPanel(this.root);
    public readonly sortierungenPanel: SortierungenPanel = new SortierungenPanel(this.root);

    constructor(private _page: Page) { }

    public get root(): Locator {
        return this._page.getByTestId('studio-layout');
    }

    public static async openIn(page: Page): Promise<DeskPage> {
        await page.goto(`${process.env.SANITY_BASE_URL}${DeskPage.URL}`);
        return new DeskPage(page);
    }

}