import { Locator } from "@playwright/test";
import { Panel } from "./panel";

export class ArtistMenuPanel extends Panel {
    public get root(): Locator {
        return this._parentLocator.locator('#artist-artist-0');
    }

    public get btnNew(): Locator {
        return this.root.getByTestId('action-intent-button');
    }

    public getItemByName(name: string): Locator {
        return this.root.getByRole('link', { name })
    }

}