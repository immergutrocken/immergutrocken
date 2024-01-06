import { Locator } from "@playwright/test";
import { Panel } from "./panel";

export class ArtistPanel extends Panel {
    public readonly languages: SectionLanguages = new SectionLanguages(this.root);

    public get root(): Locator {
        return this._parentLocator.getByTestId('document-pane');
    }

    public get inptSlug(): Locator {
        return this.root.getByTestId('field-slug').getByLabel('Slug');
    }

    public get btnGenerateSlug(): Locator {
        return this.root.getByTestId('field-slug').getByRole('button', { name: 'Generate' });
    }

    public get inptAutor(): Locator {
        return this.root.getByTestId('field-author').getByLabel('Autor');
    }

    public get slctKategorie(): Locator {
        return this.root.getByTestId('field-category').locator('select');
    }

    public get btnPublish(): Locator {
        return this.root.getByTestId('action-Publish');
    }

    public get btnReviewChanges(): Locator {
        return this.root.getByTestId('review-changes-button');
    }

    public get btnOpenDocumentActions(): Locator {
        return this.root.getByRole('button', { name: 'Open document actions' })
    }

}

class SectionLanguages extends Panel {

    public readonly german: SectionLanguage = new SectionLanguage(this.root, 'de');
    public readonly sectionEnglish: SectionLanguage = new SectionLanguage(this.root, 'en');

    public get root(): Locator {
        return this._parentLocator.getByTestId("field-languages");
    }
}

class SectionLanguage extends Panel {

    public readonly banner: SectionBanner = new SectionBanner(this.root, this._language);
    public readonly textBoxContent: TextBoxContent = new TextBoxContent(this.root, this._language);

    constructor(parentLocator: Locator, private _language: "de" | "en") {
        super(parentLocator);
    }

    public get root(): Locator {
        return this._parentLocator.getByTestId(`field-languages.${this._language}`);
    }

    public get inptTitle(): Locator {
        return this.root.getByTestId('field-languages.de.title').getByTestId('string-input');
    }

    public get inptSubtitle(): Locator {
        return this.root.getByTestId('field-languages.de.subtitle').getByTestId('string-input');
    }
}

class SectionBanner extends Panel {
    constructor(parentLocator: Locator, private _language: "de" | "en") {
        super(parentLocator);
    }

    public get x(): Locator {
        return this._parentLocator.getByRole('button', { name: 'Banner' });
    }

    public get root(): Locator {
        return this._parentLocator.locator('fieldset[data-level="3"]', { hasText: "Banner" });
    }

    public get btnToggle(): Locator {
        return this.root.getByRole('button', { name: 'Banner' })
    }

    public get inptFile(): Locator {
        return this.root.getByTestId('file-button-input');
    }

    public get inptCaption(): Locator {
        return this.root.getByTestId(`field-languages.${this._language}.banner.caption`).getByTestId('string-input');
    }

    public get inptAlt(): Locator {
        return this.root.getByTestId(`field-languages.${this._language}.banner.alt`).getByTestId('string-input');
    }

    public get inptCredits(): Locator {
        return this.root.getByTestId(`field-languages.${this._language}.banner.credits`).getByTestId('string-input');
    }
}

class TextBoxContent extends Panel {
    public readonly overlayYouTube: OverlayYouTube = new OverlayYouTube(this.root);
    public readonly overlayBildergalerie: OverlayBildergalerie = new OverlayBildergalerie(this.root);

    constructor(parentLocator: Locator, private _language: "en" | "de") {
        super(parentLocator);
    }

    public get root(): Locator {
        return this._parentLocator.getByTestId(`field-languages.${this._language}.content`);
    }

    public get clickToActivateOverlay(): Locator {
        return this.root.getByText('Click to activate');
    }

    public get textbox(): Locator {
        return this.root.getByRole('textbox');
    }

    public get btnAddMedia(): Locator {
        return this.root.locator('button svg[data-sanity-icon="add"]');
    }

    public get btnAddYoutube(): Locator {
        return this.root.getByRole('button', { name: 'Insert YouTube Video (block)' });
    }

    public get btnAddMediaMenuEntryGalery(): Locator {
        return this.root.page().locator('[data-ui="MenuButton__popover"]').getByRole('menuitem', { name: 'Insert Bildergalerie (block)' });
    }

}

class OverlayYouTube extends Panel {
    public get root(): Locator {
        return this._parentLocator.page().locator('[data-testid="document-panel-portal"] [data-testid="default-edit-object-dialog"]', { hasText: 'Edit YouTube Video' })
    }

    public get inptUrl(): Locator {
        return this.root.getByLabel('YouTube video URL');
    }

    public get btnClose(): Locator {
        return this.root.getByLabel('Close dialog');
    }
}

class OverlayBildergalerie extends Panel {

    public readonly overlayEditBild: OverlayEditBild = new OverlayEditBild(this.root);

    public get root(): Locator {
        return this._parentLocator.page().locator('[data-testid="document-panel-portal"] [data-testid="default-edit-object-dialog"]', { hasText: 'Edit Bildergalerie' })
    }

    public get btnAdd(): Locator {
        return this.root.getByRole('button', { name: 'Add item' });
    }

    public get btnClose(): Locator {
        return this.root.getByLabel('Close dialog');
    }
}

class OverlayEditBild extends Panel {
    public get root(): Locator {
        return this._parentLocator.page().locator('[role="dialog"]', { hasText: "Edit Bild", hasNotText: "Edit Bildergalerie" });
    }

    public get btnSelect(): Locator {
        return this.root.getByRole('button', { name: 'Select' })
    }

    public get btnSelectMenuEntryUploadedImages(): Locator {
        return this.root.page().locator('[data-ui="MenuButton__popover"]').getByRole('menuitem', { name: 'Uploaded Images' });
    }

    public get btnSelectMenuEntryMedia(): Locator {
        return this.root.page().locator('[data-ui="MenuButton__popover"]').getByRole('menuitem', { name: 'Media' });
    }

    public get inptCaption(): Locator {
        return this.root.getByLabel('Caption');
    }

    public get inptAltText(): Locator {
        return this.root.getByLabel('Alternativer Text');
    }

    public get inptCredits(): Locator {
        return this.root.getByLabel('Credits');
    }

    public get btnClose(): Locator {
        return this.root.getByLabel('Close dialog');
    }

}
