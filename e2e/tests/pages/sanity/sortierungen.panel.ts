import { Locator } from "@playwright/test";
import { Panel } from "./panel";

export class SortierungenPanel extends Panel {
    public static readonly URL = "dev/desk/sortierungen";
    public artistSortierungen: SortierungenEntityPanel = new SortierungenEntityPanel(this.root, 'field-artists')

    public get root(): Locator {
        return this._parentLocator.locator('#sortings-sortierungen-0');
    }

    public get btnPublish(): Locator {
        return this.root.getByTestId('pane-footer').getByTestId('action-Publish');
    }

    public get btnReviewChanges(): Locator {
        return this.root.getByTestId('pane-footer').getByTestId('review-changes-button');
    }
}

class SortierungenEntityPanel extends Panel {
    constructor(parentLocator: Locator, private _testId: string) {
        super(parentLocator);
    }

    public get root(): Locator {
        return this._parentLocator.getByTestId(this._testId);
    }

    public get btnAdd(): Locator {
        return this.root.getByRole('button', { name: 'Add Item' })
    }

    public get inptAddSearch(): Locator {
        return this.root.locator('input[inputmode="search"]');
    }

    public getSearchResultByIndex(index: number): Locator {
        return this.root.page().locator('[data-ui="AutoComplete__resultsList] > li').nth(index);
    }

    public getSearchResultByText(text: string): Locator {
        return this.root.page().locator('[data-ui="AutoComplete__resultsList"]').getByRole('button', { name: text });
    }

    public getRowMenuButtonByText(text: string): Locator {
        return this.root.getByTestId('change-bar-wrapper').filter({ hasText: text }).locator('svg[data-sanity-icon="ellipsis-vertical"]');
    }

}