import { Locator } from "@playwright/test";
import { Panel } from "./panel";

export class ArtistBannerSpoiler extends Panel {

    public get root(): Locator {
        const btnLocator: Locator = this._parentLocator.getByRole('button', { name: 'Banner' });
        return this._parentLocator.locator('fieldset', { has: btnLocator });
    }

    .getByTestId('field-languages.de.subtitle').getByTestId('string-input')

}